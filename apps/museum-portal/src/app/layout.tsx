import type { Metadata } from "next";
import "./globals.css";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {children}
        </div>
      </body>
    </html>
  );
}
