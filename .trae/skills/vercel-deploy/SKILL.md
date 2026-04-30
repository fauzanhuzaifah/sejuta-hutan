---
name: "vercel-deploy"
description: "Deploy aplikasi ke Vercel secara otomatis. Invoke ketika user ingin deploy ke Vercel."
---

# Vercel Deploy Skill

Skill ini melakukan deploy aplikasi ke Vercel secara otomatis termasuk:
- Membuat konfigurasi Vercel
- Setup environment variables
- Deploy aplikasi

## Cara Kerja

1. Mengecek struktur proyek
2. Membuat file konfigurasi vercel.json
3. Setup environment variables
4. Deploy ke Vercel

## Requirements

- Proyek harus memiliki package.json
- Aplikasi harus berbasis Node.js/Express
- Database connection (jika ada) harus dikonfigurasi

## Langkah-langkah Deploy

1. **Persiapan Proyek**:
   - Cek package.json
   - Buat vercel.json konfigurasi
   - Setup environment variables

2. **Deploy Process**:
   - Install Vercel CLI
   - Login ke Vercel
   - Deploy aplikasi

3. **Post Deploy**:
   - Cek status deploy
   - Test aplikasi
   - Berikan URL hasil deploy