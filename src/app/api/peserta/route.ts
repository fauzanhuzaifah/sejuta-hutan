import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * API Endpoint untuk Pendaftaran Peserta Program Menanam Sejuta Pohon
 *
 * Method: POST
 * Body:
 * - nama: string (required)
 * - email: string (required)
 * - telepon: string (required)
 * - alamat: string (required)
 * - jumlah_pohon: number (optional, default: 1)
 * - pesan: string (optional)
 *
 * Response:
 * - success: boolean
 * - message: string
 * - data?: Peserta
 */

interface PesertaRequest {
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
  jumlah_pohon?: number;
  pesan?: string;
}

// Validasi email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validasi nomor telepon Indonesia
function isValidPhone(phone: string): boolean {
  // Support format: 08xx, 628xx, +628xx
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

// POST handler untuk menyimpan peserta baru
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: PesertaRequest = await request.json();

    // Validasi field required
    if (!body.nama || !body.email || !body.telepon || !body.alamat) {
      return NextResponse.json(
        {
          success: false,
          message: 'Semua field wajib (nama, email, telepon, alamat) harus diisi',
        },
        { status: 400 }
      );
    }

    // Validasi format email
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Format email tidak valid',
        },
        { status: 400 }
      );
    }

    // Validasi format telepon
    if (!isValidPhone(body.telepon)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Format nomor telepon tidak valid. Gunakan format: 08xxxxxxxxxx',
        },
        { status: 400 }
      );
    }

    // Validasi jumlah_pohon
    const jumlahPohon = body.jumlah_pohon ? parseInt(body.jumlah_pohon.toString(), 10) : 1;
    if (isNaN(jumlahPohon) || jumlahPohon < 1 || jumlahPohon > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Jumlah pohon harus antara 1 dan 1000',
        },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingPeserta = await db.peserta.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existingPeserta) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email ini sudah terdaftar dalam program. Jika Anda ingin mendaftar ulang, silakan hubungi admin.',
        },
        { status: 409 }
      );
    }

    // Buat peserta baru
    const peserta = await db.peserta.create({
      data: {
        nama: body.nama.trim(),
        email: body.email.toLowerCase().trim(),
        telepon: body.telepon.trim(),
        alamat: body.alamat.trim(),
        jumlahPohon: jumlahPohon,
        pesan: body.pesan?.trim() || null,
        status: 'pending', // Status default adalah pending
      },
    });

    // Response sukses
    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran berhasil! Terima kasih telah berpartisipasi dalam program Menanam Sejuta Pohon.',
        data: {
          id: peserta.id,
          nama: peserta.nama,
          email: peserta.email,
          jumlahPohon: peserta.jumlahPohon,
          status: peserta.status,
          createdAt: peserta.createdAt,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating peserta:', error);

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email ini sudah terdaftar dalam program.',
        },
        { status: 409 }
      );
    }

    // Handle connection errors
    if (error.code === 'P1001' || error.code === 'P1000') {
      return NextResponse.json(
        {
          success: false,
          message: 'Terjadi kesalahan koneksi database. Silakan coba lagi nanti.',
        },
        { status: 503 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server. Silakan coba lagi nanti.',
      },
      { status: 500 }
    );
  }
}

// GET handler untuk mengambil daftar peserta (opsional, untuk admin)
export async function GET(request: NextRequest) {
  try {
    // Ambil query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Validasi limit
    if (limit > 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'Limit maksimal adalah 100',
        },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {};
    if (status && ['pending', 'confirmed', 'completed'].includes(status)) {
      where.status = status;
    }

    // Fetch peserta dengan pagination
    const [peserta, total] = await Promise.all([
      db.peserta.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          nama: true,
          email: true,
          telepon: true,
          alamat: true,
          jumlahPohon: true,
          pesan: true,
          status: true,
          createdAt: true,
        },
      }),
      db.peserta.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Berhasil mengambil data peserta',
        data: peserta,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error fetching peserta:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data peserta.',
      },
      { status: 500 }
    );
  }
}
