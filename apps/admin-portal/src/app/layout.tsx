
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from './(admin)/components/Sidebar';

export const metadata: Metadata = {
  title: 'Admin Portal',
  description: 'Museum management admin portal'
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1">
            <main className="w-full bg-gradient-to-b from-gray-50 to-white">
              <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
