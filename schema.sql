-- Turso Schema for Sejuta Pohon
-- Run this in Turso dashboard or CLI

CREATE TABLE IF NOT EXISTS peserta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    usia INTEGER,
    pekerjaan TEXT NOT NULL,
    alamat TEXT NOT NULL,
    jumlah_pohon INTEGER DEFAULT 1,
    motivasi TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS komentar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    isi TEXT NOT NULL,
    parent_id INTEGER REFERENCES komentar(id),
    suka INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_peserta_whatsapp ON peserta(whatsapp);
CREATE INDEX IF NOT EXISTS idx_komentar_parent ON komentar(parent_id);
CREATE INDEX IF NOT EXISTS idx_komentar_deleted ON komentar(is_deleted);
