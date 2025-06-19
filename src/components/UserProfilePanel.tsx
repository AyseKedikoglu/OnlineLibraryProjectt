"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserProfilePanel() {
  const { data: session } = useSession();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-12 px-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#2C3E2D] mb-4">
            Hoş Geldiniz, {session?.user?.name}!
          </h1>
          <p className="text-lg text-[#4A6741]">
            Mini Kütüphane Takip Sistemine hoş geldiniz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Kitaplarım */}
          <Link
            href="/books"
            className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#8B4513]/10 rounded-xl">
                <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Kitaplarım</h3>
                <p className="text-sm text-[#4A6741]">Kitaplarınızı yönetin ve takip edin</p>
              </div>
            </div>
          </Link>

          {/* Kitap Ödünç Al */}
          <Link
            href="/books/borrow"
            className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#4A6741]/10 rounded-xl">
                <svg className="w-8 h-8 text-[#4A6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Kitap Ödünç Al</h3>
                <p className="text-sm text-[#4A6741]">Diğer üyelerin kitaplarını ödünç alın</p>
              </div>
            </div>
          </Link>

          {/* Mesajlar */}
          <Link
            href="/messages"
            className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#8B4513]/10 rounded-xl">
                <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Mesajlar</h3>
                <p className="text-sm text-[#4A6741]">Üyelerle iletişim kurun ve mesajlarınızı yönetin</p>
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
                <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Profil</h3>
                <p className="text-sm text-[#4A6741]">Profil bilgilerinizi düzenleyin</p>
              </div>
            </div>
          </Link>

          {/* Admin Paneli (Sadece admin kullanıcılar için) */}
          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300 md:col-span-2"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#8B4513]/10 rounded-xl">
                  <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Admin Paneli</h3>
                  <p className="text-sm text-[#4A6741]">Sistem yönetimi ve kullanıcı işlemleri</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-8 flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D] transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
} 