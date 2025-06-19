"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="text-center flex-1">
        <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Kitap Paylaşım Platformu</h2>
        <p className="text-[#4A6741]">Kitaplarınızı paylaşın ve keşfedin</p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#A0522D] text-white py-2 px-4 rounded-xl text-sm font-medium transition duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Ana Sayfaya Dön</span>
        </Button>
        {session && (
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Çıkış Yap</span>
          </Button>
        )}
      </div>
    </div>
  );
} 