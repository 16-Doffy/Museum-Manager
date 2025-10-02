'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/client';
import { Button } from '@museum-manager/ui-core/client';
import { Badge } from '@museum-manager/ui-core/client';
import { Play, Map, Camera, Headphones, ArrowRight, Star, Clock, Users, Globe } from 'lucide-react';
import Link from 'next/link';

const tourSections = [
  {
    id: 1,
    title: 'Phòng Triển Lãm Chính',
    description: 'Khám phá các hiện vật cổ đại và trống đồng Đông Sơn - biểu tượng của nền văn minh Việt Nam cổ đại.',
    duration: '15 phút',
    highlights: ['Hiện vật cổ đại', 'Trống đồng Đông Sơn', 'Đồ gốm sứ cổ'],
    rating: 4.9,
    visitors: '2,450',
    image: '/api/placeholder/400/300',
    featured: true,
  },
  {
    id: 2,
    title: 'Khu Văn Hóa Chăm Pa',
    description: 'Tìm hiểu về nền văn minh Chăm Pa với những tác phẩm điêu khắc và kiến trúc độc đáo.',
    duration: '12 phút',
    highlights: ['Điêu khắc Chăm', 'Kiến trúc cổ', 'Nghệ thuật tôn giáo'],
    rating: 4.8,
    visitors: '1,890',
    image: '/api/placeholder/400/300',
    featured: true,
  },
  {
    id: 3,
    title: 'Phòng Lịch Sử Hiện Đại',
    description: 'Hành trình qua các cuộc kháng chiến chống Pháp và Mỹ với những hiện vật lịch sử quý giá.',
    duration: '18 phút',
    highlights: ['Kháng chiến chống Pháp', 'Kháng chiến chống Mỹ', 'Hiện vật chiến tranh'],
    rating: 4.9,
    visitors: '2,120',
    image: '/api/placeholder/400/300',
    featured: false,
  },
  {
    id: 4,
    title: 'Khu Văn Hóa Óc Eo',
    description: 'Khám phá nền văn hóa Óc Eo - một trong những nền văn minh cổ đại quan trọng của Đông Nam Á.',
    duration: '10 phút',
    highlights: ['Hiện vật Óc Eo', 'Nghệ thuật cổ', 'Di tích khảo cổ'],
    rating: 4.7,
    visitors: '1,650',
    image: '/api/placeholder/400/300',
    featured: false,
  },
  {
    id: 5,
    title: 'Phòng Nghệ Thuật Truyền Thống',
    description: 'Tìm hiểu về các loại hình nghệ thuật truyền thống Việt Nam như tranh dân gian, điêu khắc gỗ.',
    duration: '14 phút',
    highlights: ['Tranh dân gian', 'Điêu khắc gỗ', 'Nghề thủ công'],
    rating: 4.6,
    visitors: '1,420',
    image: '/api/placeholder/400/300',
    featured: false,
  },
  {
    id: 6,
    title: 'Khu Tôn Giáo & Tín Ngưỡng',
    description: 'Khám phá các tôn giáo và tín ngưỡng truyền thống của Việt Nam qua các hiện vật và tài liệu.',
    duration: '11 phút',
    highlights: ['Phật giáo', 'Đạo giáo', 'Tín ngưỡng dân gian'],
    rating: 4.5,
    visitors: '1,380',
    image: '/api/placeholder/400/300',
    featured: false,
  },
];

const tourFeatures = [
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
  {
    icon: Globe,
    title: 'Truy Cập Mọi Lúc',
    description: 'Tham quan ảo 24/7 từ bất kỳ đâu trên thế giới',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function VirtualTourPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-white border-white/30">
              🚀 Công nghệ mới
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Tham Quan Ảo
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Trải Nghiệm Số
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Khám phá bảo tàng từ bất kỳ đâu với công nghệ thực tế ảo tiên tiến. 
              Trải nghiệm lịch sử và văn hóa Việt Nam một cách sống động và chân thực nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/virtual-tour/start">
                  <Play className="w-5 h-5 mr-2" />
                  Bắt đầu tham quan
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/virtual-tour/demo">
                  Xem demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Công nghệ tiên tiến mang đến trải nghiệm tham quan bảo tàng hoàn toàn mới
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tourFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-4`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tour Sections */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Các Khu Vực Tham Quan
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Khám phá từng khu vực của bảo tàng với hướng dẫn chi tiết và thông tin phong phú
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tourSections.map((section) => (
            <Card key={section.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-slate-500 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-slate-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">BT</span>
                  </div>
                  <p className="text-sm">Hình ảnh 360°</p>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={section.featured ? 'default' : 'secondary'}
                    className={section.featured ? 'bg-red-500' : 'bg-blue-500'}
                  >
                    {section.featured ? 'Nổi bật' : 'Tham quan'}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-slate-500">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{section.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                  {section.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {section.description}
                </p>

                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Thời gian: {section.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{section.visitors} lượt tham quan</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Điểm nổi bật:</h4>
                  <div className="flex flex-wrap gap-1">
                    {section.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button asChild className="w-full group-hover:bg-red-600 transition-colors">
                  <Link href={`/virtual-tour/${section.id}`}>
                    <Play className="w-4 h-4 mr-2" />
                    Tham quan khu vực này
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Thống Kê Tham Quan Ảo
            </h2>
            <p className="text-lg text-slate-600">
              Những con số ấn tượng về tour ảo của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-slate-600">Lượt tham quan ảo</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">4.8</div>
              <div className="text-slate-600">Đánh giá trung bình</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-slate-600">Có sẵn mọi lúc</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-slate-600">Khu vực tham quan</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Bắt Đầu Hành Trình?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Trải nghiệm lịch sử và văn hóa Việt Nam ngay bây giờ với tour ảo của chúng tôi
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
            <Link href="/virtual-tour/start">
              <Play className="w-5 h-5 mr-2" />
              Bắt đầu tham quan ngay
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

