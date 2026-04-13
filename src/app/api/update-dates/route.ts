import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

// Fungsi untuk membaca dan memparsing CSV
function parseCSV(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf-8');
  const lines = fileContent.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line, index) => {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] || '';
    });
    return obj;
  });
}

export async function POST() {
  try {
    console.log('📅 Memperbarui tanggal dari peserta_template.csv...');

    const csvPath = join(process.cwd(), 'peserta_template.csv');
    const records = parseCSV(csvPath);

    console.log(`📊 Ditemukan ${records.length} record di template CSV`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const record of records) {
      const { Timestamp, Nama, WhatsApp, Email, 'Jumlah Pohon': JumlahPohon } = record;

      if (!Timestamp || !Nama) {
        const msg = `Skip: Data tidak lengkap - ${Nama || 'Tanpa Nama'}`;
        errors.push(msg);
        errorCount++;
        continue;
      }

      try {
        // Parse timestamp dari CSV
        const createdAt = new Date(Timestamp);

        if (isNaN(createdAt.getTime())) {
          const msg = `Skip: Timestamp tidak valid - ${Timestamp} untuk ${Nama}`;
          errors.push(msg);
          errorCount++;
          continue;
        }

        // Cari peserta berdasarkan nama dan email/telepon
        const peserta = await db.peserta.findFirst({
          where: {
            nama: Nama,
            OR: [
              { email: Email || undefined },
              { telepon: WhatsApp || undefined }
            ]
          }
        });

        if (!peserta) {
          const msg = `Skip: Tidak ditemukan peserta - ${Nama}`;
          errors.push(msg);
          errorCount++;
          continue;
        }

        // Update createdAt
        await db.peserta.update({
          where: { id: peserta.id },
          data: { createdAt }
        });

        console.log(`✅ Update: ${Nama} -> ${createdAt.toLocaleString('id-ID')}`);
        successCount++;

      } catch (error) {
        const msg = `Error: ${Nama} - ${error}`;
        console.error(msg);
        errors.push(msg);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Update tanggal selesai',
      stats: {
        total: records.length,
        success: successCount,
        error: errorCount
      },
      errors
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan',
      error: String(error)
    }, { status: 500 });
  }
}
