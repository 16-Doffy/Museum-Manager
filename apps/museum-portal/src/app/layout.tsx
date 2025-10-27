import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Museum Portal - Quản lý Bảo tàng",
  description: "Hệ thống quản lý bảo tàng dành cho nhân viên",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
