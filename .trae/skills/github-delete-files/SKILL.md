---
name: "github-delete-files"
description: "Menghapus file di GitHub repository melalui API. Invoke ketika user ingin menghapus file di repo GitHub tertentu."
---

# GitHub Delete Files Skill

Skill ini digunakan untuk menghapus file di GitHub repository melalui GitHub API.

## Fungsi
- Menghapus file di GitHub repository
- Memerlukan GitHub Personal Access Token dengan akses repo
- Memerlukan nama owner, nama repository, dan path file yang akan dihapus

## Cara Penggunaan
1. User harus memiliki GitHub Personal Access Token dengan akses repo
2. Gunakan GitHub API untuk menghapus file
3. Dapatkan SHA dari file yang akan dihapus terlebih dahulu
4. Hapus file dengan commit message

## Contoh API Call
```bash
curl -X DELETE \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/contents/PATH_TO_FILE
```

## Parameter yang Dibutuhkan
- `owner`: Username atau organization yang memiliki repository
- `repo`: Nama repository
- `path`: Path file yang akan dihapus
- `message`: Commit message
- `sha`: SHA dari file yang akan dihapus (dapatkan dari API get contents)