import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * API Endpoint untuk Komentar Program Menanam Sejuta Pohon
 *
 * Method: GET
 * Query Params:
 * - limit: number (default: 10)
 * - offset: number (default: 0)
 *
 * Method: POST
 * Body:
 * - nama: string (required)
 * - whatsapp: string (required)
 * - isi: string (required, 20-500 karakter)
 *
 * Response:
 * - success: boolean
 * - message: string
 * - data?: Komentar | Komentar[]
 * - pagination?: { total, limit, offset, hasMore }
 */

interface KomentarRequest {
  nama: string;
  whatsapp: string;
  isi: string;
}

// Validasi nomor telepon Indonesia
function isValidPhone(phone: string): boolean {
  // Support format: 08xx, 628xx, +628xx
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

// POST handler untuk menyimpan komentar baru
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: KomentarRequest = await request.json();

    // Validasi field required
    if (!body.nama || !body.whatsapp || !body.isi) {
      return NextResponse.json(
        {
          success: false,
          message: 'Semua field (nama, whatsapp, isi komentar) harus diisi',
        },
        { status: 400 }
      );
    }

    // Validasi format nama
    const nama = body.nama.trim();
    if (!nama || nama.length < 2 || nama.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama harus antara 2-100 karakter',
        },
        { status: 400 }
      );
    }

    // Validasi format whatsapp
    const whatsapp = body.whatsapp.trim();
    if (!isValidPhone(whatsapp)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Format nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx',
        },
        { status: 400 }
      );
    }

    // Validasi panjang isi komentar (20-500 karakter)
    const isi = body.isi.trim();
    if (isi.length < 20) {
      return NextResponse.json(
        {
          success: false,
          message: 'Isi komentar minimal 20 karakter',
        },
        { status: 400 }
      );
    }

    if (isi.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message: 'Isi komentar maksimal 500 karakter',
        },
        { status: 400 }
      );
    }

    // Verifikasi bahwa pengirim adalah peserta terdaftar
    // Cek berdasarkan nama dan whatsapp (case-insensitive untuk nama)
    const peserta = await db.peserta.findFirst({
      where: {
        nama: {
          equals: nama,
          mode: 'insensitive'
        },
        whatsapp: whatsapp
      }
    });

    if (!peserta) {
      return NextResponse.json(
        {
          success: false,
          message: 'Hanya peserta yang sudah terdaftar yang dapat memberikan komentar. Pastikan nama dan nomor WhatsApp sesuai dengan data pendaftaran.',
        },
        { status: 403 }
      );
    }

    // Buat komentar baru
    const komentar = await db.komentar.create({
      data: {
        nama: nama,
        whatsapp: whatsapp,
        isi: isi,
        suka: 0,
      },
    });

    // Response sukses
    return NextResponse.json(
      {
        success: true,
        message: 'Komentar berhasil dikirim!',
        data: {
          id: komentar.id,
          nama: komentar.nama,
          isi: komentar.isi,
          suka: komentar.suka,
          createdAt: komentar.createdAt,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating komentar:', error);

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          message: 'Terjadi kesalahan database.',
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

// GET handler untuk mengambil daftar komentar
export async function GET(request: NextRequest) {
  try {
    // Ambil query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
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

    // Fetch komentar dengan pagination
    const [komentar, total] = await Promise.all([
      db.komentar.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          nama: true,
          isi: true,
          suka: true,
          createdAt: true,
        },
      }),
      db.komentar.count(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Berhasil mengambil data komentar',
        data: komentar,
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
    console.error('Error fetching komentar:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data komentar.',
      },
      { status: 500 }
    );
  }
}
