import { Pool } from 'pg';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function debug() {
  const client = await pool.connect();
  const dbRes = await client.query('SELECT id, nama, whatsapp FROM peserta ORDER BY id');
  const dbNames = dbRes.rows.map(r => ({ id: r.id, nama: r.nama.trim().toLowerCase(), whatsapp: r.whatsapp }));
  console.log('Database (nama lower case):', dbNames.map(d => d.nama));

  const rows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, 'peserta.csv'))
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });
  const csvData = rows.map(row => ({
    nama: (row.Nama || row.nama || '').trim().toLowerCase(),
    timestampRaw: row.Timestamp || row.timestamp,
    whatsapp: (row.WhatsApp || row.whatsapp || '').trim()
  }));
  console.log('CSV (nama lower case):', csvData.map(c => c.nama));

  // Cek kecocokan
  for (const db of dbNames) {
    const match = csvData.find(c => c.nama === db.nama);
    if (match) {
      console.log(`✅ Cocok: ${db.nama} -> timestamp: ${match.timestampRaw}`);
    } else {
      console.log(`❌ Tidak cocok: ${db.nama}`);
    }
  }
  client.release();
  await pool.end();
}
debug();