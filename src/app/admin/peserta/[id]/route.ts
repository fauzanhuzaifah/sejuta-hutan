import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah peserta ada
    const peserta = await db.peserta.findUnique({
      where: { id },
    });

    if (!peserta) {
      return NextResponse.json(
        { success: false, message: 'Peserta tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus peserta
    await db.peserta.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Peserta berhasil dihapus' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting peserta:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menghapus peserta' },
      { status: 500 }
    );
  }
}
