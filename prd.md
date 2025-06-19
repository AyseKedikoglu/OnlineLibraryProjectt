# Mini Kütüphane Takip Sistemi - PRD (Product Requirements Document)

## 1. Proje Genel Bakış

### 1.1 Proje Amacı
Mini Kütüphane Takip Sistemi, küçük ölçekli kütüphaneler için kitap takibi, kullanıcı yönetimi ve mesajlaşma özelliklerini içeren web tabanlı bir yönetim sistemidir.

### 1.2 Teknoloji Yığını
- **Frontend Framework**: Next.js 14 (App Router)
- **Veritabanı**: SQLite
- **ORM**: Prisma
- **Stil**: Tailwind CSS
- **Kimlik Doğrulama**: NextAuth.js
- **Form Yönetimi**: React Hook Form
- **Validasyon**: Zod
- **UI Bileşenleri**: Shadcn/ui

## 2. Sistem Mimarisi

### 2.1 Klasör Yapısı
```
mini-kutuphane/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   └── user/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   └── shared/
├── lib/
│   ├── prisma.ts
│   └── auth.ts
├── prisma/
│   └── schema.prisma
└── public/
```

### 2.2 Veritabanı Şeması

```prisma
model User {
  id            String         @id @default(cuid())
  name          String
  email         String         @unique
  password      String
  role          Role          @default(USER)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  profile       Profile?
  borrowedBooks BorrowedBook[]
  sentMessages  Message[]     @relation("SentMessages")
  receivedMessages Message[]  @relation("ReceivedMessages")
  logs          Log[]
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  bio       String?
  updatedAt DateTime @updatedAt
}

model Book {
  id          String        @id @default(cuid())
  title       String
  author      String
  category    String
  description String
  status      BookStatus   @default(AVAILABLE)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  borrowedBy  BorrowedBook[]
}

model BorrowedBook {
  id         String   @id @default(cuid())
  userId     String
  bookId     String
  borrowDate DateTime @default(now())
  returnDate DateTime?
  user       User     @relation(fields: [userId], references: [id])
  book       Book     @relation(fields: [bookId], references: [id])
}

model Message {
  id          String   @id @default(cuid())
  content     String
  fromUserId  String
  toUserId    String
  createdAt   DateTime @default(now())
  fromUser    User     @relation("SentMessages", fields: [fromUserId], references: [id])
  toUser      User     @relation("ReceivedMessages", fields: [toUserId], references: [id])
}

model Log {
  id        String   @id @default(cuid())
  userId    String
  action    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

enum Role {
  ADMIN
  USER
}

enum BookStatus {
  AVAILABLE
  BORROWED
}
```

## 3. Özellikler ve Gereksinimler

### 3.1 Kimlik Doğrulama ve Yetkilendirme
- NextAuth.js ile JWT tabanlı kimlik doğrulama
- Oturum yönetimi ve güvenli çıkış
- Rol tabanlı erişim kontrolü (RBAC)
- Middleware ile sayfa koruması

### 3.2 Kullanıcı Yönetimi
- Kayıt formu (ad, e-posta, şifre)
- Giriş formu
- Profil sayfası ve düzenleme
- Şifre güncelleme
- Admin paneli üzerinden kullanıcı yönetimi

### 3.3 Kitap Yönetimi
- Kitap ekleme formu
- Kitap listeleme ve arama
- Kitap detay sayfası
- Ödünç alma/iade işlemleri
- Kitap durumu takibi

### 3.4 Mesajlaşma Sistemi
- Kullanıcılar arası mesajlaşma
- Mesaj listeleme ve okuma
- Mesaj gönderme formu
- Mesaj geçmişi

### 3.5 Admin Özellikleri
- Kullanıcı listesi ve yönetimi
- Kitap yönetimi
- Sistem logları görüntüleme
- Rol değiştirme yetkisi

## 4. API Rotaları

### 4.1 Kimlik Doğrulama
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### 4.2 Kullanıcı İşlemleri
- GET /api/users
- GET /api/users/[id]
- PUT /api/users/[id]
- DELETE /api/users/[id]
- PUT /api/users/[id]/role

### 4.3 Kitap İşlemleri
- GET /api/books
- POST /api/books
- GET /api/books/[id]
- PUT /api/books/[id]
- DELETE /api/books/[id]
- POST /api/books/[id]/borrow
- POST /api/books/[id]/return

### 4.4 Mesaj İşlemleri
- GET /api/messages
- POST /api/messages
- GET /api/messages/[id]

## 5. Güvenlik Gereksinimleri

### 5.1 Kimlik Doğrulama
- Güvenli şifre hashleme (bcrypt)
- JWT token yönetimi
- Oturum süresi kontrolü

### 5.2 Yetkilendirme
- Rol tabanlı erişim kontrolü
- API endpoint koruması
- Middleware kontrolleri

### 5.3 Veri Güvenliği
- SQL injection koruması (Prisma)
- XSS koruması
- CSRF koruması

## 6. Performans Gereksinimleri

### 6.1 Sayfa Yüklenme Süreleri
- Ana sayfa: < 2 saniye
- Kitap listesi: < 3 saniye
- Profil sayfası: < 2 saniye

### 6.2 Veritabanı Optimizasyonu
- İndeksleme
- Sorgu optimizasyonu
- Bağlantı havuzu yönetimi

## 7. Kullanıcı Arayüzü Gereksinimleri

### 7.1 Tasarım Prensipleri
- Responsive tasarım
- Modern ve minimal arayüz
- Tutarlı renk şeması
- Erişilebilirlik standartları

### 7.2 Bileşenler
- Navigasyon çubuğu
- Form bileşenleri
- Kitap kartları
- Mesaj kutusu
- Profil kartı

## 8. Test Gereksinimleri

### 8.1 Birim Testleri
- API endpoint testleri
- Bileşen testleri
- Form validasyon testleri

### 8.2 Entegrasyon Testleri
- Kimlik doğrulama akışı
- Kitap işlemleri
- Mesajlaşma sistemi

## 9. Dağıtım ve Bakım

### 9.1 Dağıtım Süreci
- Versiyon kontrolü (Git)
- CI/CD pipeline
- Otomatik testler
- Staging ve production ortamları

### 9.2 Bakım Planı
- Düzenli güvenlik güncellemeleri
- Performans izleme
- Hata raporlama
- Yedekleme stratejisi

## 10. Gelecek Özellikler

### 10.1 Planlanan Geliştirmeler
- Gerçek zamanlı mesajlaşma
- Kitap rezervasyon sistemi
- Gelişmiş arama filtreleri
- Kitap değerlendirme ve yorum sistemi
- E-posta bildirimleri 