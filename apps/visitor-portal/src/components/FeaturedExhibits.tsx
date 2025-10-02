import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/client';
import { Button } from '@museum-manager/ui-core/client';
import { Badge } from '@museum-manager/ui-core/client';
import { Calendar, MapPin, Users, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const featuredExhibits = [
  {
    id: 1,
    title: 'Văn Hóa Chăm Pa',
    description: 'Khám phá nền văn minh Chăm Pa cổ đại với những tác phẩm điêu khắc, kiến trúc và nghệ thuật độc đáo.',
    image: '/api/placeholder/400/300',
    location: 'Tầng 1 - Phòng A',
    duration: '15/12/2024 - 15/03/2025',
    visitors: '12,450',
    rating: 4.8,
    status: 'Đang diễn ra',
    category: 'Văn hóa cổ đại',
    featured: true,
  },
  {
    id: 2,
    title: 'Cuộc Kháng Chiến Chống Mỹ',
    description: 'Triển lãm tái hiện cuộc kháng chiến anh dũng của dân tộc Việt Nam với những hiện vật, hình ảnh lịch sử.',
    image: '/api/placeholder/400/300',
    location: 'Tầng 2 - Phòng B',
    duration: '20/01/2025 - 20/04/2025',
    visitors: '8,920',
    rating: 4.9,
    status: 'Sắp diễn ra',
    category: 'Lịch sử hiện đại',
    featured: true,
  },
  {
    id: 3,
    title: 'Nghệ Thuật Đông Sơn',
    description: 'Bộ sưu tập trống đồng và hiện vật văn hóa Đông Sơn - nền văn hóa tiêu biểu của Việt Nam cổ đại.',
    image: '/api/placeholder/400/300',
    location: 'Tầng 1 - Phòng C',
    duration: '10/11/2024 - 10/02/2025',
    visitors: '15,680',
    rating: 4.7,
    status: 'Đang diễn ra',
    category: 'Khảo cổ học',
    featured: false,
  },
];

export function FeaturedExhibits() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgeD0iMTUiIHk9IjE1Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
            ✨ Triển lãm đặc sắc
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Triển Lãm Nổi Bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá những triển lãm đặc sắc nhất đang diễn ra tại bảo tàng, 
            mang đến những trải nghiệm văn hóa và lịch sử độc đáo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredExhibits.map((exhibit) => (
            <Card key={exhibit.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-0 shadow-lg hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">🏛️</span>
                    </div>
                    <p className="text-gray-600 font-medium">Hình ảnh triển lãm</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant={exhibit.status === 'Đang diễn ra' ? 'default' : 'secondary'}
                    className={`${exhibit.status === 'Đang diễn ra' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold px-3 py-1 rounded-full shadow-lg`}
                  >
                    {exhibit.status}
                  </Badge>
                </div>

                {/* Featured Badge */}
                {exhibit.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-3 py-1 rounded-full shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Nổi bật
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold px-3 py-1 rounded-full">
                    {exhibit.category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{exhibit.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-indigo-600 transition-colors duration-300">
                  {exhibit.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {exhibit.description}
                </p>

                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">{exhibit.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{exhibit.duration}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{exhibit.visitors} lượt tham quan</span>
                  </div>
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  <Link href={`/exhibits/${exhibit.id}`}>
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild variant="outline" size="lg" className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg">
            <Link href="/exhibits">
              Xem tất cả triển lãm
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

