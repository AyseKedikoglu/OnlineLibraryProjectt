"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogsPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchLogs();
    // eslint-disable-next-line
  }, [session, status]);

  const fetchLogs = async () => {
    const res = await fetch('/api/logs');
    const data = await res.json();
    setLogs(data);
  };

  if (status === 'loading') return <div>Yükleniyor...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Sistem Logları</h2>
            <p className="text-[#4A6741]">Sistem aktivitelerini takip edin</p>
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

        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="bg-[#F5F1E8]/80 backdrop-blur-sm p-4 rounded-xl">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-bold text-[#2C3E2D]">{log.user.name}</span>
                  <span className="mx-2 text-[#4A6741]">-</span>
                  <span className="text-[#4A6741]">{log.action}</span>
                </div>
                <div className="text-[#4A6741]/70 text-sm">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 