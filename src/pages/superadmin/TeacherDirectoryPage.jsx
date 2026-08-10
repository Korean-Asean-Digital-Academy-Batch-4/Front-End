import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useState } from "react";
import Badge from "../../components/ui/Badge";
import { teacherDirectory } from "../../data/superAdminManagementData";
import { cn } from "../../utils/cn";

const avatarTones = {
  blue: "bg-[#E4E9FF] text-[#173A75]",
  orange: "bg-[#FFE4D8] text-[#7C3418]",
  slate: "bg-[#E7EAED] text-[#4F5665]",
  lavender: "bg-[#E5E9FF] text-[#354B8C]",
};

export default function TeacherDirectoryPage() {
  const [actionMessage, setActionMessage] = useState("");

  const handleEditTeacher = (teacher) => {
    setActionMessage(`Edit ${teacher.name} menunggu prototype lanjutan.`);
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
              {teacherDirectory.map((teacher) => (
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
                    <button
                      type="button"
                      aria-label={`Edit ${teacher.name}`}
                      onClick={() => handleEditTeacher(teacher)}
                      className="rounded-md p-2 text-[#697184] transition-colors hover:bg-[#EEF3FC] hover:text-[#0756D9]"
                    >
                      <Pencil aria-hidden="true" className="h-4 w-4" />
                    </button>
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
    </main>
  );
}
