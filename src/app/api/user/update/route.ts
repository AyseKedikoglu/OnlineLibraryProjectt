import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { hash, compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Ad Soyad ve E-posta alanları zorunludur' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor' },
        { status: 400 }
      );
    }

    // If password change is requested
    if (currentPassword && newPassword) {
      // Get current user with password
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user?.password) {
        return NextResponse.json(
          { message: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      // Verify current password
      const isValid = await compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { message: 'Mevcut şifre yanlış' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, 12);

      // Update user with new password
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    } else {
      // Update user without changing password
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name,
          email,
        },
      });
    }

    return NextResponse.json(
      { message: 'Profil başarıyla güncellendi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 