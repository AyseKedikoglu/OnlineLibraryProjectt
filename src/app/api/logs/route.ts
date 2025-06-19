import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const where = userId ? { userId } : {};
    const logs = await prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Loglar alınamadı.' }, { status: 500 });
  }
} 