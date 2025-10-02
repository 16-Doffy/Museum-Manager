"use client";

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    redirect('/dashboard');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Museum Management Portal
        </h1>
        <p className="text-gray-600">
          Đang chuyển hướng đến trang quản lý...
        </p>
      </div>
    </div>
  );
}
