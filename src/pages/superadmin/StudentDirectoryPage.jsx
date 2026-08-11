import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import EditFormField from "../../components/superadmin/EditFormField";
import SuperAdminFilterSelect from "../../components/superadmin/SuperAdminFilterSelect";
import TableActionButton from "../../components/superadmin/TableActionButton";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import {
  assignmentAcademicYearOptions,
  assignmentSemesterOptions,
  classXStudentPreview,
  classXStudentTotal,
} from "../../data/assignmentWizardData";

const PAGE_SIZE = 4;
const classOptions = [{ id: "X-MIPA-1", name: "X-MIPA-1" }];

function paginationPages(currentPage, pageCount) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState(() => classXStudentPreview.map((student) => ({ ...student })));
  const [selectedSemester, setSelectedSemester] = useState("Ganjil");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2023/2024");
  const [selectedClass, setSelectedClass] = useState("X-MIPA-1");
  const [studentSearch, setStudentSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionMessage, setActionMessage] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: "", nis: "" });
  const [formErrors, setFormErrors] = useState({});

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => (
      student.name.toLowerCase().includes(query) || student.nis.includes(query)
    ));
  }, [studentSearch, students]);

  const totalStudents = studentSearch.trim() ? filteredStudents.length : classXStudentTotal;
  const pageCount = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
  const visibleStudents = page === 1 ? filteredStudents.slice(0, PAGE_SIZE) : [];
  const rangeStart = totalStudents === 0 ? 0 : ((page - 1) * PAGE_SIZE) + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalStudents);

  const showStudents = () => {
    setPage(1);
    setActionMessage(`Menampilkan ${selectedSemester} ${selectedAcademicYear}, kelas ${selectedClass}.`);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({ name: student.name, nis: student.nis });
    setFormErrors({});
  };

  const closeEditModal = () => {
    setEditingStudent(null);
    setFormErrors({});
  };

  const updateStudentForm = (field) => (event) => {
    setStudentForm((current) => ({ ...current, [field]: event.target.value }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
  };

  const saveStudent = (event) => {
    event.preventDefault();
    const errors = {};
    if (!studentForm.name.trim()) errors.name = "Nama Siswa wajib diisi.";
    if (!studentForm.nis.trim()) errors.nis = "NIS wajib diisi.";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    setStudents((current) => current.map((student) => student.id === editingStudent.id ? {
      ...student,
      name: studentForm.name.trim(),
      nis: studentForm.nis.trim(),
    } : student));
    setActionMessage(`Data ${studentForm.name.trim()} berhasil diperbarui.`);
    closeEditModal();
  };

  const handleDeleteStudent = (student) => {
    setActionMessage(`Hapus ${student.name} menunggu prototype lanjutan.`);
  };

  return (
    <main className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-[-0.035em] text-[#20232D]">Database Siswa</h1>

      <section className="mt-5 rounded-lg border border-[#D7DCE7] bg-white p-4 shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-label="Filter daftar siswa">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1.15fr_auto] lg:items-end">
          <SuperAdminFilterSelect label="Semester" value={selectedSemester} onChange={(event) => setSelectedSemester(event.target.value)} options={assignmentSemesterOptions} />
          <SuperAdminFilterSelect label="Tahun Ajaran" value={selectedAcademicYear} onChange={(event) => setSelectedAcademicYear(event.target.value)} options={assignmentAcademicYearOptions} />
          <SuperAdminFilterSelect label="Kelas" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} options={classOptions} />
          <Button onClick={showStudents} className="h-10 px-6">Tampilkan</Button>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-lg border border-[#D7DCE7] bg-white shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-labelledby="student-list-title">
        <div className="flex flex-col gap-3 border-b border-[#D7DCE7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="student-list-title" className="text-base font-semibold text-[#20232D]">Daftar Siswa</h2>
          <label className="relative block w-full sm:w-[260px]">
            <span className="sr-only">Cari siswa</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A6]" />
            <input
              type="search"
              value={studentSearch}
              onChange={(event) => {
                setStudentSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari siswa..."
              className="h-10 w-full rounded-md border border-[#D7DCE7] bg-white pl-9 pr-3 text-sm text-[#343946] outline-none placeholder:text-[#A4AABC] focus:border-[#0756D9] focus:ring-2 focus:ring-[#DCE8FF]"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead className="bg-[#F7F8FA] text-[10px] font-semibold uppercase tracking-wide text-[#555D6E]">
              <tr>
                <th scope="col" className="w-20 px-4 py-3 text-center">No</th>
                <th scope="col" className="w-32 px-4 py-3">NIS</th>
                <th scope="col" className="px-4 py-3">Nama Siswa</th>
                <th scope="col" className="w-36 px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E9F0] text-sm text-[#20232D]">
              {visibleStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-[#FAFBFD]">
                  <td className="px-4 py-4 text-center text-[#697184]">{index + 1}</td>
                  <td className="px-4 py-4">{student.nis}</td>
                  <td className="px-4 py-4 font-medium">{student.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <TableActionButton icon={Pencil} label={`Edit ${student.name}`} onClick={() => handleEditStudent(student)} />
                      <TableActionButton icon={Trash2} label={`Hapus ${student.name}`} tone="danger" onClick={() => handleDeleteStudent(student)} />
                    </div>
                  </td>
                </tr>
              ))}
              {visibleStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-[#697184]">
                    {studentSearch ? "Siswa tidak ditemukan." : "Detail siswa untuk halaman pratinjau ini belum tersedia."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#D7DCE7] bg-[#FAFBFD] px-4 py-3 text-xs text-[#697184] sm:flex-row sm:items-center sm:justify-between">
          <p>Menampilkan {rangeStart}-{rangeEnd} dari {totalStudents} siswa</p>
          <nav aria-label="Pagination daftar siswa" className="flex items-center gap-1">
            <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            {paginationPages(page, pageCount).map((pageNumber) => (
              <button key={pageNumber} type="button" aria-label={`Halaman ${pageNumber}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-8 min-w-8 rounded-md border px-2 ${page === pageNumber ? "border-[#0756D9] bg-[#0756D9] text-white" : "border-[#E1E6F0] bg-white text-[#343946]"}`}>
                {pageNumber}
              </button>
            ))}
            <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </footer>
        <p aria-live="polite" className="sr-only">{actionMessage}</p>
      </section>
      <Modal open={Boolean(editingStudent)} onClose={closeEditModal} title="Edit Data Siswa" description="Perbarui identitas siswa pada database sekolah.">
        <form noValidate onSubmit={saveStudent} className="space-y-4">
          <EditFormField id="student-name" label="Nama Siswa" value={studentForm.name} onChange={updateStudentForm("name")} error={formErrors.name} autoFocus />
          <EditFormField id="student-nis" label="NIS" value={studentForm.nis} onChange={updateStudentForm("nis")} error={formErrors.nis} inputMode="numeric" />
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeEditModal}>Batal</Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
