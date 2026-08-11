import { defaultTeacherProfile } from "../data/teacherProfileData";
import { appConfig } from "../config/env";
import { getCurrentUser } from "./authService";

export const TEACHER_PROFILE_KEY = "edutrack_teacher_profile";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

export async function getTeacherProfile() {
  if (!appConfig.useMockAuth) {
    const user = await getCurrentUser();
    return {
      ...user,
      username: user.nama_pengguna || "—",
      email: user.email || "—",
      systemRole: "Guru",
      internalId: user.id,
      identityNumber: user.nama_pengguna || "—",
      joinedAt: "—",
      employmentStatus: "Aktif",
      lastLogin: "Sesi saat ini",
      demoIpAddress: "Tidak disimpan di frontend",
      assignedClasses: user.teachingAssignments || [],
    };
  }
  await wait(450);
  try {
    const stored = JSON.parse(localStorage.getItem(TEACHER_PROFILE_KEY));
    if (stored?.id === defaultTeacherProfile.id) return stored;
  } catch {
    // Gunakan profil demo terverifikasi ketika cache tidak valid.
  }
  localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(defaultTeacherProfile));
  return defaultTeacherProfile;
}
