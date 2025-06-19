import { useRouter } from 'next/navigation';

const UsersPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-serif text-[#2C3E2D] mb-2">Kullanıcı Yönetimi</h2>
            <p className="text-[#4A6741]">Kullanıcıları yönetin</p>
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
      </div>
    </div>
  );
};

export default UsersPage; 