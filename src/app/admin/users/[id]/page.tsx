"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  borrowedAt?: string;
  returnedAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sharedBooks, setSharedBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Kullanıcı bilgilerini getir
        const userResponse = await fetch(`/api/users/${params.id}`);
        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(`Kullanıcı bilgileri yüklenirken bir hata oluştu: ${errorText}`);
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Kullanıcının paylaştığı kitapları getir
        const sharedResponse = await fetch(`/api/users/${params.id}/books`);
        if (!sharedResponse.ok) {
          const errorText = await sharedResponse.text();
          throw new Error(`Paylaşılan kitaplar yüklenirken bir hata oluştu: ${errorText}`);
        }
        const sharedData = await sharedResponse.json();
        setSharedBooks(sharedData);

        // Kullanıcının ödünç aldığı kitapları getir
        const borrowedResponse = await fetch(`/api/users/${params.id}/borrowed`);
        if (!borrowedResponse.ok) {
          const errorText = await borrowedResponse.text();
          throw new Error(`Ödünç alınan kitaplar yüklenirken bir hata oluştu: ${errorText}`);
        }
        const borrowedData = await borrowedResponse.json();
        setBorrowedBooks(borrowedData);
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
        setError(err instanceof Error ? err.message : "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, router, params.id]);

  const handleRoleChange = async (newRole: string) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Rol güncellenirken bir hata oluştu");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err) {
      console.error("Rol güncelleme hatası:", err);
      setError(err instanceof Error ? err.message : "Rol güncellenirken bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Kullanıcı silinirken bir hata oluştu");
      }

      router.push("/admin");
    } catch (err) {
      console.error("Kullanıcı silme hatası:", err);
      setError(err instanceof Error ? err.message : "Kullanıcı silinirken bir hata oluştu");
      setIsDeleting(false);
    }
  };

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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || "Kullanıcı bulunamadı"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif text-[#2C3E2D] mb-2">{user.name}</h1>
              <p className="text-[#4A6741]">{user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              {session?.user?.id === user.id ? (
                <div className="flex items-center gap-2 text-[#8B4513]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">Admin</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    disabled={isUpdating}
                    className="bg-white border border-[#8B4513] text-[#8B4513] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  >
                    <option value="USER">Kullanıcı</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
                  >
                    {isDeleting ? "Siliniyor..." : "Kullanıcıyı Sil"}
                  </button>
                </div>
              )}
              <Link
                href="/admin"
                className="flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D] transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Geri Dön</span>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Paylaşılan Kitaplar */}
            <div>
              <h2 className="text-2xl font-serif text-[#2C3E2D] mb-4">Paylaşılan Kitaplar</h2>
              <div className="space-y-4">
                {sharedBooks.length > 0 ? (
                  sharedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-[#F5F1E8]/80 backdrop-blur-sm p-4 rounded-xl"
                    >
                      <h3 className="text-lg font-serif text-[#2C3E2D] mb-2">{book.title}</h3>
                      <p className="text-sm text-[#4A6741] mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-[#4A6741]/10 text-[#4A6741]">
                          {book.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          book.status === "AVAILABLE"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {book.status === "AVAILABLE" ? "Müsait" : "Ödünç Verildi"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#4A6741]">Paylaşılan kitap bulunmuyor</p>
                )}
              </div>
            </div>

            {/* Ödünç Alınan Kitaplar */}
            <div>
              <h2 className="text-2xl font-serif text-[#2C3E2D] mb-4">Ödünç Alınan Kitaplar</h2>
              <div className="space-y-4">
                {borrowedBooks.length > 0 ? (
                  borrowedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-[#F5F1E8]/80 backdrop-blur-sm p-4 rounded-xl"
                    >
                      <h3 className="text-lg font-serif text-[#2C3E2D] mb-2">{book.title}</h3>
                      <p className="text-sm text-[#4A6741] mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-[#4A6741]/10 text-[#4A6741]">
                          {book.category}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {book.returnedAt ? "İade Edildi" : "Ödünç Alındı"}
                        </span>
                      </div>
                      {book.borrowedAt && (
                        <p className="text-xs text-[#4A6741] mt-2">
                          Alınma Tarihi: {new Date(book.borrowedAt).toLocaleDateString("tr-TR")}
                        </p>
                      )}
                      {book.returnedAt && (
                        <p className="text-xs text-[#4A6741]">
                          İade Tarihi: {new Date(book.returnedAt).toLocaleDateString("tr-TR")}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-[#4A6741]">Ödünç alınan kitap bulunmuyor</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 