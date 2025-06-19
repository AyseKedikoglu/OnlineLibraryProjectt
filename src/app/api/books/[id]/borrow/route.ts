import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor!' },
        { status: 401 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!book) {
      return NextResponse.json(
        { message: 'Kitap bulunamadı!' },
        { status: 404 }
      );
    }

    if (book.status !== 'AVAILABLE') {
      return NextResponse.json(
        { message: 'Bu kitap şu anda ödünç alınamaz!' },
        { status: 400 }
      );
    }

    // Kitabı ödünç alınmış olarak işaretle
    await prisma.book.update({
      where: { id: params.id },
      data: { status: 'BORROWED' },
    });

    // Ödünç alma kaydını oluştur
    await prisma.borrowedBook.create({
      data: {
        userId: session.user.id,
        bookId: params.id,
      },
    });

    return NextResponse.json({ message: 'Kitap başarıyla ödünç alındı!' });
  } catch (error) {
    console.error('Kitap ödünç alınırken hata:', error);
    return NextResponse.json(
      { message: 'Kitap ödünç alınırken bir hata oluştu!' },
      { status: 500 }
    );
  }
} 