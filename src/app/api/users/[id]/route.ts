import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, email, password, role } = await req.json();
    const data: any = {};
    
    // Admin kullanıcı kendi rolünü değiştiremez
    if (role && session.user.id === params.id) {
      return new NextResponse("Cannot change your own role", { status: 400 });
    }
    
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);
    if (role) data.role = role;

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        createdAt: true 
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Kullanıcının kendisini silmesini engelle
    if (session.user.id === params.id) {
      return new NextResponse("Cannot delete yourself", { status: 400 });
    }

    // Önce kullanıcının var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        borrowedBooks: {
          include: {
            book: true
          }
        },
        books: {
          include: {
            borrowedBooks: true
          }
        },
        sentMessages: true, // ✅ doğru ilişki adı
        receivedMessages: true, // ✅ doğru ilişki adı
        logs: true,
        profile: true
      }
    });
    

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    try {
      // Önce kitapların ilişkili verilerini sil
      for (const book of user.books) {
        // Kitabın ödünç kayıtlarını sil
        if (book.borrowedBooks.length > 0) {
          await prisma.borrowedBook.deleteMany({
            where: { bookId: book.id }
          });
        }
      }

      // Kullanıcının ödünç aldığı kitapları sil
      if (user.borrowedBooks.length > 0) {
        await prisma.borrowedBook.deleteMany({
          where: { userId: params.id }
        });
      }

      // Kullanıcının paylaştığı kitapları sil
      if (user.books.length > 0) {
        await prisma.book.deleteMany({
          where: { userId: params.id }
        });
      }

      // Kullanıcının mesajlarını sil
      await prisma.message.deleteMany({
        where: {
          OR: [
            { fromUserId: params.id },
            { toUserId: params.id }
          ]
        }
      });
      

      // Kullanıcının loglarını sil
      if (user.logs.length > 0) {
        await prisma.log.deleteMany({
          where: { userId: params.id }
        });
      }

      // Kullanıcının profilini sil
      if (user.profile) {
        await prisma.profile.delete({
          where: { userId: params.id }
        });
      }

      // Son olarak kullanıcıyı sil
      await prisma.user.delete({
        where: { id: params.id }
      });

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Silme işlemi hatası:", error);
      if (error instanceof Error) {
        console.error("Hata mesajı:", error.message);
        console.error("Hata stack:", error.stack);
      }
      return new NextResponse(
        "Kullanıcı silinirken ilişkili veriler silinemedi. Lütfen daha sonra tekrar deneyin.",
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse(
      "Kullanıcı silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      { status: 500 }
    );
  }
} 