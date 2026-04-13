* - pekerjaan: string (optional)
 * - jumlah_pohon: number (optional, default: 1)
 * - motivasi: string (optional)
 *
 * Response:
 * - success: boolean
 * - message: string
 * - data?: Peserta
 */

interface PesertaRequest {
  nama: string;
  email: string;
  whatsapp?: string;
  alamat: string;
  usia?: number;
  pekerjaan?: string;
  jumlah_pohon?: number;
  motivasi?: string;
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
    if (!body.nama || !body.email || !body.alamat) {
      return NextResponse.json(
        {
          success: false,
          message: 'Field wajib (nama, email, alamat) harus diisi',
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

    // Validasi format whatsapp (jika diisi)
    if (body.whatsapp && !isValidPhone(body.whatsapp)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Format nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx',
        },
        { status: 400 }
      );
    }

    // Validasi usia
    const usia = body.usia ? parseInt(body.usia.toString(), 10) : null;
    if (usia !== null && (isNaN(usia) || usia < 10 || usia > 100)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usia harus antara 10 dan 100 tahun',
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
    const existingPeserta = await db.peserta.findFirst({
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
        whatsapp: body.whatsapp?.trim() || null,
        alamat: body.alamat.trim(),
        usia: usia,
        pekerjaan: body.pekerjaan?.trim() || null,
        jumlah_pohon: jumlahPohon,
        motivasi: body.motivasi?.trim() || null,
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
          jumlah_pohon: peserta.jumlah_pohon,
          timestamp: peserta.timestamp,
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
    const where: any = {}; // status tidak ada di database snake_case
    // if (status && ['pending', 'confirmed', 'completed'].includes(status)) {
    //   where.status = status;
    // }

    // Fetch peserta dengan pagination menggunakan raw query
    const [pesertaRaw, totalResult, totalTreesResult] = await Promise.all([
      db.$queryRaw`
        SELECT
          id,
          nama,
          alamat,
          usia,
          pekerjaan,
          jumlah_pohon,
          motivasi,
          timestamp::text
        FROM "peserta"
        ORDER BY "timestamp" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `,
      db.$queryRaw`SELECT COUNT(*) as count FROM "peserta"`,
      db.$queryRaw`SELECT COALESCE(SUM("jumlah_pohon"), 0) as total FROM "peserta"`
    ]);

    // Convert timestamp strings to ISO format
    const peserta = pesertaRaw.map((p: any) => ({
      id: p.id,
      nama: p.nama,
      alamat: p.alamat,
      usia: p.usia,
      pekerjaan: p.pekerjaan,
      jumlah_pohon: p.jumlah_pohon,
      motivasi: p.motivasi,
      timestamp: p.timestamp
    }));

    const total = parseInt((totalResult as any)[0]?.count || '0', 10);
    const totalTrees = parseInt((totalTreesResult as any)[0]?.total || '0', 10);

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
        totalTrees,
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
