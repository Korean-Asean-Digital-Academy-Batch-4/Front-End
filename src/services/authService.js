import { homeroomTeacherUser, teacherUser } from "../data/teacherData";
import { secondaryStudentUser, studentUser } from "../data/studentData";
import { appConfig } from "../config/env";
import { api } from "./apiClient";

const accounts = [
  {
    email: "budi.raharjo@admin.edu",
    username: "budi.raharjo",
    password: "Admin123!",
    user: {
      id: "SUPERADMIN-001",
      name: "Budi Raharjo",
      email: "budi.raharjo@admin.edu",
      role: "admin",
      roleLabel: "Administrator",
      systemRoleLabel: "Administrator",
    },
  },
  {
    email: "admin@sekolah.edu",
    username: "admin",
    password: "Admin123!",
    user: {
      id: "USR-001",
      name: "Administrator EduTrack",
      email: "admin@sekolah.edu",
      role: "admin",
    },
  },
  { email: "guru@sekolah.edu", username: "guru", password: "Guru123!", user: teacherUser },
  { email: "walikelas@sekolah.edu", username: "walikelas", password: "Wali123!", user: homeroomTeacherUser },
  {
    email: "siswa@sekolah.edu",
    username: studentUser.username,
    password: "Siswa123!",
    user: studentUser,
  },
  {
    email: "raka@sekolah.edu",
    username: secondaryStudentUser.username,
    password: "Siswa123!",
    user: secondaryStudentUser,
  },
];

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

export async function login({ username, password }) {
  if (!appConfig.useMockApi) {
    const data = await api.post("/auth/login", { identifier: username.trim(), password }, { auth: false });
    const homeroomAssignment = data.profile?.homeroomAssignment ?? (
      data.profile?.isHomeroom && data.profile?.homeroomClassId
        ? {
            classId: data.profile.homeroomClassId,
            className: data.profile.homeroomClassName || "Kelas Wali",
            status: "active",
          }
        : null
    );
    const teachingAssignments = (
      data.profile?.teachingAssignments || data.profile?.assignedClasses || []
    ).map((assignment) => ({
      ...assignment,
      id: assignment.id || assignment.classId,
      classId: assignment.classId || assignment.id,
      status: assignment.status || "active",
    }));
    return {
      token: data.token,
      user: {
        ...data.profile,
        role: data.role,
        teachingAssignments,
        homeroomAssignment,
        isHomeroomTeacher: homeroomAssignment?.status === "active",
        homeroomClass: homeroomAssignment?.classId
          ? { id: homeroomAssignment.classId, name: homeroomAssignment.className || "Kelas Wali" }
          : null,
      },
    };
  }

  await wait(850);
  const normalizedUsername = username.trim().toLowerCase();
  const account = accounts.find(
    (item) =>
      (item.username.toLowerCase() === normalizedUsername || item.email === normalizedUsername) &&
      item.password === password,
  );

  if (!account) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    user: account.user,
    token: `demo-token-${account.user.id}`,
  };
}
