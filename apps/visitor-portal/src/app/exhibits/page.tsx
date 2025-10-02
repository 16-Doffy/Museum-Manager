'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/client';
import { Button } from '@museum-manager/ui-core/client';
import { Badge } from '@museum-manager/ui-core/client';
import { Input } from '@museum-manager/ui-core/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@museum-manager/ui-core/client';
import { Search, Filter, Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const exhibits = [
  {
    id: 1,
    title: 'Văn Hóa Chăm Pa',
    description: 'Khám phá nền văn minh Chăm Pa cổ đại với những tác phẩm điêu khắc, kiến trúc và nghệ thuật độc đáo.',
    location: 'Tầng 1 - Phòng A',
    duration: '15/12/2024 - 15/03/2025',
    visitors: '12,450',
    rating: 4.8,
    status: 'Đang diễn ra',
    category: 'Văn hóa cổ đại',
    featured: true,
    image: '/api/placeholder/400/300',
  },
  {
    id: 2,
    title: 'Cuộc Kháng Chiến Chống Mỹ',
    description: 'Triển lãm tái hiện cuộc kháng chiến anh dũng của dân tộc Việt Nam với những hiện vật, hình ảnh lịch sử.',
    location: 'Tầng 2 - Phòng B',
    duration: '20/01/2025 - 20/04/2025',
    visitors: '8,920',
    rating: 4.9,
    status: 'Sắp diễn ra',
    category: 'Lịch sử hiện đại',
    featured: true,
    image: '/api/placeholder/400/300',
  },
  {
    id: 3,
    title: 'Nghệ Thuật Đông Sơn',
    description: 'Bộ sưu tập trống đồng và hiện vật văn hóa Đông Sơn - nền văn hóa tiêu biểu của Việt Nam cổ đại.',
    location: 'Tầng 1 - Phòng C',
    duration: '10/11/2024 - 10/02/2025',
    visitors: '15,680',
    rating: 4.7,
    status: 'Đang diễn ra',
    category: 'Khảo cổ học',
    featured: false,
    image: '/api/placeholder/400/300',
  },
  {
    id: 4,
    title: 'Văn Hóa Óc Eo',
    description: 'Triển lãm về nền văn hóa Óc Eo - một trong những nền văn minh cổ đại quan trọng của Đông Nam Á.',
    location: 'Tầng 2 - Phòng D',
    duration: '05/02/2025 - 05/05/2025',
    visitors: '6,750',
    rating: 4.6,
    status: 'Sắp diễn ra',
    category: 'Khảo cổ học',
    featured: false,
    image: '/api/placeholder/400/300',
  },
];

const categories = [
  'Tất cả',
  'Văn hóa cổ đại',
  'Lịch sử hiện đại',
  'Khảo cổ học',
  'Nghệ thuật',
  'Tôn giáo',
];

const statuses = [
  'Tất cả',
  'Đang diễn ra',
  'Sắp diễn ra',
  'Đã kết thúc',
];

export default function ExhibitsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Triển Lãm
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Khám phá các triển lãm đặc sắc tại Bảo Tàng Lịch Sử Việt Nam, 
              từ những nền văn minh cổ đại đến lịch sử hiện đại.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm triển lãm..."
                className="pl-10"
              />
            </div>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Lọc</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Exhibits Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibits.map((exhibit) => (
            <Card key={exhibit.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-slate-500 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-slate-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">BT</span>
                  </div>
                  <p className="text-sm">Hình ảnh triển lãm</p>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={exhibit.status === 'Đang diễn ra' ? 'default' : 'secondary'}
                    className={exhibit.status === 'Đang diễn ra' ? 'bg-green-500' : 'bg-blue-500'}
                  >
                    {exhibit.status}
                  </Badge>
                  {exhibit.featured && (
                    <Badge variant="destructive" className="bg-red-500">
                      <Star className="w-3 h-3 mr-1" />
                      Nổi bật
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                  {exhibit.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {exhibit.description}
                </p>

                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{exhibit.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{exhibit.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{exhibit.visitors} lượt tham quan</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{exhibit.rating}</span>
                  </div>
                  <Button asChild size="sm" className="group-hover:bg-red-600 transition-colors">
                    <Link href={`/exhibits/${exhibit.id}`}>
                      Chi tiết
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm triển lãm
          </Button>
        </div>
      </div>
    </div>
  );
}

