import { assessmentComponents } from "../data/assessmentComponents";
import { api, downloadBlob } from "./apiClient";

export async function importAccounts(type, file) {
  const formData = new FormData();
  formData.append("file", file);
  const endpoint = type === "teacher" ? "/admin/teachers/import" : "/admin/students/import";
  return api.post(endpoint, formData);
}

export async function downloadAccountTemplate(type) {
  const endpoint = type === "teacher"
    ? "/admin/templates/teachers-csv"
    : "/admin/templates/students-csv";
  const blob = await api.download(endpoint);
  downloadBlob(blob, `template-${type === "teacher" ? "guru" : "siswa"}.csv`);
  return true;
}

export async function getUsers() {
  const [teachers, students] = await Promise.all([
    api.get("/admin/teachers"),
    api.get("/admin/students"),
  ]);
  return [
    ...teachers.items.map((item) => ({ ...item, role: "teacher", username: item.nip })),
    ...students.items.map((item) => ({ ...item, role: "student", username: item.nis })),
  ];
}

export async function createUser({ name, username, role }) {
  const endpoint = role === "teacher" ? "/admin/teachers" : "/admin/students";
  return api.post(endpoint, role === "teacher"
    ? { name, nip: username }
    : { name, nis: username });
}

export async function resetUserPassword(userId, role) {
  const resource = role === "teacher" ? "teachers" : "students";
  return api.patch(`/admin/${resource}/${userId}/reset-password`, {});
}

export async function getSubjects() {
  const subjects = await api.get("/admin/subjects");
  return subjects.map((subject) => ({
    id: subject.id,
    code: subject.id,
    name: subject.name,
    level: subject.grade_level,
    kkm: Number(subject.kkm),
    teacher: {
      id: subject.teacher_id,
      name: subject.teacher_name,
      username: subject.teacher_nip,
    },
    formula: "Komponen Utama",
  }));
}

export async function updateSubject(subjectId, patch) {
  const data = await api.patch(`/admin/subjects/${subjectId}`, {
    ...(patch.kkm !== undefined ? { kkm: patch.kkm } : {}),
    ...(patch.teacherId !== undefined ? { teacherId: patch.teacherId } : {}),
  });
  return {
    id: data.id,
    code: data.id,
    name: data.name,
    level: data.grade_level,
    kkm: Number(data.kkm),
    teacher: {
      id: data.teacher_id,
      name: patch.teacherName || "Guru Pengampu",
      username: "",
    },
    formula: "Komponen Utama",
  };
}

// Backend menyimpan komponen sebagai seed tetap dan belum menyediakan endpoint baca.
export async function getAssessmentComponents() {
  return assessmentComponents.map((item) => ({
    kode: item.id,
    nama: item.fullName,
    bobot: item.weight,
  }));
}

export async function getAcademicYears() {
  return api.get("/admin/academic-years");
}

export async function getClasses(options = {}) {
  return api.get("/admin/classes", { query: options });
}
