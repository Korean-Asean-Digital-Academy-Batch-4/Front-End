import { appConfig } from "../config/env";
import { getStoredUser, updateStoredUser } from "../stores/authStore";
import { canManageGrades, getActiveTeachingAssignments } from "../utils/teacherPermissions";
import { api } from "./apiClient";

export async function getTeacherClasses() {
  let user = getStoredUser();
  if (!canManageGrades(user)) throw new Error("UNAUTHORIZED_GRADE_ACCESS");
  if (appConfig.useMockApi) {
    if (!Array.isArray(user.teachingAssignments) && Array.isArray(user.assignedClasses)) {
      const teachingAssignments = user.assignedClasses.map((assignment) => ({
        ...assignment,
        id: assignment.id || assignment.classId,
        classId: assignment.classId || assignment.id,
        status: assignment.status || "active",
      }));
      user = updateStoredUser({ teachingAssignments });
    }
    return getActiveTeachingAssignments(user);
  }

  const classes = await api.get("/teacher/classes");
  const teachingAssignments = classes.map((item) => ({
    id: item.id,
    assignmentId: `${item.id}:${item.subject_name}`,
    classId: item.id,
    name: item.name,
    subjectId: item.subject_id || item.subject_name,
    subjectName: item.subject_name,
    gradeLevel: item.grade_level,
    academicYear: item.academic_year_name || "-",
    semester: item.semester_name || "-",
    status: "active",
  }));
  updateStoredUser({ teachingAssignments, assignedClasses: teachingAssignments });
  return teachingAssignments;
}
