import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Kitap bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Kitap detayı alınırken hata:', error);
    return NextResponse.json(
      { error: 'Kitap detayı alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { title, author, category, description, status } = await req.json();
    const data: any = {};
    
    if (title) data.title = title;
    if (author) data.author = author;
    if (category) data.category = category;
    if (description) data.description = description;
    if (status) data.status = status;

    const book = await prisma.book.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Kitap güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Kitap güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    await prisma.book.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kitap silinirken hata:', error);
    return NextResponse.json(
      { error: 'Kitap silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 