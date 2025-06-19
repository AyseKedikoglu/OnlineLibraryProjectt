import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const borrowedBooks = await prisma.borrowedBook.findMany({
      where: {
        userId: params.id,
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            category: true,
          },
        },
      },
      orderBy: {
        borrowDate: "desc",
      },
    });

    const formattedBooks = borrowedBooks.map((borrowed) => ({
      id: borrowed.book.id,
      title: borrowed.book.title,
      author: borrowed.book.author,
      category: borrowed.book.category,
      borrowedAt: borrowed.borrowDate,
      returnedAt: borrowed.returnDate,
    }));

    return NextResponse.json(formattedBooks);
  } catch (error) {
    console.error("[USER_BORROWED_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 