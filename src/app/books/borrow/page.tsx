"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  status: string;
}

export default function BorrowBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchBooks();
  }, [session, status, router]);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books/available');
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Kitaplar getirilirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}/borrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      if (res.ok) {
        setMessage('Kitap başarıyla ödünç alındı!');
        // Kitabı listeden kaldır
        setBooks(books.filter(book => book.id !== bookId));
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Kitap ödünç alınırken bir hata oluştu!');
      }
    } catch (error) {
      setMessage('Bir hata oluştu!');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-serif text-[#2C3E2D]">Ödünç Alınabilir Kitaplar</h1>
          <button
            onClick={() => router.push('/books')}
            className="bg-[#8B4513] hover:bg-[#A0522D] text-white py-2 px-4 rounded-xl text-sm font-medium transition duration-300"
          >
            Kitaplarıma Dön
          </button>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl ${
            message.includes('başarıyla') 
              ? 'bg-green-50 text-green-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

        {books.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl">
            <p className="text-[#4A6741]">Şu anda ödünç alınabilir kitap bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-[#2C3E2D] mb-2">{book.title}</h3>
                <p className="text-[#4A6741] mb-1">Yazar: {book.author}</p>
                <p className="text-[#4A6741] mb-4">Kategori: {book.category}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
                <button
                  onClick={() => handleBorrow(book.id)}
                  className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white py-2 px-4 rounded-xl text-sm font-medium transition duration-300"
                >
                  Ödünç Al
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 