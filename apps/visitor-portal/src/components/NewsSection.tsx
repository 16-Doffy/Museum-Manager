import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/client';
import { Button } from '@museum-manager/ui-core/client';
import { Badge } from '@museum-manager/ui-core/client';
import { Calendar, User, ArrowRight, Eye, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const newsArticles = [
  {
    id: 1,
    title: 'Bảo Tàng Lịch Sử Việt Nam Đón Triển Lãm Quốc Tế Lần Đầu Tiên',
    excerpt: 'Triển lãm "Văn hóa Đông Nam Á" với sự tham gia của 8 quốc gia trong khu vực sẽ được tổ chức vào tháng 3/2025.',
    image: '/api/placeholder/400/250',
    author: 'Nguyễn Văn A',
    date: '15/01/2025',
    category: 'Tin tức',
    views: 1250,
    comments: 23,
    featured: true,
  },
  {
    id: 2,
    title: 'Phát Hiện Mới: Tìm Thấy Hiện Vật Cổ Đại Tại Di Tích Thành Cổ',
    excerpt: 'Các nhà khảo cổ học đã phát hiện ra những hiện vật có niên đại hơn 2000 năm tại di tích thành cổ Hoa Lư.',
    image: '/api/placeholder/400/250',
    author: 'Trần Thị B',
    date: '12/01/2025',
    category: 'Khảo cổ',
    views: 890,
    comments: 15,
    featured: false,
  },
  {
    id: 3,
    title: 'Workshop Làm Gốm Truyền Thống Thu Hút Đông Đảo Du Khách',
    excerpt: 'Chương trình workshop làm gốm theo phương pháp truyền thống đã nhận được sự quan tâm lớn từ cộng đồng.',
    image: '/api/placeholder/400/250',
    author: 'Lê Văn C',
    date: '10/01/2025',
    category: 'Hoạt động',
    views: 650,
    comments: 8,
    featured: false,
  },
  {
    id: 4,
    title: 'Bảo Tàng Triển Khai Công Nghệ AR Cho Tham Quan Ảo',
    excerpt: 'Ứng dụng công nghệ thực tế tăng cường (AR) để mang đến trải nghiệm tham quan bảo tàng mới mẻ và thú vị.',
    image: '/api/placeholder/400/250',
    author: 'Phạm Thị D',
    date: '08/01/2025',
    category: 'Công nghệ',
    views: 1100,
    comments: 31,
    featured: false,
  },
];

export function NewsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgeD0iMTUiIHk9IjE1Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            📰 Tin tức mới nhất
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Tin Tức & Sự Kiện
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cập nhật những tin tức mới nhất về bảo tàng, các phát hiện khảo cổ học 
            và những hoạt động văn hóa đặc biệt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            {newsArticles.filter(article => article.featured).map((article) => (
              <Card key={article.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-0 shadow-lg hover:-translate-y-1">
                <div className="aspect-[16/9] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">📰</span>
                    </div>
                    <p className="text-gray-600 font-medium">Hình ảnh bài viết</p>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
                      {article.category}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-semibold px-3 py-1 rounded-full shadow-lg">
                      ⭐ Nổi bật
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-indigo-600 transition-colors leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <User className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium text-gray-700">{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-gray-700">{article.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{article.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">{article.comments}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                    <Link href={`/news/${article.id}`}>
                      Đọc thêm
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Other Articles */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Bài viết khác
            </h3>
            
            {newsArticles.filter(article => !article.featured).map((article) => (
              <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-md hover:-translate-y-1">
                <CardContent className="p-5">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <span className="text-indigo-600 font-bold text-lg">📰</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold px-2 py-1 rounded-full text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-gray-500 font-medium">{article.date}</span>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm leading-tight mb-2">
                        {article.title}
                      </h4>
                      
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">{article.author}</span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Eye className="w-3 h-3" />
                            <span className="font-medium">{article.views}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <MessageCircle className="w-3 h-3" />
                            <span className="font-medium">{article.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Button asChild variant="outline" size="lg" className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg">
            <Link href="/news">
              Xem tất cả tin tức
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

