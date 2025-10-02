import { Card, CardContent } from '@museum-manager/ui-core/client';
import { Button } from '@museum-manager/ui-core/client';
import { Badge } from '@museum-manager/ui-core/client';
import { Play, Map, Camera, Headphones, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const virtualTourFeatures = [
  {
    icon: Map,
    title: 'Tham Quan 360°',
    description: 'Khám phá bảo tàng với công nghệ thực tế ảo 360 độ',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Camera,
    title: 'Hình Ảnh Độ Phân Giải Cao',
    description: 'Xem chi tiết từng hiện vật với chất lượng hình ảnh 4K',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Headphones,
    title: 'Hướng Dẫn Âm Thanh',
    description: 'Lắng nghe câu chuyện lịch sử với hướng dẫn viên chuyên nghiệp',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

const tourHighlights = [
  {
    title: 'Phòng Triển Lãm Chính',
    duration: '15 phút',
    highlights: 'Hiện vật cổ đại, Trống đồng Đông Sơn',
    rating: 4.9,
  },
  {
    title: 'Khu Văn Hóa Chăm Pa',
    duration: '12 phút',
    highlights: 'Điêu khắc Chăm, Kiến trúc cổ',
    rating: 4.8,
  },
  {
    title: 'Phòng Lịch Sử Hiện Đại',
    duration: '18 phút',
    highlights: 'Kháng chiến chống Pháp, Mỹ',
    rating: 4.9,
  },
];

export function VirtualTour() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgeD0iMTUiIHk9IjE1Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                🥽 Công nghệ VR
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Tham Quan Ảo
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
                  Trải Nghiệm Số
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Khám phá bảo tàng từ bất kỳ đâu với công nghệ thực tế ảo tiên tiến. 
                Trải nghiệm lịch sử và văn hóa Việt Nam một cách sống động và chân thực nhất.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {virtualTourFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/virtual-tour">
                  <Play className="w-5 h-5 mr-2" />
                  Bắt đầu tham quan
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-semibold px-8 py-4 rounded-2xl transition-all duration-300">
                <Link href="/virtual-tour/demo">
                  Xem demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Tour Highlights */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                Điểm Nổi Bật
              </h3>
              <p className="text-gray-600 text-lg">
                Các khu vực được yêu thích nhất trong tour ảo
              </p>
            </div>

            {tourHighlights.map((tour, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg mb-2">
                        {tour.title}
                      </h4>
                      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full w-fit">
                        <span className="text-sm font-medium text-gray-600">⏱️</span>
                        <span className="text-sm font-semibold text-gray-700">{tour.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-amber-700">{tour.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {tour.highlights}
                  </p>
                  
                  <Button asChild variant="ghost" size="sm" className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-600 font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-md">
                    <Link href={`/virtual-tour/${index + 1}`}>
                      Tham quan khu vực này
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl font-bold text-indigo-600 mb-3">50K+</div>
            <div className="text-gray-600 font-semibold text-lg">Lượt tham quan ảo</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl font-bold text-green-600 mb-3">4.8</div>
            <div className="text-gray-600 font-semibold text-lg">Đánh giá trung bình</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl font-bold text-purple-600 mb-3">24/7</div>
            <div className="text-gray-600 font-semibold text-lg">Có sẵn mọi lúc</div>
          </div>
        </div>
      </div>
    </section>
  );
}

