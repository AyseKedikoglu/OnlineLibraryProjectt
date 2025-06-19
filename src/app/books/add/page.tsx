"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddBookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Kitap başarıyla eklendi!');
        setFormData({ title: '', author: '', category: '', description: '' });
        setTimeout(() => {
          router.push('/books');
        }, 1500);
      } else {
        setMessage(data.message || 'Kitap eklenirken bir hata oluştu!');
      }
    } catch (error) {
      setMessage('Bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Yeni Kitap Ekle</h2>
          <p className="text-[#4A6741]">Kütüphanenize yeni bir kitap ekleyin</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              Kitap Adı
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              Yazar
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              Kategori
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              Açıklama
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Ekleniyor...' : 'Kitap Ekle'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/books')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 