"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Geçersiz email veya şifre');
        return;
      }

      if (result?.ok) {
        toast.success('Giriş başarılı!');
        router.push('/');
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Giriş Yap</h2>
          <p className="text-[#4A6741]">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-[#4A6741] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2C3E2D] mb-2">
              Şifre
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-[#4A6741] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4A6741] hover:bg-[#5B7A4F] text-white py-2 rounded-xl text-lg font-medium transition duration-300"
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#4A6741]">
            Hesabınız yok mu?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-[#8B4513] hover:text-[#A0522D] font-medium"
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 