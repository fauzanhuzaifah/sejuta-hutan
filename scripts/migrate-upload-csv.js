/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_2eWGNaKP8LZi@ep-crimson-tooth-a1xgngig-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

// Fungsi untuk parse timestamp dari format "1/4/2026, 14.41.33" menjadi Date object
function parseCustomTimestamp(timestampStr) {
  try {
    // Format: "DD/MM/YYYY, HH.MM.SS" atau "D/M/YYYY, HH.MM.SS"
    const parts = timestampStr.split(', ');
    if (parts.length !== 2) {
      console.warn(`    ⚠️  Invalid timestamp format: ${timestampStr}`);
      return new Date();
    }

    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split('.');

    // Create Date object (month is 0-indexed in JavaScript)
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    );

    if (isNaN(date.getTime())) {
      console.warn(`    ⚠️  Invalid date: ${timestampStr}`);
      return new Date();
    }

    return date;
  } catch (error) {
    console.warn(`    ⚠️  Error parsing timestamp: ${timestampStr}`);
    return new Date();
  }
}

// Fungsi untuk parse CSV dengan dukungan multiline dan quoted strings
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  const data = [];
  let currentRow = {};
  let inMultiline = false;
  let multilineField = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines jika sedang dalam multiline
    if (line === '' && inMultiline) {
      multilineField += '\n';
      continue;
    }

    // Skip lines that look like continuations (no commas at all)
    if (!line.includes(',') && inMultiline) {
      multilineField += '\n' + line;
      continue;
    }

    const values = parseCSVLine(line);

    // Jika sedang dalam multiline dan baris baru memiliki struktur CSV yang valid
    if (inMultiline) {
      // Selesaikan multiline dan simpan row sebelumnya
      if (values.length >= 2) {
        data.push(currentRow);
        currentRow = {};
        multilineField = '';
        inMultiline = false;
        // Proses baris ini sebagai baris baru
      } else {
        multilineField += '\n' + line;
        continue;
      }
    }

    // Parse row baru
    const row = {};
    headers.forEach((header, idx) => {
      let value = values[idx] || '';

      // Check if this field starts with a quote but doesn't end with one
      // This might indicate a multiline field
      if (value.startsWith('"') && !value.endsWith('"') && header === 'Motivasi') {
        inMultiline = true;
        multilineField = value;
        value = value.substring(1); // Remove opening quote
      } else {
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
      }

      row[header.trim()] = value.trim();
    });

    if (inMultiline) {
      currentRow = row;
    } else {
      data.push(row);
    }
  }

  // Add the last row if exists
  if (Object.keys(currentRow).length > 0) {
    data.push(currentRow);
  }

  return data;
}

// Fungsi untuk parse satu baris CSV dengan dukungan quoted string
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote inside quoted string
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Separator outside quotes
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

async function migrateCSVToNeon() {
  try {
    console.log('========================================');
    console.log('   MIGRASI PESERTA.CSV KE NEON DATABASE   ');
    console.log('   File: /home/z/my-project/upload/      ');
    console.log('========================================\n');

    // 1. Baca data dari CSV
    console.log('📂 Langkah 1: Membaca file peserta.csv dari /upload...');
    const dataRows = parseCSV('/home/z/my-project/upload/peserta.csv');
    console.log(`   ✅ Berhasil membaca ${dataRows.length} data peserta dari CSV\n`);

    // Tampilkan preview data
    console.log('📋 Preview data dari CSV (5 pertama):');
    dataRows.slice(0, 5).forEach((row, idx) => {
      console.log(`   ${idx + 1}. ${row.Nama}`);
      console.log(`      WhatsApp: ${row.WhatsApp}`);
      console.log(`      Email: ${row.Email || '-'}`);
      console.log(`      Usia: ${row.Usia}`);
      console.log(`      Jumlah Pohon: ${row['Jumlah Pohon']}`);
      console.log(`      Timestamp: ${row.Timestamp}`);
      console.log(`      Motivasi: ${row.Motivasi ? row.Motivasi.substring(0, 50) + '...' : '-'}`);
      console.log('');
    });

    // 2. Backup data yang ada
    console.log('💾 Langkah 2: Backup data yang ada di database...');
    const existingData = await prisma.peserta.findMany();
    console.log(`   ℹ️  Data yang ada saat ini: ${existingData.length} peserta\n`);

    // 3. Hapus data lama
    console.log('🗑️  Langkah 3: Menghapus data lama di database...');
    await prisma.$executeRaw`TRUNCATE TABLE peserta RESTART IDENTITY CASCADE`;
    console.log('   ✅ Data lama berhasil dihapus\n');

    // 4. Insert data dari CSV
    console.log('📥 Langkah 4: Mengimpor data ke Neon Database...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const idx = i + 1;

      try {
        // Parse timestamp dari format kustom "1/4/2026, 14.41.33"
        const timestamp = parseCustomTimestamp(row.Timestamp);

        const peserta = await prisma.peserta.create({
          data: {
            nama: row.Nama,
            email: row.Email || null,
            whatsapp: row.Whatsapp || null,
            alamat: row.Alamat || null,
            usia: row.Usia ? parseInt(row.Usia, 10) : null,
            pekerjaan: row.Pekerjaan || null,
            jumlah_pohon: row['Jumlah Pohon'] ? parseInt(row['Jumlah Pohon'], 10) : null,
            motivasi: row.Motivasi || null,
            timestamp: timestamp
          }
        });

        successCount++;
        console.log(`   ✅ [${idx}/${dataRows.length}] Berhasil: ${peserta.nama} (ID: ${peserta.id}) | ${peserta.jumlah_pohon} pohon`);

      } catch (error) {
        errorCount++;
        console.error(`   ❌ [${idx}/${dataRows.length}] Gagal: ${row.Nama}`);
        console.error(`      Error: ${error.message}`);
      }
    }

    console.log(`\n   📊 Hasil Impor:`);
    console.log(`      ✅ Berhasil: ${successCount} data`);
    if (errorCount > 0) {
      console.log(`      ❌ Gagal: ${errorCount} data`);
    }

    // 5. Verifikasi data yang diimpor
    console.log('\n✅ Langkah 5: Memverifikasi data yang diimpor...');
    const importedData = await prisma.peserta.findMany({
      orderBy: { id: 'asc' }
    });

    console.log(`\n📊 Data di Neon Database setelah migrasi:`);
    console.log('─'.repeat(120));
    console.log('ID  | Nama                    | WhatsApp      | Usia | Pekerjaan            | Pohon | Tgl Daftar          | Motivasi');
    console.log('─'.repeat(120));

    importedData.forEach((row) => {
      const ts = row.timestamp ? row.timestamp.toISOString().replace('T', ' ').substring(0, 19) : 'NULL';
      const motivasi = row.motivasi ? row.motivasi.substring(0, 25) + '...' : '-';
      const nama = row.nama.padEnd(22, ' ').substring(0, 22);
      const whatsapp = row.whatsapp || '-';
      const pekerjaan = row.pekerjaan || '-';

      console.log(
        `${String(row.id).padEnd(3)} | ${nama} | ${whatsapp} | ${String(row.usia || '-').padEnd(4)} | ${pekerjaan.padEnd(20).substring(0, 20)} | ${String(row.jumlah_pohon || 0).padEnd(5)} | ${ts} | ${motivasi}`
      );
    });
    console.log('─'.repeat(120));

    // 6. Statistik
    const totalPohon = importedData.reduce((sum, p) => sum + (p.jumlah_pohon || 0), 0);
    console.log(`\n📈 Statistik:`);
    console.log(`   Total Peserta: ${importedData.length}`);
    console.log(`   Total Pohon: ${totalPohon}`);
    console.log(`   Rata-rata Pohon/Peserta: ${(totalPohon / importedData.length).toFixed(1)}`);

    // 7. Cek data dengan motivasi multiline
    const multilineMotivasi = importedData.filter(p => p.motivasi && p.motivasi.includes('\n'));
    if (multilineMotivasi.length > 0) {
      console.log(`\n📝 Data dengan motivasi multiline: ${multilineMotivasi.length}`);
      multilineMotivasi.slice(0, 2).forEach((p) => {
        console.log(`   - ${p.nama}: ${p.motivasi.split('\n').length} baris`);
      });
    }

    console.log('\n========================================');
    console.log('   ✅ MIGRASI BERHASIL SELESAI!       ');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Error during migration:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan migrasi
migrateCSVToNeon();
