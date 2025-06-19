import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: params.id },
      include: { fromUser: { select: { name: true } }, toUser: { select: { name: true } } },
    });
    if (!message) return NextResponse.json({ error: 'Mesaj bulunamadı.' }, { status: 404 });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
} 