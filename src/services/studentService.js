import {
  mockAiInsight,
  studentAttendanceDataByStudentId,
  studentDashboardDataByStudentId,
  studentGradesDataByStudentId,
  studentProfileDataByStudentId,
  studentReportDataByStudentId,
} from "../data/studentData";
import { appConfig } from "../config/env";
import { getStoredUser } from "../stores/authStore";
import { api, downloadBlob } from "./apiClient";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const COMPONENT_NAMES = {
  T1: "Tugas 1", T2: "Tugas 2", T3: "Tugas 3",
  U1: "Ulangan Harian 1", U2: "Ulangan Harian 2", U3: "Ulangan Harian 3",
  UTS: "Ujian Tengah Semester", UAS: "Ujian Akhir Semester",
};

function requireCurrentStudent() {
  const user = getStoredUser();
  if (!user || user.role !== "student") throw new Error("UNAUTHORIZED_STUDENT_ACCESS");
  return user;
}

function demoForStudent(collection, user) {
  return collection[user.id] || Object.values(collection)[0];
}

function groupGradeRows(rows) {
  const subjects = new Map();
  rows.forEach((row) => {
    if (!subjects.has(row.subject_id)) {
      subjects.set(row.subject_id, {
        id: row.subject_id,
        subject: `${row.subject_name} ${row.grade_level}`,
        name: `${row.subject_name} ${row.grade_level}`,
        kkm: Number(row.kkm),
        badgeTone: "blue",
        components: [],
      });
    }
    subjects.get(row.subject_id).components.push({
      id: row.component_code,
      name: COMPONENT_NAMES[row.component_code] || row.component_code,
      topic: row.topic || null,
      score: row.score == null ? null : Number(row.score),
      weight: Number(row.weight_percent),
    });
  });
  return [...subjects.values()].map((subject) => {
    const complete = subject.components.every((component) => component.score != null);
    const average = complete
      ? subject.components.reduce((sum, component) => sum + component.score * component.weight, 0) / 100
      : 0;
    return { ...subject, average, score: complete ? Number(average.toFixed(2)) : null };
  });
}

function normalizeAttendance(items) {
  const percentages = items.map((item) => item.presentPercent).filter(Number.isFinite);
  const overallPercentage = percentages.length
    ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
    : 0;
  return {
    overallPercentage,
    subjects: items.map((item, index) => ({
      id: `${index}:${item.subjectName}`,
      name: item.subjectName,
      subjectName: item.subjectName,
      totalSessions: item.totalSessions,
      percentage: item.presentPercent ?? 0,
    })),
  };
}

export async function getStudentDashboard() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    const [gradeRows, attendanceRows] = await Promise.all([
      api.get("/student/grades"),
      api.get("/student/attendance"),
    ]);
    const subjects = groupGradeRows(gradeRows).map((subject) => ({
      id: subject.id,
      name: subject.name,
      score: subject.score,
      status: "Aktif",
      icon: "book",
      accent: "blue",
    }));
    return { attendancePercentage: normalizeAttendance(attendanceRows).overallPercentage, subjects };
  }
  await wait(350);
  const data = demoForStudent(studentDashboardDataByStudentId, user);
  return { ...data, subjects: data.subjects.map((subject) => ({ ...subject })) };
}

export async function getStudentAiInsight() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) return api.post("/student/ai-insight");
  await wait(1500);
  return { ...mockAiInsight, studentId: user.id };
}

export async function getStudentGrades({ academicYear, semester }) {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) return groupGradeRows(await api.get("/student/grades"));
  await wait(300);
  const grades = demoForStudent(studentGradesDataByStudentId, user);
  if (!grades || grades.academicYear !== academicYear || grades.semester !== semester) return [];
  return grades.subjects.map((subject) => ({
    ...subject,
    components: subject.components.map((component) => ({ ...component })),
  }));
}

export async function getStudentReport({ academicYear, semester }) {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    const report = await api.get("/student/report-card");
    if (report.status !== "Distributed") return report;
    const [gradeRows, attendanceRows] = await Promise.all([
      api.get("/student/grades"),
      api.get("/student/attendance"),
    ]);
    const subjects = groupGradeRows(gradeRows).map((subject) => ({
      id: subject.id,
      name: subject.name,
      score: subject.score,
    }));
    const scored = subjects.map((subject) => subject.score).filter(Number.isFinite);
    return {
      ...report,
      subjects,
      average: scored.length
        ? Number((scored.reduce((sum, score) => sum + score, 0) / scored.length).toFixed(2))
        : 0,
      attendancePercentage: normalizeAttendance(attendanceRows).overallPercentage,
      teacherNote: report.general_note || "-",
    };
  }
  await wait(300);
  const report = demoForStudent(studentReportDataByStudentId, user);
  if (!report || report.academicYear !== academicYear || report.semester !== semester) return null;
  return {
    ...report,
    teacherNote: report.teacherNote.replaceAll("{studentName}", user.name),
    subjects: report.subjects.map((subject) => ({ ...subject })),
  };
}

export async function getStudentProfile() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    return { ...user, roleLabel: "Siswa", joinedAt: "-", status: "Aktif" };
  }
  await wait(250);
  const profile = demoForStudent(studentProfileDataByStudentId, user);
  return { ...profile, id: user.id, name: user.name, role: user.role };
}

export async function getStudentAttendance() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) return normalizeAttendance(await api.get("/student/attendance"));
  await wait(300);
  return demoForStudent(studentAttendanceDataByStudentId, user);
}

export async function downloadStudentReport() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    const blob = await api.download("/student/report-card/download");
    downloadBlob(blob, `rapor-${user.nis || user.id}.txt`);
    return;
  }
  const report = demoForStudent(studentReportDataByStudentId, user);
  if (!report || report.status !== "Distributed") throw new Error("REPORT_NOT_DISTRIBUTED");
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.text("Rapor Semester EduTrack", 20, 24);
  doc.save(`rapor-${user.nis || user.id}.pdf`);
}
