/**
 * Script untuk mengimpor data peserta dari file CSV ke database PostgreSQL Neon
 *
 * Cara menjalankan:
 * bun run scripts/import-csv.ts
 *
 * Pastikan file CSV berada di: project-root/peserta_sejuta_pohon_formatted.csv
 *
 * Format CSV yang diharapkan:
 * nama,email,telepon,alamat,jumlahPohon,pesan
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface CsvRow {
  nama: string
  email: string
  telepon: string
  alamat: string
  jumlahPohon?: string
  pesan?: string
}

function parseCSV(csvText: string): CsvRow[] {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())

  const data: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    data.push(row as CsvRow)
  }

  return data
}

async function importCSVToDatabase() {
  try {
    console.log('🌱 Memulai import data dari CSV...')

    // Path ke file CSV
    const csvPath = path.join(process.cwd(), 'peserta_sejuta_pohon_formatted.csv')

    // Cek apakah file CSV ada
    if (!fs.existsSync(csvPath)) {
      console.error('❌ File CSV tidak ditemukan:', csvPath)
      console.log('   Pastikan file peserta_sejuta_pohon_formatted.csv berada di root project')
      return
    }

    // Baca file CSV
    const csvText = fs.readFileSync(csvPath, 'utf-8')
    console.log('📄 File CSV berhasil dibaca')

    // Parse CSV
    const data = parseCSV(csvText)
    console.log(`📊 Ditemukan ${data.length} baris data`)

    if (data.length === 0) {
      console.log('⚠️  Tidak ada data untuk diimport')
      return
    }

    // Import data ke database
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]

      try {
        // Konversi jumlahPohon ke number
        const jumlahPohon = row.jumlahPohon ? parseInt(row.jumlahPohon, 10) : 1

        // Insert ke database
        await prisma.peserta.create({
          data: {
            nama: row.nama,
            email: row.email,
            telepon: row.telepon,
            alamat: row.alamat,
            jumlahPohon: isNaN(jumlahPohon) ? 1 : jumlahPohon,
            pesan: row.pesan || null,
            status: 'confirmed', // Data dari CSV dianggap sudah dikonfirmasi
          },
        })

        successCount++
        console.log(`✅ [${i + 1}/${data.length}] Berhasil import: ${row.nama}`)

      } catch (error: any) {
        errorCount++
        const errorMsg = error?.message || 'Unknown error'
        errors.push(`[${i + 1}] ${row.nama}: ${errorMsg}`)
        console.log(`❌ [${i + 1}/${data.length}] Gagal import: ${row.nama} - ${errorMsg}`)
      }
    }

    // Tampilkan ringkasan
    console.log('\n' + '='.repeat(60))
    console.log('📊 RINGKASAN IMPORT')
    console.log('='.repeat(60))
    console.log(`✅ Berhasil: ${successCount} data`)
    console.log(`❌ Gagal: ${errorCount} data`)
    console.log(`📊 Total: ${data.length} data`)

    if (errors.length > 0) {
      console.log('\n⚠️  Detail Error:')
      errors.forEach(err => console.log(`   ${err}`))
    }

    console.log('\n✨ Import selesai!')

  } catch (error: any) {
    console.error('❌ Terjadi kesalahan:', error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Jalankan import
importCSVToDatabase()
