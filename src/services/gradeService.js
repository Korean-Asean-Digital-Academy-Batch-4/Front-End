import {
  defaultLearningTopics,
  GRADE_STATUSES,
  gradeStudents,
  homeroomFinalGrades,
  homeroomSubjects,
  initialGrades,
} from "../data/gradeData";
import { assessmentComponents } from "../data/assessmentComponents";
import { appConfig } from "../config/env";
import { getStoredUser } from "../stores/authStore";
import {
  canManageGrades,
  canManageTeachingAssignment,
  canViewClassSubjectGrades,
  getActiveHomeroomClassId,
  getActiveTeachingAssignments,
} from "../utils/teacherPermissions";
import {
  getGradeDraft,
  getOfficialGradeRecord,
  getTopicRecord,
  saveGradeDraftRecord,
  saveOfficialGradeRecord,
  saveTopicRecord,
} from "../stores/gradeStore";
import { getFinalizedStudentIds } from "../stores/reportStore";
import { api } from "./apiClient";
import { isValidGradePayload } from "../utils/gradeValidation";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

function normalizeSemester(value) {
  return String(value).toUpperCase();
}

function resolveAssignment(filters) {
  const user = getStoredUser();
  if (!canManageGrades(user) || !canManageTeachingAssignment(user, filters)) {
    throw new Error("UNAUTHORIZED_ASSIGNMENT");
  }
  const assignedClass = getActiveTeachingAssignments(user).find(
    (item) =>
      (item.classId || item.id) === filters.classId &&
      item.subjectId === filters.subjectId &&
      item.academicYear === filters.academicYear &&
      normalizeSemester(item.semester) === normalizeSemester(filters.semester),
  );

  if (!assignedClass) throw new Error("UNAUTHORIZED_ASSIGNMENT");

  return {
    assignmentId: assignedClass.assignmentId || (filters.classId === "CLS-001" ? "ASN-001" : "ASN-002"),
    ...assignedClass,
    id: assignedClass.classId || assignedClass.id,
    classId: assignedClass.classId || assignedClass.id,
  };
}

function assertValidGrades(grades) {
  if (!isValidGradePayload(grades, assessmentComponents)) {
    throw new Error("INVALID_GRADE_VALUE");
  }
}

function getGradeLockState(filters, grades) {
  const lockedStudentIds = getFinalizedStudentIds(filters);
  const officialGrades = getOfficialGradeRecord(filters)?.grades || {};
  const studentIds = new Set([
    ...Object.keys(initialGrades),
    ...Object.keys(officialGrades),
    ...Object.keys(grades || {}),
  ]);
  const currentGrades = Object.fromEntries(
    [...studentIds].map((studentId) => [
      studentId,
      { ...initialGrades[studentId], ...officialGrades[studentId] },
    ]),
  );
  lockedStudentIds.forEach((studentId) => {
    if (
      Object.prototype.hasOwnProperty.call(grades || {}, studentId) &&
      JSON.stringify(grades[studentId]) !== JSON.stringify(currentGrades[studentId])
    ) {
      throw new Error("REPORT_FINALIZED_GRADE_LOCKED");
    }
  });
  const editableGrades = Object.fromEntries(
    Object.entries(grades || {}).filter(([studentId]) => !lockedStudentIds.has(studentId)),
  );
  return { lockedStudentIds, currentGrades, editableGrades };
}

export async function getGradeSheet(filters) {
  const authorizedAssignment = resolveAssignment(filters);
  const lockedStudentIds = [...getFinalizedStudentIds(filters)];
  if (!appConfig.useMockApi) {
    const rows = await api.get(`/teacher/classes/${filters.classId}/grades`);
    const studentMap = new Map();
    const grades = {};
    rows.forEach((row) => {
      if (!studentMap.has(row.student_id)) {
        studentMap.set(row.student_id, { id: row.student_id, name: row.student_name });
      }
      grades[row.student_id] ||= {};
      grades[row.student_id][row.component_code] = row.score == null ? null : Number(row.score);
    });
    return {
      assignment: authorizedAssignment,
      students: [...studentMap.values()],
      grades,
      localDraft: getGradeDraft(filters),
      status: GRADE_STATUSES.DRAFT,
      savedAt: null,
      lockedStudentIds,
    };
  }
  await wait(650);
  const officialRecord = getOfficialGradeRecord(filters);
  const localDraft = getGradeDraft(filters);
  const visibleStudents = filters.classId === "CLS-002" ? gradeStudents.slice(0, 1) : gradeStudents;
  const visibleStudentIds = new Set(visibleStudents.map((student) => student.id));
  const storedGrades = officialRecord?.grades || {};
  const baseGrades = Object.fromEntries(
    gradeStudents.map((student) => [
      student.id,
      { ...initialGrades[student.id], ...storedGrades[student.id] },
    ]),
  );
  const grades = Object.fromEntries(
    Object.entries(baseGrades).filter(([studentId]) => visibleStudentIds.has(studentId)),
  );

  return {
    assignment: authorizedAssignment,
    students: visibleStudents,
    grades,
    localDraft,
    status: officialRecord?.status || GRADE_STATUSES.DRAFT,
    savedAt: officialRecord?.savedAt || null,
    lockedStudentIds,
  };
}

export async function saveGradeDraft(payload) {
  resolveAssignment(payload);
  assertValidGrades(payload.grades);
  const { editableGrades } = getGradeLockState(payload, payload.grades);
  if (!Object.keys(editableGrades).length) throw new Error("ALL_GRADES_LOCKED");
  await wait(120);
  return saveGradeDraftRecord({ ...payload, grades: editableGrades, draftSavedAt: new Date().toISOString() });
}

export async function saveGrades(payload) {
  resolveAssignment(payload);
  assertValidGrades(payload.grades);
  const { lockedStudentIds, currentGrades, editableGrades } = getGradeLockState(payload, payload.grades);
  if (!Object.keys(editableGrades).length) throw new Error("ALL_GRADES_LOCKED");
  const safeGrades = { ...payload.grades };
  lockedStudentIds.forEach((studentId) => {
    if (currentGrades[studentId]) safeGrades[studentId] = currentGrades[studentId];
  });
  if (!appConfig.useMockApi) {
    const entries = Object.entries(editableGrades).flatMap(([studentId, scores]) =>
      Object.entries(scores).map(([componentCode, score]) => ({
        studentId,
        componentCode,
        score: score === "" || score === undefined ? null : Number(score),
      })),
    );
    const data = await api.put(`/teacher/classes/${payload.classId}/grades`, { entries });
    return {
      success: true,
      savedAt: new Date().toISOString(),
      data: { ...data, grades: safeGrades, status: GRADE_STATUSES.DRAFT },
    };
  }
  await wait(800);
  const record = saveOfficialGradeRecord({
    ...payload,
    grades: { ...currentGrades, ...editableGrades },
    status: payload.status || GRADE_STATUSES.DRAFT,
    savedAt: new Date().toISOString(),
    savedBy: getStoredUser().id,
  });
  return { success: true, savedAt: record.savedAt, data: record };
}

export async function getLearningTopics(assignmentId, filters) {
  const assignment = resolveAssignment(filters);
  if (assignment.assignmentId !== assignmentId) throw new Error("UNAUTHORIZED_ASSIGNMENT");
  if (!appConfig.useMockApi) {
    const data = await api.get(`/teacher/classes/${filters.classId}/assessment-topics`);
    return Object.fromEntries(
      data.topics.map((item) => [item.component_code, item.topic || ""]),
    );
  }
  await wait(250);
  const record = getTopicRecord(assignmentId);
  return { ...defaultLearningTopics, ...record?.topics };
}

export async function saveLearningTopics(payload) {
  const assignment = resolveAssignment(payload);
  if (assignment.assignmentId !== payload.assignmentId) {
    throw new Error("UNAUTHORIZED_ASSIGNMENT");
  }
  if (!appConfig.useMockApi) {
    return api.put(`/teacher/classes/${payload.classId}/assessment-topics`, {
      topics: assessmentComponents.map((component) => ({
        componentCode: component.id,
        topic: payload.topics[component.id] || "",
      })),
    });
  }
  await wait(650);
  return saveTopicRecord({ ...payload, savedAt: new Date().toISOString(), savedBy: getStoredUser().id });
}

export async function getHomeroomSubjectGrades({ academicYear, semester, subjectId }) {
  await wait(500);
  const user = getStoredUser();
  if (!canViewClassSubjectGrades(user)) {
    throw new Error("UNAUTHORIZED_HOMEROOM_ACCESS");
  }
  const classId = getActiveHomeroomClassId(user);
  if (!classId) throw new Error("INVALID_HOMEROOM_ASSIGNMENT");

  const subject = homeroomSubjects.find((item) => item.id === subjectId);
  if (!subject || academicYear !== "2026/2027" || normalizeSemester(semester) !== "GANJIL") {
    throw new Error("INVALID_HOMEROOM_GRADE_FILTER");
  }

  return {
    class: {
      id: classId,
      name: user.homeroomAssignment.className || "Kelas Wali",
    },
    subject,
    students: classId === "CLS-001" ? gradeStudents : [],
    grades: JSON.parse(JSON.stringify(initialGrades)),
    finalGrades: { ...homeroomFinalGrades },
  };
}
