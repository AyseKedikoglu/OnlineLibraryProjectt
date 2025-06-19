"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/login');
      return;
    }
    // Set initial form data
    setFormData(prev => ({
      ...prev,
      name: session.user.name || '',
      email: session.user.email || '',
    }));
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Profil başarıyla güncellendi!');
        setIsEditing(false);
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        setMessage(data.message || 'Bir hata oluştu!');
      }
    } catch (error) {
      setMessage('Bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Profil</h2>
            <p className="text-[#4A6741]">Profil bilgilerinizi yönetin</p>
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
            <label htmlFor="name" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
            />
          </div>

          {isEditing && (
            <>
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-[#2C3E2D] mb-2">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-[#2C3E2D] mb-2">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2C3E2D] mb-2">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F1E8] border border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 outline-none transition-colors"
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
              >
                Düzenle
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    }));
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
                >
                  İptal
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 