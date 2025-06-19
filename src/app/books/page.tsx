"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: 'AVAILABLE' | 'BORROWED';
  borrowedBy?: string;
}

export default function BooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
  
    if (status === 'authenticated') {
      fetchBooks();
    }
  }, [status]);
  

  const fetchBooks = async () => {
    try {
      const [sharedRes, borrowedRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/books/borrowed')
      ]);
      
      if (!sharedRes.ok || !borrowedRes.ok) {
        throw new Error('Kitaplar yüklenirken bir hata oluştu');
      }

      const sharedData = await sharedRes.json();
      const borrowedData = await borrowedRes.json();
      
      // Verilerin dizi olduğundan emin oluyoruz
      setBooks(Array.isArray(sharedData) ? sharedData : []);
      setBorrowedBooks(Array.isArray(borrowedData) ? borrowedData : []);
    } catch (error) {
      console.error('Kitaplar yüklenirken hata oluştu:', error);
      setBooks([]);
      setBorrowedBooks([]);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Kitaplar</h2>
            <p className="text-[#4A6741]">Tüm kitapları keşfedin</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#A0522D] text-white py-2 px-4 rounded-xl text-sm font-medium transition duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Ana Sayfaya Dön</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Paylaşılan Kitaplar */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-serif text-[#2C3E2D] mb-4">Paylaşılan Kitaplar</h3>
            {books.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#4A6741] mb-4">Henüz kitap eklenmemiş. Eklemek için + butonuna tıklayın.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {books.map((book) => (
                  <div key={book.id} className="bg-[#F5F1E8]/80 backdrop-blur-sm p-4 rounded-xl">
                    <h4 className="text-lg font-medium text-[#2C3E2D] mb-2">{book.title}</h4>
                    <p className="text-[#4A6741] mb-2">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        book.status === 'AVAILABLE' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {book.status === 'AVAILABLE' ? 'Paylaşıma Hazır' : 'Ödünç Alındı'}
                      </span>
                      <button
                        onClick={() => router.push(`/books/${book.id}`)}
                        className="text-[#8B4513] hover:text-[#A0522D] transition-colors"
                      >
                        Detaylar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ödünç Alınan Kitaplar */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-serif text-[#2C3E2D] mb-4">Ödünç Alınan Kitaplar</h3>
            {borrowedBooks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#4A6741] mb-4">Henüz ödünç alınan kitap bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {borrowedBooks.map((book) => (
                  <div key={book.id} className="bg-[#F5F1E8]/80 backdrop-blur-sm p-4 rounded-xl">
                    <h4 className="text-lg font-medium text-[#2C3E2D] mb-2">{book.title}</h4>
                    <p className="text-[#4A6741] mb-2">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
                        Ödünç Alındı
                      </span>
                      <button
                        onClick={() => router.push(`/books/${book.id}`)}
                        className="text-[#8B4513] hover:text-[#A0522D] transition-colors"
                      >
                        Detaylar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/books/add"
            className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Kitap Ekle</span>
          </Link>
          <Link
            href="/books/borrow"
            className="flex items-center gap-2 bg-[#4A6741] hover:bg-[#5B7A4F] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Kitap Ödünç Al</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 