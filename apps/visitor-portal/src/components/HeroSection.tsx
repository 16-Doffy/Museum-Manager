'use client';

import { useState } from 'react';
import { Button } from '@museum-manager/ui-core/client';
import { Card, CardContent } from '@museum-manager/ui-core/client';
import { Input } from '@museum-manager/ui-core/client';
import { Search, Calendar, MapPin, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle search logic
    console.log('Searching for:', searchQuery);
  };

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-medium text-yellow-300">✨ Trải nghiệm độc đáo</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Khám Phá
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400">
                  Lịch Sử Việt Nam
                </span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                Hành trình qua hàng nghìn năm lịch sử, từ thời kỳ dựng nước đến hiện đại. 
                Khám phá những câu chuyện, hiện vật và di sản văn hóa quý giá của dân tộc.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-lg">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-yellow-400 transition-colors" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm triển lãm, sự kiện, hiện vật..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:bg-white/20 focus:border-yellow-400/50 rounded-2xl text-lg shadow-2xl transition-all duration-300"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Tìm kiếm
                </Button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <Link href="/exhibits">
                  🏛️ Xem Triển Lãm
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105">
                <Link href="/virtual-tour">
                  🥽 Tham Quan Ảo
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="font-bold text-lg">Sự Kiện Hôm Nay</h3>
                </div>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  Triển lãm "Văn hóa Chăm Pa" - 9:00 - 17:00
                </p>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform">
                  Xem chi tiết →
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <MapPin className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-lg">Vị Trí</h3>
                </div>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  216 Trần Quang Khải, Quận 1, TP.HCM
                </p>
                <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform">
                  Chỉ đường →
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-bold text-lg">Giờ Mở Cửa</h3>
                </div>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  Thứ 2 - Chủ Nhật: 8:00 - 17:00
                </p>
                <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform">
                  Lịch trình →
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-lg">Khách Tham Quan</h3>
                </div>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  Hôm nay: 1,247 lượt tham quan
                </p>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform">
                  Thống kê →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
