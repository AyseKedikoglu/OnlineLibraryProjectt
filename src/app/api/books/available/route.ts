import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor!' },
        { status: 401 }
      );
    }

    const books = await prisma.book.findMany({
      where: {
        status: 'AVAILABLE',
        userId: {
          not: session.user.id
        }
      } as Prisma.BookWhereInput,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Kitaplar getirilirken hata:', error);
    return NextResponse.json(
      { message: 'Kitaplar getirilirken bir hata oluştu!' },
      { status: 500 }
    );
  }
} 