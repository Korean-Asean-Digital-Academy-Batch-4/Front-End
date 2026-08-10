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
  const data = await api.get("/teacher/classes");
  const classes = data.items || data.classes || data || [];
  const teachingAssignments = classes.map((item) => ({
    id: item.id || item.classId,
    assignmentId: item.assignmentId || item.id || item.classId,
    classId: item.classId || item.id,
    name: item.name || item.className,
    subjectId: item.subjectId || item.subject?.id,
    subjectName: item.subjectName || item.subject?.name || "Mata Pelajaran",
    academicYear: item.academicYear || item.academicYearName || "",
    semester: item.semester || item.semesterName || "",
    status: item.status || "active",
  })).filter((item) => item.status === "active");
  updateStoredUser({ teachingAssignments });
  return teachingAssignments;
}
