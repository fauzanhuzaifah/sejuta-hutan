# CARA MENGHAPUS FILE DI REPO GITHUB DAN GANTI DENGAN ISI FOLDER INI

## LANGKAH-LANGKAH CEPAT

### 1. Dapatkan GitHub Token
- Login ke GitHub Anda
- Klik foto profil → Settings
- Developer settings → Personal access tokens → Tokens (classic)
- Generate new token
- Beri nama: "Repo Sync Tool"
- Centang scope: ✅ `repo`
- Generate token dan **SIMPAN TOKENNYA**

### 2. Set Token sebagai Environment Variable

**Windows (Command Prompt):**
```cmd
set GITHUB_TOKEN=your_token_here
```

**Windows (PowerShell):**
```powershell
$env:GITHUB_TOKEN = "your_token_here"
```

### 3. Jalankan Script

**Pilihan A - Jalankan langsung:**
```cmd
# Hapus file lama
node github-delete-all.js

# Upload file baru
node github-sync.js
```

**Pilihan B - Jalankan otomatis:**
```cmd
# Gunakan batch file
sync-github.bat
```

**Pilihan C - Jalankan otomatis (PowerShell):**
```powershell
# Gunakan PowerShell script
.\sync-github.ps1
```

**Pilihan D - Jalankan otomatis (Node.js):**
```cmd
node sync-github.js
```

## APA YANG AKAN TERJADI

1. Script akan menghapus SEMUA file yang ada di repository `fauzanhuzaifah/sejuta-hutan`
2. Semua file dalam folder ini akan diupload ke repository tersebut
3. Repository akan berisi:
   - `index.html` - Halaman utama website
   - `admin.html` - Halaman admin
   - `server.js` - Backend server
   - `package.json` - Dependencies
   - `Peserta_SejutaPohon_2026-03-31.csv` - Data peserta
   - File-file script GitHub sync

## STRUKTUR FILE

```
sejuta_pohon vanilla_versi_Neon - Copy/
├── index.html                              # Website utama
├── admin.html                              # Admin panel
├── server.js                               # Backend
├── package.json                            # Dependencies
├── Peserta_SejutaPohon_2026-03-31.csv    # Data
├── github-delete-all.js                    # Script hapus file
├── github-sync.js                          # Script upload file
├── sync-github.js                          # Script gabungan
├── sync-github.bat                         # Batch file (Windows)
├── sync-github.ps1                         # PowerShell script
├── .env.example                            # Template environment
└── GITHUB_SYNC_README.md                   # Dokumentasi
```

## TROUBLESHOOTING

### ❌ "GITHUB_TOKEN environment variable is required"
**Solusi:** Pastikan Anda sudah men-set token dengan benar
```cmd
echo %GITHUB_TOKEN%  # Cek apakah token ter-set
```

### ❌ "Bad credentials"
**Solusi:** Token Anda tidak valid atau tidak memiliki akses repo. Buat token baru dengan scope `repo`.

### ❌ "Repository not found"
**Solusi:** Pastikan repository `fauzanhuzaifah/sejuta-hutan` ada dan Anda memiliki akses.

### ❌ "Network error"
**Solusi:** Cek koneksi internet Anda dan pastikan GitHub dapat diakses.

## KEAMANAN

⚠️ **PERINGATAN PENTING:**
- JANGAN pernah share token GitHub Anda
- JANGAN commit token ke repository
- Hapus token dari environment setelah selesai jika perlu
- Gunakan token dengan scope minimal yang dibutuhkan

## CUSTOMIZATION

Jika ingin mengubah repository target, edit file:
- `github-delete-all.js` - Ganti `OWNER` dan `REPO`
- `github-sync.js` - Ganti `OWNER` dan `REPO`

## SUPPORT

Jika mengalami masalah:
1. Cek troubleshooting di atas
2. Pastikan token valid dan memiliki akses
3. Cek koneksi internet
4. Repository target ada dan accessible

## CONTOH OUTPUT SUKSES

```
✅ GitHub token detected
📁 Current directory: C:\Users\USER\Documents\html\sejuta_pohon vanilla_versi_Neon - Copy
🎯 Target repository: fauzanhuzaifah/sejuta-hutan

📋 Step 1: Deleting all files from GitHub repository...
✓ Deleted file: README.md
✓ Deleted file: index.html
✓ Deleted file: style.css
...

📋 Step 2: Uploading new files to GitHub repository...
✓ Uploaded: index.html
✓ Uploaded: admin.html
✓ Uploaded: server.js
...

🎉 Success! Repository has been updated.

📄 You can check the repository at:
https://github.com/fauzanhuzaifah/sejuta-hutan
```

**Selamat mencoba! 🚀**