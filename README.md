# 🎓 EduTrack

<p align="center">
  <strong>Sistem Informasi Akademik berbasis web untuk membantu pengelolaan aktivitas akademik sekolah.</strong>
</p>

<p align="center">
  Frontend dikembangkan menggunakan React.js dengan antarmuka berbasis role untuk Guru, Siswa, dan Superadmin.
</p>

---

## 📌 Tentang EduTrack

**EduTrack** adalah aplikasi sistem informasi akademik berbasis web yang dirancang untuk membantu proses pengelolaan kegiatan akademik sekolah dalam satu sistem terintegrasi.

Aplikasi ini menyediakan fitur untuk Guru, Siswa, dan Superadmin, mulai dari pengelolaan presensi, nilai, rapor, penugasan kelas, pembuatan akun secara massal, pengaturan rumus nilai, hingga pengelolaan database akademik.

Frontend EduTrack dikembangkan berdasarkan prototype UI/UX yang kemudian diimplementasikan menggunakan **React.js**.

Project ini merupakan bagian dari:

**Capstone Project Korean ASEAN Digital Academy (KADA) Batch 4**

> **Status Project:** Frontend Development / Prototype Implementation  
> Beberapa fitur masih menggunakan mock data dan mock interaction sebelum diintegrasikan sepenuhnya dengan Backend API.

---

# ✨ Fitur Utama

EduTrack memiliki tiga jenis pengguna utama:

- Guru
- Siswa
- Superadmin

Setiap role memiliki halaman, fitur, dan hak akses yang berbeda.

---

# 🔐 Authentication

Fitur autentikasi digunakan sebagai pintu masuk pengguna ke sistem EduTrack.

Fitur yang tersedia:

- Login
- Validasi form login
- Password visibility
- Error state jika username/password salah
- Role-based authentication
- Protected route
- Role-based route
- Logout
- Halaman `403 Forbidden`
- Halaman `404 Not Found`

Setelah berhasil login, pengguna diarahkan menuju dashboard berdasarkan role masing-masing.

---

# 👨‍🏫 Guru

Guru memiliki akses untuk mengelola aktivitas akademik siswa.

## Dashboard Guru

Dashboard menampilkan ringkasan aktivitas akademik yang berkaitan dengan guru.

## Presensi

Guru dapat mengelola presensi siswa berdasarkan:

- Tahun Ajaran
- Semester
- Mata Pelajaran
- Kelas
- Tanggal

Status kehadiran siswa terdiri dari:

- Hadir
- Sakit
- Izin
- Alpa

## Input Nilai

Guru dapat melakukan input nilai siswa berdasarkan komponen penilaian.

Komponen nilai:

- Tugas 1
- Tugas 2
- Tugas 3
- Ulangan Harian 1
- Ulangan Harian 2
- Ulangan Harian 3
- UTS
- UAS

Sistem dapat menampilkan nilai akhir berdasarkan bobot penilaian yang telah ditentukan.

Guru juga dapat menambahkan **Topik Materi Pembelajaran** pada masing-masing komponen nilai.

## Edit Nilai

Guru dapat memperbarui nilai siswa apabila diperlukan.

## Lihat Nilai Mata Pelajaran

Fitur ini digunakan untuk melihat nilai siswa berdasarkan mata pelajaran tertentu.

Fitur **Lihat Nilai Mapel** hanya tersedia untuk Guru yang mendapatkan tugas sebagai **Wali Kelas**.

## Generate Rapor

Guru dapat melihat serta membuat data rapor berdasarkan nilai akademik siswa.

## Akun

Guru dapat melihat informasi akun dan profil yang digunakan pada sistem EduTrack.

---

# 👨‍🎓 Siswa

Siswa memiliki akses untuk melihat perkembangan akademiknya sendiri.

## Dashboard Siswa

Dashboard siswa menampilkan:

- Sapaan pengguna
- Persentase kehadiran
- Ringkasan nilai
- Mata pelajaran aktif
- Insight akademik

## Nilai

Siswa dapat melihat nilai pada setiap mata pelajaran.

## Rincian Nilai

Halaman rincian nilai menampilkan komponen nilai secara detail.

Contoh:

```text
Matematika Wajib

Tugas 1
Tugas 2
Tugas 3

Ulangan Harian 1
Ulangan Harian 2
Ulangan Harian 3

UTS
UAS
```

Setiap komponen dapat menampilkan:

- Topik materi
- Nilai
- Bobot

## Rapor

Siswa dapat melihat ringkasan rapor berdasarkan:

- Tahun Ajaran
- Semester

Informasi rapor dapat mencakup:

- Rata-rata nilai
- Kehadiran
- Nilai mata pelajaran
- Catatan guru

## Download Rapor

Siswa dapat mengunduh rapor apabila dokumen tersedia.

## Pengaturan Profil

Siswa dapat melihat informasi:

- Nama
- Email
- Role
- NIS
- Kelas
- Status akun

Beberapa informasi utama bersifat terkunci dan dikelola oleh administrator sekolah.

---

# 🛡️ Superadmin

Superadmin merupakan role yang memiliki akses untuk mengelola konfigurasi utama sistem EduTrack.

---

# 📊 Dashboard Superadmin

Dashboard Superadmin menyediakan tutorial penggunaan sistem.

Tutorial yang tersedia antara lain:

### Pembuatan Akun

Panduan pembuatan akun Guru dan Siswa.

### Penugasan Guru & Siswa

Panduan penempatan siswa ke kelas, wali kelas, dan guru mata pelajaran.

### Pengisian Rumus Nilai

Panduan konfigurasi bobot penilaian.

Dashboard menggunakan accordion sehingga tutorial dapat dibuka dan ditutup.

---

# 👥 Pembuatan Akun

Superadmin dapat melakukan pembuatan akun secara massal untuk:

- Guru
- Siswa

Menu:

```text
Pembuatan Akun
├── Akun Guru
└── Akun Siswa
```

---

## Pembuatan Akun Guru

Flow pembuatan akun Guru:

```text
Pembuatan Akun Guru
        ↓
Belum Unggah File
        ↓
Pilih File
        ↓
Modal Upload
        ↓
Upload Excel / CSV
        ↓
File Berhasil Diunggah
        ↓
Ringkasan File
        ↓
Buat Akun Otomatis
        ↓
Preview Akun
```

File dapat dipilih menggunakan:

- File browser
- Drag & drop

Format file yang digunakan pada prototype frontend:

```text
.xlsx
.csv
```

Ukuran maksimal file:

```text
10 MB
```

Setelah proses berhasil, sistem dapat menampilkan preview akun Guru.

Contoh informasi:

```text
Nama Guru
NIP
Generated Password
Status
```

Status:

```text
Siap
Error
```

Password pada halaman frontend ditampilkan dalam bentuk **masked password**.

Contoh:

```text
a********23
```

---

## Pembuatan Akun Siswa

Flow pembuatan akun Siswa sama dengan akun Guru.

```text
Pembuatan Akun Siswa
        ↓
Upload Data Siswa
        ↓
Validasi File
        ↓
File Berhasil Diunggah
        ↓
Ringkasan File
        ↓
Proses Pembuatan Akun
        ↓
Preview Akun
```

Informasi preview akun Siswa:

```text
Nama Siswa
NIS
Generated Password
Status
```

---

# 🏫 Penugasan

Superadmin dapat mengelola penugasan berdasarkan tingkat kelas.

Menu:

```text
Penugasan
├── Kelas X
├── Kelas XI
└── Kelas XII
```

---

## Penugasan Kelas

Ketika belum terdapat data, sistem menampilkan empty state.

Contoh:

```text
Penugasan Guru & Siswa Kelas X

Belum ada data penugasan untuk periode ini.

[ Mulai Buat Data ]
```

Setelah tombol ditekan, sistem membuka wizard penugasan.

---

# 🧭 Wizard Penugasan

Wizard terdiri dari empat tahap.

```text
1. Set Periode
        ↓
2. Siswa & Kelas
        ↓
3. Wali Kelas & Guru Mapel
        ↓
4. Selesai
```

---

## Step 1 — Set Periode

Superadmin menentukan:

- Semester
- Tahun Ajaran

Contoh:

```text
Semester     : Ganjil
Tahun Ajaran : 2026/2027
```

---

## Step 2 — Siswa & Kelas

Superadmin mengunggah file berisi data siswa beserta kelas.

Fitur:

- Drag & drop Excel
- Pilih File Excel
- Download Template Excel
- Validasi file

---

## Step 3 — Wali Kelas & Guru Mapel

Superadmin menentukan:

- Wali Kelas
- Mata Pelajaran
- Guru Pengampu

Contoh:

```text
Kelas X-MIPA-1
36 Siswa

Wali Kelas:
Budi Santoso, M.Pd.
```

Penugasan mata pelajaran:

```text
Matematika
→ Siti Rahmawati, S.Si.

Bahasa Indonesia
→ Guru Pengampu
```

Superadmin juga dapat menambahkan mata pelajaran lainnya.

---

## Step 4 — Selesai

Setelah seluruh data berhasil diproses, sistem menampilkan:

```text
Semua data berhasil dibuat
```

Data kemudian dapat ditampilkan pada halaman Penugasan.

---

# 📋 Penugasan Kelas Terisi

Setelah data berhasil dibuat, halaman menampilkan:

- Semester
- Tahun Ajaran
- Kelas
- Wali Kelas
- Daftar Siswa

Contoh:

| No | NIS | Nama Siswa |
|---|---|---|
| 1 | 10234 | Ahmad Fauzi |
| 2 | 10235 | Siti Aminah |
| 3 | 10236 | Bintang Ramadhan |
| 4 | 10237 | Diana Kusuma |

Tersedia fitur:

- Search siswa
- Pagination
- Edit
- Delete
- Mulai Penugasan Baru

---

# 🧮 Rumus Nilai

Menu:

```text
Rumus Nilai
├── Rumus Utama
└── Rumus Lainnya
```

---

## Rumus Utama

Halaman **Manajemen Rumus** menampilkan konfigurasi bobot penilaian.

Contoh:

| Komponen | Bobot |
|---|---:|
| Tugas 1 | 6% |
| Tugas 2 | 6% |
| Tugas 3 | 6% |
| Ulangan Harian 1 | 10% |
| Ulangan Harian 2 | 10% |
| Ulangan Harian 3 | 10% |
| UTS | 26% |
| UAS | 26% |

Total:

```text
100%
```

Distribusi bobot:

```text
Tugas           18%
Ulangan Harian  30%
UTS              26%
UAS              26%
--------------------
TOTAL           100%
```

Halaman dapat menampilkan visualisasi distribusi bobot menggunakan donut chart.

---

# 🗃️ Database

Menu Database digunakan untuk melihat dan mengelola data akademik.

Struktur menu:

```text
Database
├── Daftar Nama Guru
├── Daftar Nama Siswa
├── DB Presensi Siswa
├── DB Mata Pelajaran
├── DB Nilai
└── DB Rapor
```

---

# 👨‍🏫 Daftar Nama Guru

Menampilkan direktori Guru.

Informasi:

- Nama Guru
- Email
- Wali Kelas
- Guru Mata Pelajaran
- Aksi

Contoh:

| Nama Guru | Email | Role 1 | Role 2 |
|---|---|---|---|
| Budi Santoso, S.Pd | budi.santoso@sekolah.sch.id | Wali Kelas | Guru Mapel Matematika |
| Siti Aminah, M.Pd | siti.aminah@sekolah.sch.id | Wali Kelas | Guru Mapel IPA |
| Ahmad Fauzi, S.T | ahmad.fauzi@sekolah.sch.id | - | Guru Mapel Fisika |

> **Wali Kelas bukan role autentikasi terpisah.** Wali Kelas merupakan penugasan tambahan dari akun Guru.

---

# 👨‍🎓 Daftar Nama Siswa

Menampilkan direktori siswa berdasarkan:

- Semester
- Tahun Ajaran
- Kelas

Tersedia:

- Filter
- Search
- Pagination
- Edit
- Delete

---

# 📅 Database Presensi Siswa

Halaman ini digunakan untuk melihat data kehadiran siswa.

Filter:

- Tahun Ajaran
- Semester
- Kelas
- Tanggal

Status:

```text
Hadir
Sakit
Izin
Alpa
```

Informasi tabel:

- Nama Siswa
- NIS
- Kelas
- Status Kehadiran
- Keterangan
- Aksi

---

# 📚 Database Mata Pelajaran

Digunakan untuk mengelola data mata pelajaran.

Informasi:

- Nama Mata Pelajaran
- Guru Pengampu
- Jenjang
- KKM
- Rumus Nilai

Contoh:

| Mata Pelajaran | KKM | Rumus |
|---|---:|---|
| Matematika Wajib | 75 | Rumus Utama |
| Bahasa Indonesia | 80 | Rumus Utama |
| Fisika Lintas Minat | 70 | Rumus Lainnya |
| Pendidikan Jasmani | 75 | Rumus Lainnya |

Tersedia fitur inline editing untuk data tertentu pada prototype.

---

# 📝 Database Nilai

Digunakan untuk melihat rincian nilai siswa berdasarkan:

- Tahun Ajaran
- Semester
- Kelas
- Mata Pelajaran

Komponen nilai:

```text
T1
T2
T3
UH1
UH2
UH3
UTS
UAS
```

Pada prototype tersedia fitur **inline editing per siswa**.

Saat mode edit:

```text
T1 → Input
T2 → Input
T3 → Input
UH1 → Input
UH2 → Input
UH3 → Input
UTS → Input
UAS → Input
```

Nilai memiliki rentang:

```text
0 - 100
```

---

# 📄 Database Rapor

Digunakan untuk melihat hasil rapor siswa.

Filter:

- Tahun Ajaran
- Semester
- Kelas

Informasi:

- Nama Siswa
- NIS
- Rata-rata Nilai
- Status
- Download Rapor

Contoh status:

```text
Naik Kelas
Tinggal Kelas
```

Status akademik pada frontend prototype merupakan data yang diterima, bukan keputusan yang dihitung langsung oleh frontend.

---

# ⚙️ Pengaturan Sistem

Superadmin memiliki halaman **Pengaturan Sistem** untuk monitoring aktivitas sistem.

Fokus halaman saat ini adalah:

```text
Log Peringatan Keamanan
```

Informasi log:

- Stempel waktu
- Pengguna / IP
- Aksi terdeteksi
- Tingkat risiko
- Aksi

Tingkat risiko:

```text
Tinggi
Sedang
Rendah
```

Contoh aktivitas:

- Login gagal berulang
- Login dari lokasi tidak biasa
- Percobaan SQL Injection
- Password berubah
- Ekspor data massal

Pada prototype tersedia mock action:

```text
Buka Blokir
```

> Sistem keamanan sebenarnya harus diproses pada backend atau security infrastructure, bukan pada React frontend.

---

# 🧭 Sidebar Superadmin

Struktur sidebar final Superadmin:

```text
Dashboard

Pembuatan Akun
├── Akun Guru
└── Akun Siswa

Penugasan
├── Kelas X
├── Kelas XI
└── Kelas XII

Rumus Nilai
├── Rumus Utama
└── Rumus Lainnya

Database
├── Daftar Nama Guru
├── Daftar Nama Siswa
├── DB Presensi Siswa
├── DB Mata Pelajaran
├── DB Nilai
└── DB Rapor

Pengaturan Sistem
```

Sidebar mendukung:

- Expand menu
- Collapse menu
- Active state
- Nested menu
- Role-based navigation

---

# 🛠️ Teknologi

Frontend EduTrack dikembangkan menggunakan teknologi modern berbasis JavaScript.

Teknologi utama:

```text
React.js
Vite
JavaScript
HTML5
CSS3
```

Library tambahan dapat digunakan untuk:

- Routing
- Form validation
- Icons
- PDF generation
- State management
- Styling

Untuk melihat dependency yang digunakan pada versi project saat ini, lihat:

```text
package.json
```

---

# 📁 Struktur Project

Struktur project secara umum:

```text
Capstone-Project-KADA-Batch-4/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

Struktur dapat berubah mengikuti perkembangan project.

---

# 🚀 Instalasi

Pastikan komputer sudah memiliki:

```text
Node.js
npm
Git
```

Clone repository:

```bash
git clone https://github.com/apiipp-co/Capstone-Project-KADA-Batch-4.git
```

Masuk ke project:

```bash
cd Capstone-Project-KADA-Batch-4
```

Install dependency:

```bash
npm install
```

Salin konfigurasi development:

```bash
cp .env.example .env
```

Jalankan backend `EduTrack_Backend-main` pada port `4000` terlebih dahulu.
Vite meneruskan request `/api` ke backend melalui development proxy.

Jalankan development server:

```bash
npm run dev
```

Kemudian buka URL localhost yang diberikan oleh Vite.

Contoh:

```text
http://localhost:5173
```

Port dapat berbeda tergantung konfigurasi dan kondisi development environment.

---

# 📦 Production Build

Untuk membuat production build:

```bash
npm run build
```

Hasil build akan dibuat oleh Vite pada directory build yang dikonfigurasi project.

Untuk preview production build:

```bash
npm run preview
```

---

# 🧪 Development Flow

Workflow pengembangan sederhana:

```bash
git checkout -b nama-branch
```

Setelah melakukan perubahan:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: implement feature"
```

Push:

```bash
git push origin nama-branch
```

---

# 👤 Role & Authorization

EduTrack menggunakan role-based interface.

| Role | Hak Akses Utama |
|---|---|
| Guru | Presensi, nilai, rapor, data akademik terkait |
| Siswa | Melihat nilai, rapor, kehadiran, profil |
| Superadmin | Pembuatan akun, penugasan, rumus, database, pengaturan sistem |

Role digunakan untuk membatasi halaman yang dapat diakses pengguna.

Contoh:

```text
Guru
→ tidak dapat membuka halaman Superadmin

Siswa
→ tidak dapat membuka halaman Guru

Superadmin
→ memiliki akses ke konfigurasi utama sistem
```

---

# 🔄 Alur Sistem

Secara sederhana, alur EduTrack:

```text
LOGIN
  │
  ├── Guru
  │     ↓
  │   Dashboard
  │     ↓
  │   Presensi / Nilai / Rapor
  │
  ├── Siswa
  │     ↓
  │   Dashboard
  │     ↓
  │   Nilai / Rapor / Pengaturan
  │
  └── Superadmin
        ↓
      Dashboard
        ↓
      Pembuatan Akun
        ↓
      Penugasan
        ↓
      Rumus Nilai
        ↓
      Database
        ↓
      Pengaturan Sistem
```

---

# 🔐 Catatan Keamanan

Beberapa aturan keamanan yang perlu diperhatikan:

### Password

Password yang tampil pada prototype harus menggunakan format masked.

Contoh:

```text
a********23
```

Password production tidak boleh dibuat atau disimpan langsung di frontend.

### API Key

Jangan menyimpan:

```text
OPENAI_API_KEY
GEMINI_API_KEY
DATABASE_PASSWORD
JWT_SECRET
```

di source code React.

### Authentication

Token dan credential harus ditangani sesuai mekanisme keamanan backend.

### File Upload

Validasi frontend hanya digunakan untuk meningkatkan UX.

Backend tetap harus melakukan:

- Validasi MIME type
- Validasi extension
- Validasi ukuran
- Parsing aman
- Validasi struktur kolom
- Duplicate checking

### Security Monitoring

Deteksi seperti:

```text
SQL Injection
Brute Force
IP Blocking
Anomaly Detection
```

harus ditangani oleh backend/security infrastructure.

Frontend hanya bertugas menampilkan hasil monitoring.

---

# 🔌 Integrasi Backend

Frontend EduTrack dirancang agar dapat diintegrasikan dengan backend melalui service layer.

Beberapa fitur yang membutuhkan backend:

```text
Authentication

Data Guru

Data Siswa

Presensi

Nilai

Rapor

Upload Excel

Import Data

Pembuatan Akun

Penugasan Kelas

Rumus Nilai

Database Mata Pelajaran

Security Log
```

Struktur yang disarankan:

```text
React Component
      ↓
Service Layer
      ↓
REST API
      ↓
Backend
      ↓
Database
```

Authentication telah mengikuti kontrak `EduTrack_Backend-main`:

```text
POST /api/auth/login → menerima identifier dan password
                     → mengembalikan token, role, dan profile
```

Frontend menyimpan sesi pengguna dan JWT di `localStorage`. Semua request API
memakai centralized client pada `src/services/api/` dan mengirim header
`Authorization: Bearer <token>`. Respons `401` otomatis membersihkan sesi lokal.

Endpoint guru, presensi, nilai, wali kelas, rapor, siswa, mata pelajaran,
akun impor, tahun ajaran, dan kelas telah dipetakan ke backend. Backend belum
menyediakan endpoint ganti password untuk pengguna yang sedang login dan belum
menyediakan endpoint baca komponen penilaian; kedua bagian tersebut ditangani
secara aman oleh frontend tanpa mengirim request ke route yang tidak tersedia.

---

# 🤖 Fitur Otomatis pada Prototype

Pada halaman pembuatan akun terdapat tombol:

```text
Buat Akun Otomatis Dengan AI
```

Pada tahap frontend, tombol tersebut dapat menggunakan mock interaction untuk mensimulasikan proses pembuatan akun.

Untuk implementasi production:

```text
Frontend
   ↓
Backend
   ↓
Validasi Data
   ↓
Generate Credential
   ↓
Hash Password
   ↓
Simpan Akun
   ↓
Return Safe Result
```

API key AI maupun proses pembuatan password production tidak boleh dilakukan secara langsung dari browser.

---

# 📊 Mock Data

Beberapa halaman masih menggunakan mock data untuk mensimulasikan data backend.

Contohnya:

- Data Guru
- Data Siswa
- Presensi
- Nilai
- Rapor
- Security Logs
- Account generation
- Penugasan kelas

Mock data akan digantikan dengan API ketika integrasi backend dilakukan.

---

# 📱 Responsive Design

Frontend EduTrack dirancang agar dapat digunakan pada beberapa ukuran layar.

Target:

```text
Desktop
Tablet
Mobile
```

Beberapa implementasi responsive meliputi:

- Sidebar collapsible
- Filter wrapping
- Responsive modal
- Horizontal table scroll
- Responsive cards
- Mobile stacking

---

# 🎨 UI/UX

Desain aplikasi menggunakan prototype sebagai acuan implementasi frontend.

Prinsip utama:

- Layout konsisten
- Navigasi mudah dipahami
- Visual hierarchy jelas
- Feedback terhadap action pengguna
- Loading state
- Empty state
- Success state
- Error state
- Responsive design
- Reusable component

---

# 📸 Screenshot

Screenshot aplikasi dapat ditempatkan pada folder:

```text
docs/screenshots/
```

Contoh menambahkan screenshot ke README:

```markdown
![EduTrack Dashboard](docs/screenshots/dashboard-superadmin.png)
```

Contoh struktur:

```text
docs/
└── screenshots/
    ├── login.png
    ├── dashboard-guru.png
    ├── dashboard-siswa.png
    ├── dashboard-superadmin.png
    ├── input-nilai.png
    ├── penugasan.png
    └── database.png
```

---

# 🚧 Status Pengembangan

Project saat ini masih berada dalam tahap pengembangan dan penyempurnaan.

Beberapa bagian masih menggunakan:

```text
Mock Data
Local State
Mock API Process
Prototype Interaction
Frontend Validation
```

Tahap berikutnya adalah integrasi frontend dengan Backend API sehingga data dapat tersimpan dan diproses secara nyata.

---

# 🗺️ Roadmap

Beberapa pengembangan yang dapat dilakukan selanjutnya:

```text
✅ Implementasi UI berdasarkan prototype

✅ Role-based interface

✅ Guru pages

✅ Student pages

✅ Superadmin pages

✅ Responsive layout

🔄 Integrasi Backend API

🔄 Authentication production

🔄 Database persistence

🔄 Upload Excel production

🔄 Account generation backend

🔄 Report generation

🔄 Security monitoring integration

🔄 Testing

🔄 Deployment
```

---

# 🤝 Kontribusi

Project ini dikembangkan sebagai bagian dari Capstone Project.

Jika bekerja menggunakan branch:

```bash
git checkout -b feature/nama-fitur
```

Sebelum push, pastikan project dapat dijalankan dan build berhasil.

```bash
npm run build
```

---

# 📂 Repository

Repository:

```text
https://github.com/apiipp-co/Capstone-Project-KADA-Batch-4
```

---

# 👨‍💻 Development

Frontend Development:

**Capstone Project KADA Batch 4**

Aplikasi:

**EduTrack**

---

# 📄 License

Belum ada lisensi open-source khusus yang ditetapkan untuk repository ini.

Jika project nantinya akan dipublikasikan sebagai open-source, tambahkan file:

```text
LICENSE
```

sesuai lisensi yang dipilih.

---

<p align="center">
  <strong>EduTrack</strong>
</p>

<p align="center">
  Academic Management Made Easier.
</p>

<p align="center">
  Capstone Project KADA Batch 4
</p>
