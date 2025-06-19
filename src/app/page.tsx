"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Book, MessageSquare, User, LogOut } from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4">
        <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-12 px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif text-[#2C3E2D] mb-4 tracking-tight">
              Kitap Paylaşım Sistemi
            </h1>
            <p className="text-xl text-[#4A6741] mb-8">
              Kitaplarınızı kolayca yönetin ve paylaşın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Kitap İkonu */}
            <div className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-[#8B4513]/10 rounded-xl mb-4">
                  <svg className="w-16 h-16 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Kitap Yönetimi</h3>
                <p className="text-sm text-[#4A6741]">Kitaplarınızı kolayca ekleyin ve takip edin</p>
              </div>
            </div>

            {/* Kullanıcı İkonu */}
            <div className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-[#8B4513]/10 rounded-xl mb-4">
                  <svg className="w-16 h-16 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Üye Etkileşimi</h3>
                <p className="text-sm text-[#4A6741]">Üyelerle iletişim kurun ve kitap paylaşın</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <Button className="flex-1 flex items-center justify-center gap-2 bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 px-8 rounded-xl text-lg font-medium transition duration-300">
                <span>Giriş Yap</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741] hover:text-white py-3 px-8 rounded-xl text-lg font-medium transition duration-300">
                <span>Kayıt Ol</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-12 px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[#2C3E2D] mb-4">
            Hoş Geldiniz, {session.user.name}!
          </h1>
          <p className="text-xl text-[#4A6741]">
            Mini Kütüphane Takip Sistemine hoş geldiniz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kitaplarım */}
          <Link
            href="/books"
            className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#8B4513]/10 rounded-xl">
                <Book className="w-8 h-8 text-[#8B4513]" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Kitaplarım</h3>
                <p className="text-sm text-[#4A6741]">Kitaplarınızı yönetin ve takip edin</p>
              </div>
            </div>
          </Link>

          {/* Mesajlar */}
          <Link
            href="/messages"
            className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#4A6741]/10 rounded-xl">
                <MessageSquare className="w-8 h-8 text-[#4A6741]" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Mesajlar</h3>
                <p className="text-sm text-[#4A6741]">Üyelerle iletişim kurun</p>
              </div>
            </div>
          </Link>

          {/* Profil */}
          <Link
            href="/profile"
            className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#8B4513]/10 rounded-xl">
                <User className="w-8 h-8 text-[#8B4513]" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Profil</h3>
                <p className="text-sm text-[#4A6741]">Profil bilgilerinizi düzenleyin</p>
              </div>
            </div>
          </Link>

          {/* Admin Paneli (Sadece admin kullanıcılar için) */}
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#4A6741]/10 rounded-xl">
                  <User className="w-8 h-8 text-[#4A6741]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Admin Paneli</h3>
                  <p className="text-sm text-[#4A6741]">Sistem yönetimi</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="outline"
            className="text-[#8B4513] hover:text-[#A0522D] border-[#8B4513] hover:border-[#A0522D]"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  );
}
