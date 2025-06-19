"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminBooksPage() {
  const { data: session, status } = useSession();
  const [books, setBooks] = useState<any[]>([]);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchBooks();
    // eslint-disable-next-line
  }, [session, status]);

  const fetchBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const bookData = { title, author, category, description };
    const url = editingBook ? `/api/books/${editingBook.id}` : '/api/books';
    const method = editingBook ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
    });
    if (res.ok) {
      setMessage(editingBook ? 'Kitap güncellendi!' : 'Kitap eklendi!');
      setTitle('');
      setAuthor('');
      setCategory('');
      setDescription('');
      setEditingBook(null);
      fetchBooks();
    } else {
      setMessage('İşlem başarısız!');
    }
  };

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setDescription(book.description);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Kitap silinsin mi?')) return;
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage('Kitap silindi!');
      fetchBooks();
    } else {
      setMessage('Silme başarısız!');
    }
  };

  if (status === 'loading') return <div>Yükleniyor...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Kitap Yönetimi</h2>
            <p className="text-[#4A6741]">Tüm kitapları yönetin</p>
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
        {message && <div className="mb-2 text-blue-600">{message}</div>}
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
          <h2 className="font-bold mb-2">{editingBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Kitap Adı"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Yazar"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Kategori"
              value={category}
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kitap Yönetimi</h1>
      {message && <div className="mb-2 text-blue-600">{message}</div>}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <h2 className="font-bold mb-2">{editingBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Kitap Adı"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Yazar"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Kategori"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <textarea
            placeholder="Açıklama"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingBook ? 'Güncelle' : 'Ekle'}
          </button>
          {editingBook && (
            <button
              type="button"
              onClick={() => {
                setEditingBook(null);
                setTitle('');
                setAuthor('');
                setCategory('');
                setDescription('');
              }}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded"
            >
              İptal
            </button>
          )}
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="border rounded p-4">
            <h2 className="font-bold text-lg mb-1">{book.title}</h2>
            <div className="text-gray-700">Yazar: {book.author}</div>
            <div className="text-gray-500 text-sm">Kategori: {book.category}</div>
            <div className={book.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}>
              {book.status === 'AVAILABLE' ? 'Uygun' : 'Ödünçte'}
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleEdit(book)}
                className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 