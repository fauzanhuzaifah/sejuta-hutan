import { createClient } from '@libsql/client';

const TURSO_URL = 'libsql://sejuta-hutan-fauzanhuzaifah.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2Njk2NjEsImlkIjoiMDE5ZGE5YzMtMGIwMS03MzYwLWI3ZTAtMDU0MDdmNTI5NzdlIiwicmlkIjoiZWEzMzc0MDItZmE0ZC00ZWYyLWFmOTUtODkwYTllNmI2ODUyIn0.-AVbUy6h1iV5uuHXEGxkBp2TrWoqd61MqcTgTJb3KmZy1KJuVuPDVG9tpZb-CT3Wj9va9aCQL1DPAa1IGVXtAw';

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

async function checkData() {
  try {
    console.log('=== CHECK DATA DI TURSO ===\n');
    
    console.log('1. TABEL KOMENTAR:');
    const komentar = await client.execute('SELECT * FROM komentar ORDER BY created_at DESC');
    console.log(`Total komentar: ${komentar.rows.length}`);
    komentar.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Nama: ${row.nama}, WA: ${row.whatsapp}, Isi: ${row.isi?.substring(0, 30)}..., Created: ${row.created_at}`);
    });
    
    console.log('\n2. TABEL PESERTA:');
    const peserta = await client.execute('SELECT COUNT(*) as count FROM peserta');
    console.log(`Total peserta: ${peserta.rows[0].count}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

checkData();
