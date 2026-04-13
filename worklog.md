# Project Worklog - Landing Page Menanam Sejuta Pohon Kota Lhokseumawe

Project ini membuat landing page untuk program menanam sejuta pohon dengan Next.js 16, TypeScript, Tailwind CSS, dan Prisma SQLite.

---

Task ID: 1
Agent: Z.ai Code
Task: Tahap 1 - Buat landing page frontend dengan tema menanam pohon

Work Log:
- Membuat landing page lengkap di src/app/page.tsx dengan:
  * Hero section dengan background gradient dan gambar hutan
  * Statistik section menampilkan target pohon, peserta, lokasi, dan dukungan
  * Tentang Program section menjelaskan mengapa menanam pohon penting
  * Dampak Perubahan Iklim section dengan penjelasan detail tentang krisis iklim
  * Solusi Menanam Pohon section dengan manfaat langsung
  * Manfaat Jangka Panjang section (6 kartu manfaat)
  * Semboyan & Motivasi section dengan kalimat inspiratif
  * Form Pendaftaran Peserta dengan field lengkap
  * Footer dengan informasi kontak
- Menggunakan warna hijau dan earth tone sesuai tema alam/pohon
- Menggunakan shadcn/ui components (Button, Input, Textarea, Card, Label)
- Menambahkan ikon dari Lucide untuk visualisasi
- Mengimplementasikan form dengan state management
- Menambahkan penjelasan bagaimana data peserta diterima admin
- Memastikan responsive design untuk mobile dan desktop
- Landing page berhasil di-compile dan berjalan di dev server

Stage Summary:
- Landing page frontend lengkap dengan semua section yang diminta
- Desain eye catching dengan tema hijau/alam yang konsisten
- Form pendaftaran siap diintegrasikan dengan API backend
- Semua konten tentang perubahan iklim, dampaknya, dan motivasi sudah ditulis dengan kalimat yang mengugah

---

Task ID: 2
Agent: Z.ai Code
Task: Tahap 2 - Setup database PostgreSQL Neon dan migrasi data CSV

Work Log:
- Mencari file CSV peserta_sejuta_pohon_formatted.csv di project (tidak ditemukan)
- Mengupdate file .env dengan connection string PostgreSQL Neon:
  * postgresql://neondb_owner:npg_2eWGNaKP8LZi@ep-crimson-tooth-a1xgngig-pooler.ap-southeast-1.aws.neon.tech/neondb
- Mengupdate prisma/schema.prisma:
  * Mengubah provider dari sqlite ke postgresql
  * Menghapus model User dan Post yang tidak diperlukan
  * Membuat model Peserta dengan field: id, nama, email, telepon, alamat, jumlahPohon, pesan, status, createdAt, updatedAt
  * Menambahkan index pada email dan status untuk optimasi query
- Melakukan migrasi database dengan `bun run db:push`:
  * Berhasil membuat tabel Peserta di PostgreSQL Neon
  * Generate Prisma Client berhasil
- Membuat script import CSV di scripts/import-csv.ts:
  * Fungsi parseCSV untuk membaca file CSV
  * Fungsi importCSVToDatabase untuk mengimport data ke database
  * Error handling dan progress logging
  * Support untuk field: nama, email, telepon, alamat, jumlahPohon, pesan

Stage Summary:
- Database PostgreSQL Neon berhasil dikonfigurasi
- Schema Prisma sesuai dengan form pendaftaran
- Migrasi database berhasil dilakukan
- Script import CSV siap digunakan ketika file CSV tersedia
- Script dapat dijalankan dengan: `bun run scripts/import-csv.ts`

---

Task ID: 3
Agent: Z.ai Code
Task: Tahap 3 - Buat API endpoint untuk menyimpan data peserta ke database

Work Log:
- Membuat directory src/app/api/peserta/
- Membuat API route handler di src/app/api/peserta/route.ts dengan:
  * POST endpoint untuk menyimpan peserta baru
  * GET endpoint untuk mengambil daftar peserta (untuk admin)
- Implementasi POST endpoint:
  * Parse request body dan validasi field required (nama, email, telepon, alamat)
  * Validasi format email menggunakan regex
  * Validasi format nomor telepon Indonesia (08xx, 628xx, +628xx)
  * Validasi jumlah_pohon (1-1000)
  * Cek duplikasi email sebelum insert
  * Insert data ke database menggunakan Prisma
  * Set status default = 'pending'
  * Response sukses dengan data peserta yang disimpan
- Implementasi GET endpoint:
  * Support query parameters: status, limit, offset
  * Filter berdasarkan status (pending/confirmed/completed)
  * Pagination dengan limit maksimal 100
  * Return data peserta dan metadata pagination
- Error handling:
  * Field validation errors (400)
  * Duplicate email error (409)
  * Database connection errors (503)
  * Generic server errors (500)
- API endpoint berhasil di-compile tanpa error

Stage Summary:
- API endpoint POST /api/peserta berfungsi untuk pendaftaran peserta
- API endpoint GET /api/peserta berfungsi untuk mengambil data peserta
- Validasi input lengkap dan aman
- Error handling yang baik
- Siap digunakan oleh frontend

---

Task ID: 4
Agent: Z.ai Code
Task: Tahap 4 - Integrasi form dengan API dan tambahkan validasi

Work Log:
- Menambahkan TypeScript interfaces untuk FormData dan FormErrors
- Mengimpor icon tambahan: AlertCircle, Loader2
- Implementasi validasi client-side:
  * isValidEmail() - validasi format email dengan regex
  * isValidPhone() - validasi nomor telepon Indonesia (08xx, 628xx, +628xx)
  * validateForm() - validasi lengkap sebelum submit
    - Nama: required, min 3 karakter
    - Email: required, format valid
    - Telepon: required, format Indonesia
    - Alamat: required, min 10 karakter
- Mengimplementasikan handleInputChange():
  * Update form data
  * Clear error untuk field saat user mengetik
- Mengupdate handleSubmit():
  * Reset errors sebelum validasi
  * Validasi form sebelum submit
  * Parse response JSON dari API
  * Handle API error messages dan mapping ke field yang tepat
  * Error handling untuk koneksi gagal
- Menambahkan useEffect untuk auto-reset success message setelah 10 detik
- Update UI form dengan:
  * Error messages per field dengan icon AlertCircle
  * Border berubah menjadi merah saat ada error
  * General error message di atas form
  * Success message dengan pesan dari API
  * Character counter untuk field pesan
  * Loading indicator dengan icon Loader2 yang berputar
  * Button text berubah saat submitting
  * Helper text untuk format telepon dan alamat
- Semua perubahan berhasil di-compile tanpa error

Stage Summary:
- Form terintegrasi sepenuhnya dengan API endpoint
- Validasi client-side dan server-side lengkap
- User feedback yang jelas untuk error dan success
- User experience yang optimal dengan loading states
- Auto-clear error saat user mulai mengetik
- Auto-reset success message setelah 10 detik

---

Task ID: 5
Agent: Z.ai Code
Task: Tahap 5 - Tambahkan list peserta dengan scroll dan migrasi data dari CSV

Work Log:
- Update API endpoint GET /api/peserta:
  * Menghapus field email dan telepon dari select (untuk privacy)
  * Menyimpan data sensitif hanya di server side
- Membuat file peserta.csv dengan 10 data contoh di root project
- Memperbaiki script import CSV (scripts/import-peserta-csv.ts):
  * Mengubah findUnique ke findFirst untuk cek duplikasi email
  * Parse CSV dengan support quoted values
  * Mapping field yang fleksibel
- Menjalankan migrasi database:
  * Push schema Prisma ke PostgreSQL Neon
  * Import 10 data dari peserta.csv berhasil
- Update frontend (src/app/page.tsx):
  * Menambahkan interface Peserta
  * Menambahkan state: pesertaList, isLoadingPeserta, pesertaError
  * Implementasi fetchPeserta() untuk mengambil data dari API
  * useEffect untuk fetch data saat mount dan refresh setelah submit berhasil
  * Menambahkan section "Daftar Peserta" di bawah form pendaftaran
  * Komponen card peserta dengan:
    - Icon pohon hijau
    - Nama peserta
    - Jumlah pohon (badge)
    - Alamat dengan emoji lokasi
    - Pesan (jika ada)
    - Tanggal pendaftaran
    - Status badge (Menunggu/Terkonfirmasi/Selesai)
  * Loading state dengan spinner
  * Error state dengan tombol retry
  * Empty state saat belum ada peserta
  * Scrollable container dengan max-h-96
- Update CSS (src/app/globals.css):
  * Menambahkan custom scrollbar styling
  * Warna scrollbar hijau sesuai tema
  - Hover effect pada scrollbar thumb

Stage Summary:
- List peserta berhasil ditambahkan di bawah form pendaftaran
- Data diambil dari API tanpa menampilkan email dan telepon (privacy)
- Scrollable container dengan custom scrollbar hijau
- 10 data contoh berhasil diimport dari peserta.csv
- Auto-refresh list setelah peserta baru mendaftar
- Loading, error, dan empty states ditangani dengan baik

---

Task ID: 6
Agent: Z.ai Code
Task: Tahap 6 - Perbaiki format tanggal dan susunan tampilan list peserta

Work Log:
- Mengubah format tanggal dari toLocaleDateString ke toLocaleString:
  * Sekarang menampilkan tanggal DAN jam dengan benar
  * Format Indonesia: "25 Januari 2025, 10.30"
- Restructure card peserta dengan urutan yang jelas:
  1. Nama - ditampilkan paling atas dengan font lebih besar
  2. Alamat - dengan emoji 📍 dan label "Alamat:"
  3. Jumlah Pohon - dengan emoji 🌳, label "Jumlah Pohon:", dan badge hijau
  4. Motivasi - dengan emoji 💬, label "Motivasi:", background abu-abu muda
  5. Tanggal Daftar - dengan emoji 📅, label "Tanggal Daftar:", dan format lengkap
- Menghapus truncate pada nama dan alamat agar data terlihat penuh
- Menambahkan spacing antar field dengan space-y-2
- Membuat motivasi lebih menonjol dengan background dan padding
- Semua update berhasil di-compile dan API berhasil mengambil data

Stage Summary:
- Format tanggal pendaftaran sekarang benar dan sesuai dengan database
- Tampilan list peserta lebih rapi dengan urutan field yang jelas
- Semua field yang diminta ditampilkan: Nama, Alamat, Jumlah Pohon, Motivasi, Tanggal Daftar
- Tampilan lebih informatif dengan label dan emoji untuk setiap field
- Data yang ditampilkan tidak terpotong (tidak ada truncate)

---

