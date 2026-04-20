const { createClient } = require('@libsql/client');

const turso = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
});

const schema = `
CREATE TABLE IF NOT EXISTS peserta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    usia INTEGER,
    pekerjaan TEXT,
    alamat TEXT,
    jumlah_pohon INTEGER DEFAULT 1,
    motivasi TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS komentar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    whatsapp TEXT,
    isi TEXT NOT NULL,
    parent_id INTEGER,
    suka INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (parent_id) REFERENCES komentar(id)
);

CREATE INDEX IF NOT EXISTS idx_peserta_whatsapp ON peserta(whatsapp);
CREATE INDEX IF NOT EXISTS idx_komentar_parent ON komentar(parent_id);
CREATE INDEX IF NOT EXISTS idx_komentar_deleted ON komentar(is_deleted);
`;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const statements = schema.split(';').filter(s => s.trim());
        for (const sql of statements) {
            if (sql.trim()) {
                await turso.execute(sql);
            }
        }
        res.status(200).json({ success: true, message: 'Database setup complete' });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: error.message });
    }
}
