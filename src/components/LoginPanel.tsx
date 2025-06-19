"use client";

import Link from "next/link";

export default function LoginPanel() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-12 px-8 flex flex-col space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-serif text-[#2C3E2D] mb-4 tracking-tight">
          Mini Kütüphane Takip Sistemi
        </h1>
        <p className="text-lg text-[#4A6741] mb-8">
          Kitaplarınızı yönetin, üyelerinizle iletişim kurun
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
          >
            <span>Giriş Yap</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </Link>
          <Link 
            href="/register"
            className="flex-1 flex items-center justify-center gap-2 bg-[#4A6741] hover:bg-[#5B7A4F] text-white py-3 px-6 rounded-xl text-sm font-medium transition duration-300"
          >
            <span>Kayıt Ol</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {/* Kitap Yönetimi */}
        <div className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-[#8B4513]/10 rounded-xl mb-4">
              <svg className="w-12 h-12 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Kitap Yönetimi</h3>
            <p className="text-sm text-[#4A6741]">Kitapları kolayca ekleyin, düzenleyin ve takip edin</p>
          </div>
        </div>

        {/* Üye Yönetimi */}
        <div className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-[#8B4513]/10 rounded-xl mb-4">
              <svg className="w-12 h-12 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Üye Yönetimi</h3>
            <p className="text-sm text-[#4A6741]">Üyeleri yönetin ve kitap ödünç alma işlemlerini takip edin</p>
          </div>
        </div>

        {/* Mesajlaşma */}
        <div className="bg-[#F5F1E8]/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-[#8B4513]/10 rounded-xl mb-4">
              <svg className="w-12 h-12 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Mesajlaşma</h3>
            <p className="text-sm text-[#4A6741]">Üyelerle iletişim kurun ve kitap paylaşımlarını yönetin</p>
          </div>
        </div>
      </div>
    </div>
  );
} 