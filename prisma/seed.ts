import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcısı için e-posta ve şifre
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  // Admin kullanıcısının var olup olmadığını kontrol et
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Şifreyi hashle
    const hashedPassword = await hash(adminPassword, 12);

    // Admin kullanıcısını oluştur
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin kullanıcısı oluşturuldu:', admin.email);
  } else {
    console.log('Admin kullanıcısı zaten mevcut');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 