import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('API - Mesajlar için oturum:', session); // Debug log

    if (!session) {
      return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId');
    
    console.log('API - Mesaj isteği parametreleri:', { userId, otherUserId }); // Debug log

    if (!userId || !otherUserId) {
      return NextResponse.json({ error: 'Kullanıcı id\'leri gerekli.' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { fromUserId: userId },
              { toUserId: otherUserId }
            ]
          },
          {
            AND: [
              { fromUserId: otherUserId },
              { toUserId: userId }
            ]
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        fromUser: {
          select: {
            name: true
          }
        },
        toUser: {
          select: {
            name: true
          }
        }
      }
    });

    console.log('API - Bulunan mesajlar:', messages); // Debug log
    return NextResponse.json(messages);
  } catch (error) {
    console.error('API - Mesajlar alınırken hata:', error);
    return NextResponse.json({ error: 'Mesajlar alınamadı.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('API - Mesaj gönderme için oturum:', session); // Debug log

    if (!session) {
      return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
    }

    const { fromUserId, toUserId, content } = await req.json();
    console.log('API - Mesaj gönderme isteği:', { fromUserId, toUserId, content }); // Debug log

    if (!fromUserId || !toUserId || !content) {
      return NextResponse.json({ error: 'Tüm alanlar zorunlu.' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        fromUserId,
        toUserId
      },
      include: {
        fromUser: {
          select: {
            name: true
          }
        },
        toUser: {
          select: {
            name: true
          }
        }
      }
    });

    console.log('API - Oluşturulan mesaj:', message); // Debug log
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('API - Mesaj gönderilirken hata:', error);
    return NextResponse.json({ error: 'Mesaj gönderilemedi.' }, { status: 500 });
  }
} 