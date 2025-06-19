import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor!' },
        { status: 401 }
      );
    }

    const borrowedBooks = await prisma.borrowedBook.findMany({
      where: {
        userId: session.user.id,
        returnDate: null // Sadece iade edilmemiş kitapları getir
      },
      include: {
        book: true // Kitap detaylarını da getir
      },
      orderBy: {
        borrowDate: 'desc'
      }
    });

    // Kitap detaylarını düzenle
    const formattedBooks = borrowedBooks.map(borrowed => ({
      id: borrowed.book.id,
      title: borrowed.book.title,
      author: borrowed.book.author,
      category: borrowed.book.category,
      description: borrowed.book.description,
      status: 'BORROWED',
      borrowDate: borrowed.borrowDate
    }));

    return NextResponse.json(formattedBooks);
  } catch (error) {
    console.error('Ödünç alınan kitaplar getirilirken hata:', error);
    return NextResponse.json(
      { message: 'Ödünç alınan kitaplar getirilirken bir hata oluştu!' },
      { status: 500 }
    );
  }
} 