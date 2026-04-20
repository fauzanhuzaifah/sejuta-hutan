# Deploy ke Vercel + Turso

## 1. Setup Turso Database

### Install Turso CLI
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### Login & Create Database
```bash
turso auth login
turso db create sejuta-pohon
turso db show sejuta-pohon
```

### Create Tables
```bash
turso db shell sejuta-pohon < schema.sql
```

### Get Credentials
```bash
# URL
turso db show sejuta-pohon --url

# Token
turso db tokens create sejuta-pohon
```

## 2. Setup Vercel

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login & Link Project
```bash
vercel login
vercel link
```

### Set Environment Variables
```bash
vercel env add TURSO_URL
# Paste URL dari turso db show --url

vercel env add TURSO_TOKEN
# Paste token dari turso db tokens create
```

### Deploy
```bash
vercel --prod
```

## 3. GitHub Integration (Opsional)

1. Push ke GitHub
2. Import repo di [vercel.com](https://vercel.com)
3. Add Environment Variables di dashboard
4. Enable Auto-deploy

## 4. API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/peserta` | GET | List semua peserta |
| `/api/peserta` | POST | Tambah peserta baru |
| `/api/peserta` | DELETE | Hapus semua peserta |
| `/api/komentar` | GET | List komentar (threaded) |
| `/api/komentar` | POST | Tambah komentar |
| `/api/komentar?id=X` | PATCH | Like komentar |
| `/api/komentar?id=X` | DELETE | Soft delete komentar |
| `/api/verify` | POST | Verifikasi peserta |

## 5. Test API

```bash
# Get peserta
curl https://your-app.vercel.app/api/peserta

# Add peserta
curl -X POST https://your-app.vercel.app/api/peserta \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test","whatsapp":"08123456789","pekerjaan":"Developer","alamat":"Lhokseumawe","motivasi":"Test"}'

# Verify
curl -X POST https://your-app.vercel.app/api/verify \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test","whatsapp":"08123456789"}'
```
