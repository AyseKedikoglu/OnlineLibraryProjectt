import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('API - Mevcut oturum:', session); // Debug log

    if (!session) {
      return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        books: {
          select: {
            id: true
          }
        }
      }
    });

    console.log('API - Tüm kullanıcılar:', users); // Debug log
    return NextResponse.json(users);
  } catch (error) {
    console.error('API - Kullanıcılar alınırken hata:', error);
    return NextResponse.json({ error: 'Kullanıcılar alınamadı.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Kullanıcı id gerekli.' }, { status: 400 });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı silinemedi.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, role } = await req.json();
    if (!id || !role) return NextResponse.json({ error: 'id ve role gerekli.' }, { status: 400 });
    const user = await prisma.user.update({ where: { id }, data: { role } });
    return NextResponse.json({ id: user.id, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: 'Rol güncellenemedi.' }, { status: 500 });
  }
} 