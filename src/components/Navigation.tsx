"use client";
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Mini Kütüphane
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/books" className="hover:text-gray-300">
                Kitaplar
              </Link>
              <Link href="/messages" className="hover:text-gray-300">
                Mesajlar
              </Link>
              <Link href="/profile" className="hover:text-gray-300">
                Profil
              </Link>
              {session.user?.role === 'ADMIN' && (
                <>
                  <Link href="/admin" className="hover:text-gray-300">
                    Kullanıcılar
                  </Link>
                  <Link href="/admin/books" className="hover:text-gray-300">
                    Kitap Yönetimi
                  </Link>
                  <Link href="/admin/logs" className="hover:text-gray-300">
                    Loglar
                  </Link>
                </>
              )}
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="hover:text-gray-300">
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Giriş
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Kayıt
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 