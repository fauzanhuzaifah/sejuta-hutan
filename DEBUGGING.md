# Debugging Guide - Sejuta Pohon

## Masalah: Data Peserta Tidak Tampil

### 1. Cek Environment Variables
Pastikan environment variables berikut ter-set di Vercel:

```bash
# Di Vercel Dashboard > Settings > Environment Variables
TURSO_URL=your_turso_database_url
TURSO_TOKEN=your_turso_auth_token
```

### 2. Test API Endpoints
Gunakan endpoint debugging untuk memeriksa status:

```bash
# Test environment variables
https://your-app.vercel.app/api/debug-env

# Test dengan data dummy (tanpa database)
https://your-app.vercel.app/api/peserta-simple

# Test endpoint asli
https://your-app.vercel.app/api/peserta
```

### 3. Cek Browser Console
Buka browser console (F12) untuk melihat:
- API request/response logs
- Error messages dari fungsi sync()
- Data yang diterima dari server

### 4. Test API dengan cURL

```bash
# Test GET request
curl -X GET https://your-app.vercel.app/api/peserta \
  -H "Content-Type: application/json"

# Test dengan data dummy
curl -X GET https://your-app.vercel.app/api/peserta-simple
```

### 5. Cek Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Check database
turso db show sejuta-pohon

# Check data
turso db shell sejuta-pohon
> SELECT COUNT(*) FROM peserta;
> SELECT * FROM peserta LIMIT 5;
```

### 6. Common Issues & Solutions

#### Error: "Tidak dapat memuat data dari server"
- **Penyebab**: Environment variables tidak ter-set
- **Solusi**: Set `TURSO_URL` dan `TURSO_TOKEN` di Vercel

#### Error: "API Error: 500"
- **Penyebab**: Koneksi database gagal
- **Solusi**: Check Turso credentials dan network connectivity

#### Error: "Invalid Format: Expected array"
- **Penyebab**: API mengembalikan data bukan array
- **Solusi**: Check response format di browser console

### 7. Fallback Mechanism
Aplikasi ini memiliki fallback mechanism:
1. **Primary**: Data dari Turso database via API
2. **Fallback**: Data lokal dari localStorage
3. **Last resort**: Data dummy (untuk testing)

### 8. Testing Mode
Untuk testing tanpa database, gunakan:
```javascript
// Di browser console, set API ke endpoint dummy
App.Config.API_URL = 'https://your-app.vercel.app';
App.Data.sync(); // Akan menggunakan data dummy
```

### 9. Debug Steps
1. Buka browser console
2. Jalankan: `App.Data.sync()`
3. Cek logs untuk melihat:
   - API request URL
   - Response status
   - Data yang diterima
   - Error messages

### 10. Manual Data Insert (for testing)
```javascript
// Tambah data manual ke localStorage
const testData = [
  {
    id: 1,
    nama: "Test User",
    whatsapp: "081234567890",
    pekerjaan: "Developer",
    jumlah_pohon: 5,
    motivasi: "Test data",
    tanggal: new Date().toLocaleDateString('id-ID')
  }
];
localStorage.setItem('sejutaPohon_Lhokseumawe', JSON.stringify(testData));
App.UI.renderTable(); // Refresh tampilan
```

## Contact
Jika masalah berlanjut, check GitHub issues atau hubungi developer.