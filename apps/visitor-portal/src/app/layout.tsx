// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientThemeProvider } from '@/components/ClientThemeProvider';
import ChatAIWidget from '@/components/ChatAIWidget';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Bảo Tàng Lịch Sử Việt Nam - Cổng Thông Tin Khách Tham Quan', 
  description: 'Khám phá lịch sử và văn hóa Việt Nam qua các triển lãm, sự kiện và hiện vật quý giá tại Bảo Tàng Lịch Sử Việt Nam.'
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6">
              {children}
            </main>
            <ChatAIWidget />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
