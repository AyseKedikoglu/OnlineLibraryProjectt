import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();
    
    console.log('Kayıt isteği alındı:', { name, email, role });

    if (!name || !email || !password) {
      console.log('Eksik bilgi:', { name, email, password });
      return NextResponse.json(
        { message: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Geçersiz e-posta formatı:', email);
      return NextResponse.json(
        { message: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log('E-posta zaten kullanımda:', email);
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Şifre hashleniyor...');

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
    });

    console.log('Kullanıcı oluşturuldu:', user.id);

    return NextResponse.json(
      { message: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
} 