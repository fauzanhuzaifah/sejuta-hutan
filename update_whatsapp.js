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

async function updateWhatsapp() {
  const client = await pool.connect();
  try {
    // Baca CSV
    const rows = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, 'peserta.csv'))
        .pipe(csv())
        .on('data', row => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    console.log(`📄 ${rows.length} baris CSV`);

    let updated = 0;
    for (const row of rows) {
      const nama = (row.Nama || row.nama || '').trim();
      let whatsapp = row.WhatsApp || row.whatsapp || null;
      if (whatsapp && !whatsapp.startsWith('0')) {
        whatsapp = '0' + whatsapp; // normalisasi
      }
      if (!nama || !whatsapp) continue;

      const res = await client.query(
        `UPDATE peserta SET whatsapp = $1 WHERE LOWER(nama) = LOWER($2) AND (whatsapp IS NULL OR whatsapp = '')`,
        [whatsapp, nama]
      );
      if (res.rowCount > 0) {
        updated++;
        console.log(`✅ Update WA untuk ${nama} -> ${whatsapp}`);
      }
    }
    console.log(`🎉 Total update: ${updated} baris.`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

updateWhatsapp();