"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "USER", // Varsayılan olarak USER rolü atanıyor
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Kayıt işlemi başarısız oldu");
      }

      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      
      // Otomatik giriş yap
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/library-bg.jpg')] bg-cover bg-center bg-fixed">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-serif text-[#2C3E2D] text-center">Kayıt Ol</CardTitle>
          <CardDescription className="text-[#4A6741] text-center">
            Kitap paylaşım platformuna hoş geldiniz
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[#2C3E2D]">Ad Soyad</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ad Soyad"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white/50 border-[#E8E4DB] focus:ring-[#8B4513]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[#2C3E2D]">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/50 border-[#E8E4DB] focus:ring-[#8B4513]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-[#2C3E2D]">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white/50 border-[#E8E4DB] focus:ring-[#8B4513]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-[#4A6741] hover:bg-[#5B7A4F] text-white" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Kayıt Ol
            </Button>
            <div className="text-sm text-center text-[#4A6741]">
              Zaten hesabınız var mı?{" "}
              <Button
                variant="link"
                className="p-0 text-[#8B4513] hover:text-[#A0522D]"
                onClick={() => router.push("/login")}
              >
                Giriş Yap
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 