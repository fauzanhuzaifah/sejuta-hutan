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

    // Cek apakah komentar ada
    const komentar = await db.komentar.findUnique({
      where: { id },
    });

    if (!komentar) {
      return NextResponse.json(
        { success: false, message: 'Komentar tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus komentar
    await db.komentar.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Komentar berhasil dihapus' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting komentar:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menghapus komentar' },
      { status: 500 }
    );
  }
}
