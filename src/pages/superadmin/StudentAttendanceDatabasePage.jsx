import { CalendarDays, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useState } from "react";
import AttendanceRecordStatusBadge from "../../components/superadmin/AttendanceRecordStatusBadge";
import EditFormField from "../../components/superadmin/EditFormField";
import SuperAdminFilterSelect from "../../components/superadmin/SuperAdminFilterSelect";
import TableActionButton from "../../components/superadmin/TableActionButton";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { assignmentAcademicYearOptions, assignmentSemesterOptions } from "../../data/assignmentWizardData";
import { studentAttendanceRecords, studentAttendanceTotal } from "../../data/superAdminManagementData";

const PAGE_SIZE = 5;
const classOptions = [{ id: "X-MIPA-1", name: "X-MIPA-1" }];
const initialFilters = {
  academicYear: "2023/2024",
  semester: "Ganjil",
  className: "X-MIPA-1",
  date: "2023-10-24",
};

function formatAttendanceDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function StudentAttendanceDatabasePage() {
  const [attendanceRecords, setAttendanceRecords] = useState(() => studentAttendanceRecords.map((record) => ({ ...record })));
  const [attendanceFilters, setAttendanceFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [actionMessage, setActionMessage] = useState("");
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({ status: "present", note: "" });

  const updateFilter = (field) => (event) => {
    setAttendanceFilters((current) => ({ ...current, [field]: event.target.value }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...attendanceFilters });
    setPage(1);
  };

  const handleEditAttendance = (record) => {
    setEditingAttendance(record);
    setAttendanceForm({ status: record.status, note: record.note || "" });
  };

  const closeEditModal = () => setEditingAttendance(null);

  const saveAttendance = (event) => {
    event.preventDefault();
    setAttendanceRecords((current) => current.map((record) => record.id === editingAttendance.id ? {
      ...record,
      status: attendanceForm.status,
      note: attendanceForm.note.trim() || "-",
    } : record));
    setActionMessage(`Presensi ${editingAttendance.studentName} berhasil diperbarui.`);
    closeEditModal();
  };

  const hasPreviewData = Object.entries(initialFilters).every(([key, value]) => appliedFilters[key] === value);
  const totalEntries = hasPreviewData ? studentAttendanceTotal : 0;
  const pageCount = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
  const visibleRecords = hasPreviewData && page === 1 ? attendanceRecords : [];
  const rangeStart = totalEntries === 0 ? 0 : ((page - 1) * PAGE_SIZE) + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalEntries);

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-[#20232D]">Database Presensi Siswa</h1>
        <p className="mt-2 text-sm text-[#555D6E]">Pantau dan kelola data kehadiran siswa secara sistematis.</p>
      </header>

      <section className="mt-7 rounded-lg border border-[#D7DCE7] bg-white p-4 shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-label="Filter presensi siswa">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SuperAdminFilterSelect label="Tahun Ajaran" value={attendanceFilters.academicYear} onChange={updateFilter("academicYear")} options={assignmentAcademicYearOptions} />
          <SuperAdminFilterSelect label="Semester" value={attendanceFilters.semester} onChange={updateFilter("semester")} options={assignmentSemesterOptions} />
          <SuperAdminFilterSelect label="Kelas" value={attendanceFilters.className} onChange={updateFilter("className")} options={classOptions} />
          <label className="block min-w-0">
            <span className="mb-1.5 block text-[11px] font-medium text-[#343946]">Tanggal</span>
            <span className="relative flex h-10 w-full items-center gap-2 overflow-hidden rounded-md border border-[#D7DCE7] bg-white px-3 text-sm text-[#343946] focus-within:border-[#0756D9] focus-within:ring-2 focus-within:ring-[#DCE8FF]">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#697184]" />
              <span aria-hidden="true">{formatAttendanceDate(attendanceFilters.date)}</span>
              <input
                type="date"
                aria-label="Tanggal"
                value={attendanceFilters.date}
                onChange={updateFilter("date")}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </span>
          </label>
        </div>
        <Button onClick={applyFilters} className="mt-4 h-10 px-5">Terapkan Filter</Button>
      </section>

      <section className="mt-5 overflow-hidden rounded-lg border border-[#D7DCE7] bg-white shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-label="Data presensi siswa">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead className="bg-[#F4F5F7] text-[11px] font-semibold uppercase tracking-wide text-[#555D6E]">
              <tr>
                <th scope="col" className="w-16 px-4 py-4 text-center">No</th>
                <th scope="col" className="w-[220px] px-4 py-4">Nama Siswa</th>
                <th scope="col" className="w-32 px-4 py-4">NIS</th>
                <th scope="col" className="w-32 px-4 py-4">Kelas</th>
                <th scope="col" className="w-44 px-4 py-4">Status Kehadiran</th>
                <th scope="col" className="px-4 py-4">Keterangan</th>
                <th scope="col" className="w-20 px-4 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7DCE7] text-sm text-[#343946]">
              {visibleRecords.map((record, index) => (
                <tr key={record.id} className="hover:bg-[#FAFBFD]">
                  <td className="px-4 py-4 text-center text-[#697184]">{index + 1}</td>
                  <td className="px-4 py-4 font-medium text-[#20232D]">{record.studentName}</td>
                  <td className="px-4 py-4">{record.nis}</td>
                  <td className="px-4 py-4">{record.className}</td>
                  <td className="px-4 py-4"><AttendanceRecordStatusBadge status={record.status} /></td>
                  <td className="px-4 py-4 text-[#555D6E]">{record.note}</td>
                  <td className="px-4 py-4 text-center">
                    <TableActionButton icon={Pencil} label={`Edit presensi ${record.studentName}`} onClick={() => handleEditAttendance(record)} />
                  </td>
                </tr>
              ))}
              {visibleRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#697184]">
                    {totalEntries === 0 ? "Tidak ada data presensi untuk filter ini." : "Detail entri halaman pratinjau ini belum tersedia."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#D7DCE7] bg-[#FAFBFD] px-5 py-3 text-xs text-[#697184] sm:flex-row sm:items-center sm:justify-between">
          <p>Menampilkan {rangeStart} hingga {rangeEnd} dari {totalEntries} entri</p>
          <nav aria-label="Pagination presensi siswa" className="flex items-center gap-1">
            <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            {[1, 2, 3].filter((pageNumber) => pageNumber <= pageCount).map((pageNumber) => (
              <button key={pageNumber} type="button" aria-label={`Halaman ${pageNumber}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-8 min-w-8 rounded-md border px-2 ${page === pageNumber ? "border-[#0756D9] bg-[#0756D9] text-white" : "border-[#E1E6F0] bg-white text-[#343946]"}`}>
                {pageNumber}
              </button>
            ))}
            {pageCount > 3 && <span aria-hidden="true" className="px-1">…</span>}
            <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </footer>
        <p aria-live="polite" className="sr-only">{actionMessage}</p>
      </section>
      <Modal open={Boolean(editingAttendance)} onClose={closeEditModal} title="Edit Presensi Siswa" description="Identitas siswa bersifat read-only. Perbarui status dan keterangannya.">
        {editingAttendance && (
          <form onSubmit={saveAttendance} className="space-y-4">
            <EditFormField id="attendance-student-name" label="Nama Siswa" value={editingAttendance.studentName} readOnly />
            <div className="grid gap-4 sm:grid-cols-2">
              <EditFormField id="attendance-nis" label="NIS" value={editingAttendance.nis} readOnly />
              <EditFormField id="attendance-class" label="Kelas" value={editingAttendance.className} readOnly />
            </div>
            <label className="block text-sm font-semibold text-[#343946]">
              Status Kehadiran
              <select value={attendanceForm.status} onChange={(event) => setAttendanceForm((current) => ({ ...current, status: event.target.value }))} className="mt-2 h-11 w-full rounded-lg border border-[#D7DCE7] bg-white px-3 text-sm outline-none focus:border-[#0756D9] focus:ring-2 focus:ring-[#DCE8FF]">
                <option value="present">Hadir</option>
                <option value="sick">Sakit</option>
                <option value="permission">Izin</option>
                <option value="absent">Alpa</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-[#343946]">
              Keterangan
              <textarea value={attendanceForm.note} onChange={(event) => setAttendanceForm((current) => ({ ...current, note: event.target.value }))} rows={4} className="mt-2 w-full resize-y rounded-lg border border-[#D7DCE7] bg-white px-3 py-2 text-sm outline-none focus:border-[#0756D9] focus:ring-2 focus:ring-[#DCE8FF]" />
            </label>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={closeEditModal}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        )}
      </Modal>
    </main>
  );
}
