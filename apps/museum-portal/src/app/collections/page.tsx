"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, Topbar, CollectionTable, CollectionList } from '@/components';
import { Button } from '@/components/common';
import NavigationButtons from '@/components/common/NavigationButtons';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useState } from 'react';

export default function CollectionsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <NavigationButtons 
          currentPage="Quản lý Bộ sưu tập"
          nextPage="/areas"
          nextPageTitle="Khu vực"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Quản lý Bộ sưu tập</h1>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Thêm hiện vật mới
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <CollectionTable />
          </div>
        </main>
      </div>
    </div>
  );
}

