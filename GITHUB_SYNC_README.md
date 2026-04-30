# GitHub Repository Sync Tool

Alat ini digunakan untuk menghapus semua file di repository GitHub dan menggantinya dengan isi folder lokal.

## Persiapan

### 1. GitHub Personal Access Token
Anda memerlukan GitHub Personal Access Token dengan akses `repo`.

**Cara membuat token:**
1. Login ke GitHub
2. Klik foto profil → Settings
3. Developer settings → Personal access tokens → Tokens (classic)
4. Generate new token
5. Beri nama dan pilih scope: `repo`
6. Copy token yang dihasilkan

### 2. Install Dependencies
```bash
npm install
```

## Cara Penggunaan

### Langkah 1: Hapus Semua File di Repository
```bash
# Set environment variable dengan token Anda
set GITHUB_TOKEN=your_github_token_here

# Jalankan script untuk menghapus semua file
node github-delete-all.js
```

### Langkah 2: Upload File Baru
```bash
# Pastikan GITHUB_TOKEN masih di-set
# Jalankan script untuk upload file dari folder ini
node github-sync.js
```

### Atau Jalankan Sekaligus (Windows)
```bash
# Hapus file lama
git clone https://github.com/fauzanhuzaifah/sejuta-hutan.git temp_repo
cd temp_repo
set GITHUB_TOKEN=your_github_token_here
node ../github-delete-all.js
cd ..

# Upload file baru
set GITHUB_TOKEN=your_github_token_here
node github-sync.js
```

## File yang Ada di Folder Ini

- `index.html` - Halaman utama
- `admin.html` - Halaman admin
- `server.js` - Server backend
- `package.json` - Dependencies
- `Peserta_SejutaPohon_2026-03-31.csv` - Data peserta
- `github-delete-all.js` - Script untuk menghapus file di GitHub
- `github-sync.js` - Script untuk upload file ke GitHub

## Troubleshooting

### Error: GITHUB_TOKEN environment variable is required
Pastikan Anda telah meng-set environment variable `GITHUB_TOKEN` sebelum menjalankan script.

### Error: Bad credentials
Token GitHub Anda tidak valid atau tidak memiliki akses yang cukup. Pastikan token memiliki scope `repo`.

### Error: Repository not found
Pastikan nama owner (`fauzanhuzaifah`) dan nama repository (`sejuta-hutan`) sudah benar.

### Error: Branch not found
Pastikan branch yang digunakan (default: `main`) ada di repository.

## Keamanan

- JANGAN pernah commit atau push token GitHub Anda ke repository
- Gunakan environment variable untuk menyimpan token
- Hapus token dari GitHub jika tidak digunakan lagi

## Catatan

- Script ini akan menghapus SEMUA file di repository target
- Pastikan Anda memiliki backup jika diperlukan
- Proses ini tidak dapat dibatalkan setelah dilakukan