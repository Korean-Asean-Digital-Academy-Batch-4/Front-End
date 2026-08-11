import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useState } from "react";
import EditFormField from "../../components/superadmin/EditFormField";
import TableActionButton from "../../components/superadmin/TableActionButton";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { teacherDirectory } from "../../data/superAdminManagementData";
import { cn } from "../../utils/cn";

const avatarTones = {
  blue: "bg-[#E4E9FF] text-[#173A75]",
  orange: "bg-[#FFE4D8] text-[#7C3418]",
  slate: "bg-[#E7EAED] text-[#4F5665]",
  lavender: "bg-[#E5E9FF] text-[#354B8C]",
};

export default function TeacherDirectoryPage() {
  const [teachers, setTeachers] = useState(() => teacherDirectory.map((teacher) => ({ ...teacher })));
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ name: "", nip: "", email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [actionMessage, setActionMessage] = useState("");

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({ name: teacher.name, nip: teacher.nip, email: teacher.email });
    setFormErrors({});
  };

  const closeEditModal = () => {
    setEditingTeacher(null);
    setFormErrors({});
  };

  const updateTeacherForm = (field) => (event) => {
    setTeacherForm((current) => ({ ...current, [field]: event.target.value }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
  };

  const saveTeacher = (event) => {
    event.preventDefault();
    const errors = {};
    if (!teacherForm.name.trim()) errors.name = "Nama Guru wajib diisi.";
    if (!teacherForm.nip.trim()) errors.nip = "NIP wajib diisi.";
    if (!teacherForm.email.trim()) errors.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherForm.email.trim())) errors.email = "Format email tidak valid.";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    setTeachers((current) => current.map((teacher) => teacher.id === editingTeacher.id ? {
      ...teacher,
      name: teacherForm.name.trim(),
      nip: teacherForm.nip.trim(),
      email: teacherForm.email.trim(),
    } : teacher));
    setActionMessage(`Data ${teacherForm.name.trim()} berhasil diperbarui.`);
    closeEditModal();
  };

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-[#20232D]">Database Guru</h1>
        <p className="mt-2 text-base text-[#697184]">Kelola dan lihat data direktori guru.</p>
      </header>

      <section className="mt-10 overflow-hidden rounded-lg border border-[#C8D0DF] bg-white shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-label="Direktori guru">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left">
            <thead className="bg-[#F4F5F7] text-sm font-semibold uppercase tracking-[0.06em] text-[#697184]">
              <tr>
                <th scope="col" className="w-[240px] px-8 py-4">Nama Guru</th>
                <th scope="col" className="w-[300px] px-5 py-4">Email Guru</th>
                <th scope="col" className="w-[170px] px-5 py-4">Role 1</th>
                <th scope="col" className="w-[220px] px-5 py-4">Role 2</th>
                <th scope="col" className="w-24 px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7DCE7] text-sm text-[#343946]">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-[#FAFBFD]">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium", avatarTones[teacher.avatarTone])}>
                        {teacher.initials}
                      </span>
                      <span className="font-medium text-[#20232D]">{teacher.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-[#555D6E]">{teacher.email}</td>
                  <td className="px-5 py-5">
                    {teacher.isHomeroomTeacher ? (
                      <Badge className="border border-[#BFC9F7] bg-[#E8EBFF] px-3 py-1 font-medium text-[#26355D]">Wali Kelas</Badge>
                    ) : (
                      <span className="text-[#697184]">-</span>
                    )}
                  </td>
                  <td className="px-5 py-5 leading-5">
                    <span className="block">Guru Mapel</span>
                    <span className="block">{teacher.subjectAssignment}</span>
                  </td>
                  <td className="px-5 py-5 text-center">
                    <TableActionButton icon={Pencil} label={`Edit ${teacher.name}`} onClick={() => handleEditTeacher(teacher)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-[#D7DCE7] bg-[#FAFBFD] px-5 py-4 text-xs text-[#697184]">
          <p>Menampilkan 1-4 dari 4 entri</p>
          <nav aria-label="Pagination direktori guru" className="flex items-center gap-1">
            <button type="button" aria-label="Halaman sebelumnya" disabled className="flex h-8 w-8 items-center justify-center rounded-md text-[#8A93A6] disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Halaman 1" aria-current="page" className="h-8 min-w-8 rounded-sm bg-[#0756D9] px-2 text-white">1</button>
            <button type="button" aria-label="Halaman berikutnya" disabled className="flex h-8 w-8 items-center justify-center rounded-md text-[#8A93A6] disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </footer>
        <p aria-live="polite" className="sr-only">{actionMessage}</p>
      </section>
      <Modal open={Boolean(editingTeacher)} onClose={closeEditModal} title="Edit Data Guru" description="Perbarui identitas guru tanpa mengubah penugasan mengajar.">
        <form noValidate onSubmit={saveTeacher} className="space-y-4">
          <EditFormField id="teacher-name" label="Nama Guru" value={teacherForm.name} onChange={updateTeacherForm("name")} error={formErrors.name} autoFocus />
          <EditFormField id="teacher-nip" label="NIP" value={teacherForm.nip} onChange={updateTeacherForm("nip")} error={formErrors.nip} inputMode="numeric" />
          <EditFormField id="teacher-email" label="Email" type="email" value={teacherForm.email} onChange={updateTeacherForm("email")} error={formErrors.email} />
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeEditModal}>Batal</Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
