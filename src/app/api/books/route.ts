import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
        userId: session.user.id
      } as Prisma.BookWhereInput,
      orderBy: {
        createdAt: 'desc',
      },
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor!' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı!' },
        { status: 404 }
      );
    }

    const { title, author, category, description } = await request.json();

    if (!title || !author || !category || !description) {
      return NextResponse.json(
        { message: 'Tüm alanları doldurun!' },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        category,
        description,
        status: 'AVAILABLE',
        userId: user.id
      } as Prisma.BookUncheckedCreateInput,
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Kitap eklenirken hata:', error);
    return NextResponse.json(
      { message: 'Kitap eklenirken bir hata oluştu!' },
      { status: 500 }
    );
  }
} 