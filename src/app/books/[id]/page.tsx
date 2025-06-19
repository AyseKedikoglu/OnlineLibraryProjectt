"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

export default function BookDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [book, setBook] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Kitap detayları yüklenirken hata:', error);
        setIsLoading(false);
      });
  }, [id]);

  const handleBorrow = async () => {
    setMessage('');
    const res = await fetch(`/api/books/${id}/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session?.user?.id }),
    });
    if (res.ok) {
      setMessage('Kitap başarıyla ödünç alındı!');
      setBook({ ...book, status: 'BORROWED' });
    } else {
      const data = await res.json();
      setMessage(data.error || 'İşlem başarısız!');
    }
  };

  const handleReturn = async () => {
    setMessage('');
    const res = await fetch(`/api/books/${id}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session?.user?.id }),
    });
    if (res.ok) {
      setMessage('Kitap başarıyla iade edildi!');
      setBook({ ...book, status: 'AVAILABLE' });
    } else {
      const data = await res.json();
      setMessage(data.error || 'İşlem başarısız!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
          <p className="text-[#4A6741]">Kitap bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#2C3E2D] mb-2">{book.title}</h1>
          <p className="text-[#4A6741]">Kitap detayları</p>
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

        <div className="bg-[#F5F1E8]/80 backdrop-blur-sm p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#2C3E2D] font-medium">Yazar:</span>
            <span className="text-[#4A6741]">{book.author}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[#2C3E2D] font-medium">Kategori:</span>
            <span className="text-[#4A6741]">{book.category}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#2C3E2D] font-medium">Durum:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              book.status === 'AVAILABLE' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {book.status === 'AVAILABLE' ? 'Paylaşıma Hazır' : 'Ödünç Alındı'}
            </span>
          </div>

          <div className="mt-6">
            <span className="text-[#2C3E2D] font-medium block mb-2">Açıklama:</span>
            <p className="text-[#4A6741] bg-white/50 p-4 rounded-xl">
              {book.description}
            </p>
          </div>
        </div>

        {session?.user && (
          <div className="flex gap-4 justify-center mt-8">
            {book.status === 'AVAILABLE' ? (
              <button
                onClick={handleBorrow}
                className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Ödünç Al</span>
              </button>
            ) : (
              <button
                onClick={handleReturn}
                className="flex items-center gap-2 bg-[#4A6741] hover:bg-[#5B7A4F] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>İade Et</span>
              </button>
            )}
            <button
              onClick={() => router.push('/books')}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kitaplara Dön</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 