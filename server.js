const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

// PostgreSQL Connection Pool (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL ||
        'postgresql://neondb_owner:npg_2eWGNaKP8LZi@ep-crimson-tooth-a1xgngig-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => console.error('Unexpected pool error:', err));

// ============================
// PESERTA API
// ============================

// GET all peserta
app.get('/api/peserta', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM peserta ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/peserta error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST new peserta
app.post('/api/peserta', async (req, res) => {
    const { nama, whatsapp, email, usia, alamat, pekerjaan, jumlah_pohon, motivasi } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO peserta (nama, whatsapp, email, usia, alamat, pekerjaan, jumlah_pohon, motivasi, timestamp)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
            [nama, whatsapp, email || null, usia || null, alamat, pekerjaan, jumlah_pohon, motivasi || null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/peserta error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE peserta by id
app.delete('/api/peserta/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    try {
        const result = await pool.query('DELETE FROM peserta WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/peserta/:id error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// ============================
// VERIFIKASI PESERTA
// ============================

// Verifikasi apakah nama + whatsapp terdaftar di peserta
app.post('/api/verify-peserta', async (req, res) => {
    const { nama, whatsapp } = req.body;
    if (!nama || !whatsapp) {
        return res.status(400).json({ error: 'Nama dan WhatsApp wajib diisi' });
    }
    try {
        // Normalisasi nomor whatsapp (hapus spasi, +, -)
        const normalizedWa = whatsapp.replace(/[\s\+\-]/g, '');
        const result = await pool.query(
            `SELECT id, nama, whatsapp FROM peserta 
             WHERE LOWER(TRIM(nama)) = LOWER(TRIM($1)) 
             AND REPLACE(REPLACE(REPLACE(whatsapp, ' ', ''), '+', ''), '-', '') = $2
             LIMIT 1`,
            [nama.trim(), normalizedWa]
        );
        if (result.rows.length > 0) {
            res.json({ 
                verified: true, 
                peserta: {
                    id: result.rows[0].id,
                    nama: result.rows[0].nama,
                    whatsapp: result.rows[0].whatsapp
                }
            });
        } else {
            res.json({ verified: false, message: 'Data tidak ditemukan. Pastikan nama dan nomor WhatsApp sudah terdaftar sebagai peserta.' });
        }
    } catch (err) {
        console.error('POST /api/verify-peserta error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// ============================
// KOMENTAR API (Threaded)
// ============================

// GET komentar dengan threading (parent-child hierarchy)
app.get('/api/komentar', async (req, res) => {
    try {
        // Ambil semua komentar yang tidak dihapus, urutkan by created_at ASC (oldest first untuk thread)
        const result = await pool.query(`
            SELECT k.*, p.id as peserta_id 
            FROM komentar k
            LEFT JOIN peserta p ON k.whatsapp = p.whatsapp AND LOWER(k.nama) = LOWER(p.nama)
            WHERE k.is_deleted = false
            ORDER BY k.created_at ASC
        `);
        
        // Build threaded structure
        const komentarMap = new Map();
        const roots = [];
        
        // First pass: create map
        result.rows.forEach(k => {
            komentarMap.set(k.id, { ...k, replies: [] });
        });
        
        // Second pass: build hierarchy
        result.rows.forEach(k => {
            if (k.parent_id && komentarMap.has(k.parent_id)) {
                komentarMap.get(k.parent_id).replies.push(komentarMap.get(k.id));
            } else {
                roots.push(komentarMap.get(k.id));
            }
        });
        
        // Sort roots by created_at DESC (newest first untuk root)
        roots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        res.json(roots);
    } catch (err) {
        console.error('GET /api/komentar error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST new komentar (root atau reply)
app.post('/api/komentar', async (req, res) => {
    const { nama, whatsapp, isi, parent_id } = req.body;
    if (!nama || !whatsapp || !isi) {
        return res.status(400).json({ error: 'Nama, WhatsApp, dan isi wajib diisi' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO komentar (nama, whatsapp, isi, parent_id, suka, created_at, is_deleted) 
             VALUES ($1, $2, $3, $4, 0, NOW(), false) RETURNING *`,
            [nama.trim(), whatsapp.trim(), isi.trim(), parent_id || null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/komentar error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// LIKE / UNLIKE komentar (toggle)
app.patch('/api/komentar/:id/like', async (req, res) => {
    const id = parseInt(req.params.id);
    const { action } = req.body; // 'like' atau 'unlike'
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    try {
        const increment = action === 'unlike' ? -1 : 1;
        const result = await pool.query(
            `UPDATE komentar SET suka = GREATEST(0, suka + $2) WHERE id = $1 AND is_deleted = false RETURNING *`,
            [id, increment]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PATCH /api/komentar/:id/like error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// SOFT DELETE komentar (mark as deleted)
app.delete('/api/komentar/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    try {
        // Soft delete - mark as deleted tapi jangan hapus data
        const result = await pool.query(
            'UPDATE komentar SET is_deleted = true, isi = $2 WHERE id = $1 RETURNING *',
            [id, '[Komentar telah dihapus]']
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true, message: 'Komentar dihapus' });
    } catch (err) {
        console.error('DELETE /api/komentar/:id error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌳 Server Sejuta Pohon berjalan di http://localhost:${PORT}`);
});
