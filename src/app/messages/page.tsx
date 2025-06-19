"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';

interface Message {
  id: string;
  content: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
  fromUser: {
    name: string | null;
  };
  toUser: {
    name: string | null;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  books: {
    id: string;
  }[];
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }

    fetchUsers();
  }, [session, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUsers();
    }
  }, [session]);

  // Mesajları otomatik yenileme
  useEffect(() => {
    if (selectedUser) {
      console.log('Seçili kullanıcı değişti:', selectedUser); // Debug log
      fetchMessages();
      // Her 5 saniyede bir mesajları yenile
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Kullanıcılar alınamadı');
      }
      const data = await res.json();
      
      // Sadece kullanıcının kendisini filtrele, diğer tüm kullanıcıları göster
      const filteredUsers = data.filter((user: User) => user.id !== session?.user?.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setUsers([]);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser || !session?.user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Mesajlar alınıyor:', { userId: session.user.id, otherUserId: selectedUser }); // Debug log
      const response = await fetch(`/api/messages?userId=${session.user.id}&otherUserId=${selectedUser}`);
      
      if (!response.ok) {
        throw new Error('Mesajlar alınamadı');
      }

      const data = await response.json();
      console.log('Alınan mesajlar:', data); // Debug log
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Mesajlar yüklenirken bir hata oluştu');
      toast.error('Mesajlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user?.id || !selectedUser) return;

    // Kullanıcının kendisine mesaj göndermesini engelle
    if (selectedUser === session.user.id) {
      toast.error('Kendinize mesaj gönderemezsiniz');
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          fromUserId: session.user.id,
          toUserId: selectedUser,
        }),
      });

      if (!response.ok) {
        throw new Error('Mesaj gönderilemedi');
      }

      const data = await response.json();
      setMessages((prev) => [data, ...prev]);
      setNewMessage('');
      toast.success('Mesaj başarıyla gönderildi');
      
      // Mesaj gönderildikten sonra mesajları yenile
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj gönderilirken bir hata oluştu');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-8">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl py-8 px-6">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Kullanıcı Listesi */}
          <Card className="md:col-span-1 bg-[#F5F1E8]/80 backdrop-blur-sm">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-[#2C3E2D]">Kullanıcılar</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#4A6741]" />
                <Input
                  placeholder="Kullanıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-white/50 border-[#E8E4DB] focus:ring-[#8B4513]"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-[#8B4513]/10 transition-colors ${
                        selectedUser === user.id ? 'bg-[#8B4513]/10' : ''
                      }`}
                    >
                      <div className="font-medium text-[#2C3E2D]">{user.name}</div>
                      <div className="text-sm text-[#4A6741]">{user.email}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Mesajlaşma Alanı */}
          <Card className="md:col-span-3 bg-[#F5F1E8]/80 backdrop-blur-sm">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-[#2C3E2D]">
                {selectedUser
                  ? `Mesajlar - ${users.find(u => u.id === selectedUser)?.name}`
                  : 'Mesajlar'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <>
                  <form onSubmit={handleSendMessage} className="mb-4 flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 bg-white/50 border-[#E8E4DB] focus:ring-[#8B4513]"
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
                    >
                      Gönder
                    </Button>
                  </form>

                  {error && (
                    <div className="text-red-500 mb-4 text-center">{error}</div>
                  )}

                  {loading ? (
                    <div className="text-center text-[#4A6741]">Yükleniyor...</div>
                  ) : (
                    <ScrollArea className="h-[500px] rounded-md border bg-white/50 p-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-[#4A6741]">
                          Henüz mesaj bulunmuyor
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`p-3 rounded-lg ${
                                message.fromUserId === session.user.id
                                  ? 'bg-[#8B4513]/10 ml-auto'
                                  : 'bg-white/80'
                              } max-w-[80%] shadow-sm`}
                            >
                              <div className="font-semibold text-[#2C3E2D]">
                                {message.fromUserId === session.user.id
                                  ? 'Siz'
                                  : message.fromUser.name || 'Bilinmeyen Kullanıcı'}
                              </div>
                              <div className="text-[#4A6741]">{message.content}</div>
                              <div className="text-xs text-[#4A6741]/70 mt-1">
                                {new Date(message.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </>
              ) : (
                <div className="text-center text-[#4A6741] h-[500px] flex items-center justify-center bg-white/50 rounded-lg">
                  Mesajlaşmak için bir kullanıcı seçin
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 