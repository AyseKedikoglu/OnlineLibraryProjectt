import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Kullanıcı id gerekli.' }, { status: 400 });
    const book = await prisma.book.findUnique({ where: { id: params.id } });
    if (!book || book.status !== 'BORROWED') {
      return NextResponse.json({ error: 'Kitap zaten ödünçte değil.' }, { status: 400 });
    }
    await prisma.book.update({ where: { id: params.id }, data: { status: 'AVAILABLE' } });
    await prisma.borrowedBook.updateMany({
      where: { bookId: params.id, userId, returnDate: null },
      data: { returnDate: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'İade işlemi başarısız.' }, { status: 500 });
  }
} 