import { appConfig } from "../config/env";
import { getStoredUser } from "../stores/authStore";
import { getActiveHomeroomClassId } from "../utils/teacherPermissions";
import { api } from "./apiClient";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const MOCK_STATUS_KEY = "edutrack_mock_homeroom_report_status";

const mockSubjects = [
  { id: "SUB-001", name: "Matematika Wajib", teacherName: "Budi Raharjo", complete: true },
  { id: "SUB-002", name: "Ilmu Pengetahuan Alam", teacherName: "Siti Rahmawati", complete: true },
  { id: "SUB-003", name: "Bahasa Indonesia", teacherName: "Dewi Lestari", complete: true },
];

function assertHomeroomClassAccess(classId) {
  if (!classId || getActiveHomeroomClassId(getStoredUser()) !== classId) {
    throw new Error("UNAUTHORIZED_HOMEROOM_REPORT_ACCESS");
  }
}

function readMockStatus() {
  return localStorage.getItem(MOCK_STATUS_KEY) || "Draft";
}

export async function getHomeroomWorkspace(classId) {
  assertHomeroomClassAccess(classId);
  if (!appConfig.useMockApi) {
    const [rawOverview, rawCompleteness] = await Promise.all([
      api.get(`/homeroom/classes/${classId}/overview`),
      api.get(`/homeroom/classes/${classId}/completeness`),
    ]);
    let status = "Draft";
    const firstStudentId = rawOverview.students?.[0]?.id;
    if (firstStudentId) {
      try {
        const report = await api.get(`/homeroom/report-cards/${firstStudentId}`);
        status = report.status || status;
      } catch (error) {
        if (error.status !== 404) throw error;
      }
    }
    const scores = rawOverview.grades
      .map((item) => item.final_score)
      .filter((value) => value != null)
      .map(Number);
    return {
      status,
      overview: {
        ...rawOverview,
        studentCount: rawOverview.students.length,
        average: scores.length
          ? Number((scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(2))
          : null,
      },
      completeness: {
        subjects: rawCompleteness.map((item) => ({
          ...item,
          id: item.subjectId,
          name: item.subjectName,
          complete: item.isComplete,
        })),
        complete: rawCompleteness.length > 0 && rawCompleteness.every((item) => item.isComplete),
      },
    };
  }
  await wait(450);
  return {
    status: readMockStatus(),
    overview: { classId, studentCount: 32, average: 84.6, attendancePercentage: 91 },
    completeness: { subjects: mockSubjects, complete: mockSubjects.every((subject) => subject.complete) },
  };
}

export async function finalizeHomeroomReports(classId) {
  assertHomeroomClassAccess(classId);
  if (!appConfig.useMockApi) return api.post(`/homeroom/classes/${classId}/finalize`);
  await wait(700);
  localStorage.setItem(MOCK_STATUS_KEY, "Finalized");
  return { finalizedCount: 32 };
}

export async function distributeHomeroomReports(classId) {
  assertHomeroomClassAccess(classId);
  if (!appConfig.useMockApi) return api.post(`/homeroom/classes/${classId}/distribute`);
  await wait(700);
  if (readMockStatus() !== "Finalized") throw new Error("REPORT_NOT_FINALIZED");
  localStorage.setItem(MOCK_STATUS_KEY, "Distributed");
  return { distributedCount: 32 };
}

export async function saveHomeroomReportNote(studentId, note) {
  if (!appConfig.useMockApi) return api.patch(`/homeroom/report-cards/${studentId}/note`, { note });
  await wait(300);
  return { studentId, note };
}
