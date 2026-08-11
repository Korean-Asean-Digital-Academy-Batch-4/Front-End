import { Check, ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import InlineScoreInput from "../../components/superadmin/InlineScoreInput";
import {
  subjectDatabaseRecords,
  subjectDatabaseTotalPages,
} from "../../data/superAdminManagementData";
import { validateGradeValue } from "../../utils/gradeValidation";
import { getSubjects, updateSubject } from "../../services/adminService";

export default function SubjectDatabasePage() {
  const [subjects, setSubjects] = useState(subjectDatabaseRecords);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [draftKkm, setDraftKkm] = useState("");
  const [kkmError, setKkmError] = useState("");
  const [page, setPage] = useState(1);
  const [actionMessage, setActionMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    getSubjects()
      .then((data) => { if (active) setSubjects(data); })
      .catch((error) => { if (active) setLoadError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const startEditing = (subject) => {
    setEditingSubjectId(subject.id);
    setDraftKkm(String(subject.kkm));
    setKkmError("");
  };

  const updateDraftKkm = (value) => {
    setDraftKkm(value);
    setKkmError(value === "" ? "KKM wajib diisi." : validateGradeValue(value));
  };

  const saveKkm = async (subject) => {
    const error = draftKkm === "" ? "KKM wajib diisi." : validateGradeValue(draftKkm);
    setKkmError(error);
    if (error) return;

    try {
      const updated = await updateSubject(subject.id, { kkm: Number(draftKkm) });
      setSubjects((current) => current.map((item) => item.id === subject.id ? updated : item));
      setEditingSubjectId(null);
      setDraftKkm("");
      setActionMessage(`KKM ${subject.name} berhasil diperbarui.`);
    } catch (requestError) {
      setKkmError(requestError.message || "KKM gagal diperbarui.");
    }
  };

  const handleAddSubject = () => {
    setActionMessage("Form tambah mata pelajaran menunggu prototype lanjutan.");
  };

  const visibleSubjects = page === 1 ? subjects : [];

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-[#20232D]">Database Mata Pelajaran</h1>
        <p className="mt-2 text-sm text-[#555D6E]">
          Kelola daftar mata pelajaran, guru mapel, KKM, dan bobot penilaian untuk semua kelas.
        </p>
      </header>

      {loading && <p role="status" className="mt-6 rounded-lg border border-[#D7DCE7] bg-white p-4 text-sm text-[#697184]">Memuat mata pelajaran...</p>}
      {loadError && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p>}

      {!loading && !loadError && <section className="mt-7 overflow-hidden rounded-lg border border-[#D7DCE7] bg-white shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-label="Database mata pelajaran">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-[#F4F5F7] text-[11px] font-semibold uppercase tracking-wide text-[#555D6E]">
              <tr>
                <th scope="col" className="w-16 px-4 py-4 text-center">No</th>
                <th scope="col" className="w-[220px] px-4 py-4">Nama Mapel</th>
                <th scope="col" className="w-[250px] px-4 py-4">Guru Pengampu</th>
                <th scope="col" className="w-28 px-4 py-4">Jenjang</th>
                <th scope="col" className="w-32 px-4 py-4">KKM</th>
                <th scope="col" className="w-40 px-4 py-4">Rumus Nilai</th>
                <th scope="col" className="w-20 px-4 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7DCE7] text-sm text-[#343946]">
              {visibleSubjects.map((subject, index) => {
                const isEditing = editingSubjectId === subject.id;
                return (
                  <tr key={subject.id} className={isEditing ? "bg-[#F4F8FF]" : "hover:bg-[#FAFBFD]"}>
                    <td className="px-4 py-4 text-center text-[#697184]">{index + 1}</td>
                    <td className="px-4 py-4 font-medium text-[#20232D]">{subject.name}</td>
                    <td className="px-4 py-4">{subject.teacher.name}</td>
                    <td className="px-4 py-4">{subject.level}</td>
                    <td className="px-4 py-3 align-top">
                      {isEditing ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <InlineScoreInput
                              value={draftKkm}
                              onChange={updateDraftKkm}
                              error={kkmError}
                              ariaLabel={`KKM ${subject.name}`}
                              autoFocus
                            />
                            <button
                              type="button"
                              aria-label={`Simpan KKM ${subject.name}`}
                              onClick={() => saveKkm(subject)}
                              className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Check aria-hidden="true" className="h-4 w-4" />
                            </button>
                          </div>
                          {kkmError && <p role="alert" className="mt-1 text-[10px] text-red-600">{kkmError}</p>}
                        </div>
                      ) : subject.kkm}
                    </td>
                    <td className="px-4 py-4">{subject.formula}</td>
                    <td className="px-4 py-4 text-center">
                      {!isEditing && (
                        <button
                          type="button"
                          aria-label={`Edit ${subject.name}`}
                          onClick={() => startEditing(subject)}
                          className="rounded-md p-2 text-[#697184] hover:bg-[#EEF3FC] hover:text-[#0756D9]"
                        >
                          <Pencil aria-hidden="true" className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visibleSubjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#697184]">
                    Detail mata pelajaran halaman pratinjau ini belum tersedia.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#D7DCE7]">
                <td colSpan={7} className="p-3">
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#9DB4DE] px-4 py-3 text-sm font-medium text-[#0756D9] hover:bg-[#F4F8FF]"
                  >
                    <Plus aria-hidden="true" className="h-4 w-4" /> Tambah Mata Pelajaran
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#D7DCE7] bg-[#FAFBFD] px-5 py-3 text-xs text-[#697184] sm:flex-row sm:items-center sm:justify-between">
          <p>Menampilkan halaman {page} dari {subjectDatabaseTotalPages}</p>
          <nav aria-label="Pagination mata pelajaran" className="flex items-center gap-1">
            <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((pageNumber) => (
              <button key={pageNumber} type="button" aria-label={`Halaman ${pageNumber}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-8 min-w-8 rounded-md border px-2 ${page === pageNumber ? "border-[#0756D9] bg-[#0756D9] text-white" : "border-[#E1E6F0] bg-white text-[#343946]"}`}>
                {pageNumber}
              </button>
            ))}
            <span aria-hidden="true" className="px-1">…</span>
            <button type="button" aria-label="Halaman berikutnya" disabled={page === subjectDatabaseTotalPages} onClick={() => setPage((current) => Math.min(subjectDatabaseTotalPages, current + 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </footer>
        <p aria-live="polite" className="sr-only">{actionMessage}</p>
      </section>}
    </main>
  );
}
