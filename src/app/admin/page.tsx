"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        console.log("Kullanıcılar yükleniyor...");
        const response = await fetch("/api/users");
        console.log("API yanıtı:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API hatası:", errorText);
          throw new Error("Kullanıcılar yüklenirken bir hata oluştu");
        }
        
        const data = await response.json();
        console.log("Alınan kullanıcılar:", data);
        setUsers(data);
      } catch (err) {
        console.error("Hata detayı:", err);
        setError("Kullanıcılar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Admin Paneli</h2>
            <p className="text-[#4A6741]">Kullanıcıları ve kitapları yönetin</p>
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

        <div className="grid gap-6">
          {users.length === 0 ? (
            <div className="text-center text-[#4A6741] py-8">
              Henüz kayıtlı kullanıcı bulunmuyor.
            </div>
          ) : (
            users.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="bg-[#F5F1E8]/80 backdrop-blur-sm p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">{user.name}</h3>
                    <p className="text-sm text-[#4A6741]">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.role === "ADMIN" 
                        ? "bg-[#8B4513]/10 text-[#8B4513]" 
                        : "bg-[#4A6741]/10 text-[#4A6741]"
                    }`}>
                      {user.role === "ADMIN" ? "Yönetici" : "Üye"}
                    </span>
                    <svg className="w-5 h-5 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 