import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/client';
import { Button } from '@museum-manager/ui-core/client';
import { Badge } from '@museum-manager/ui-core/client';
import { Calendar, Clock, MapPin, Users, ArrowRight, Ticket } from 'lucide-react';
import Link from 'next/link';

const upcomingEvents = [
  {
    id: 1,
    title: 'Hội Thảo "Lịch Sử Văn Hóa Việt Nam"',
    description: 'Buổi hội thảo với sự tham gia của các chuyên gia hàng đầu về lịch sử và văn hóa Việt Nam.',
    date: '25/01/2025',
    time: '14:00 - 16:00',
    location: 'Hội trường chính',
    capacity: '200 người',
    price: 'Miễn phí',
    type: 'Hội thảo',
    status: 'Đang đăng ký',
  },
  {
    id: 2,
    title: 'Workshop "Làm Gốm Truyền Thống"',
    description: 'Trải nghiệm làm gốm theo phương pháp truyền thống với sự hướng dẫn của nghệ nhân.',
    date: '02/02/2025',
    time: '09:00 - 12:00',
    location: 'Xưởng thủ công',
    capacity: '30 người',
    price: '150,000 VNĐ',
    type: 'Workshop',
    status: 'Sắp mở đăng ký',
  },
  {
    id: 3,
    title: 'Triển Lãm "Nghệ Thuật Đương Đại Việt Nam"',
    description: 'Khai mạc triển lãm nghệ thuật đương đại với sự tham gia của 20 nghệ sĩ nổi tiếng.',
    date: '15/02/2025',
    time: '18:00 - 20:00',
    location: 'Phòng triển lãm tầng 3',
    capacity: '500 người',
    price: 'Miễn phí',
    type: 'Khai mạc',
    status: 'Sắp diễn ra',
  },
  {
    id: 4,
    title: 'Buổi Thuyết Trình "Khảo Cổ Học Việt Nam"',
    description: 'Tiến sĩ Nguyễn Văn A sẽ chia sẻ về những phát hiện khảo cổ học mới nhất tại Việt Nam.',
    date: '28/02/2025',
    time: '19:00 - 21:00',
    location: 'Thư viện bảo tàng',
    capacity: '100 người',
    price: '50,000 VNĐ',
    type: 'Thuyết trình',
    status: 'Đang đăng ký',
  },
];

export function UpcomingEvents() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgeD0iMTUiIHk9IjE1Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
            📅 Sự kiện sắp tới
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-green-900 to-blue-900 bg-clip-text text-transparent">
            Sự Kiện Sắp Tới
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tham gia các sự kiện, hội thảo và workshop đặc biệt được tổ chức tại bảo tàng. 
            Cơ hội học hỏi và trải nghiệm văn hóa độc đáo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    className={`${
                      event.type === 'Hội thảo' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                      event.type === 'Workshop' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      'bg-gradient-to-r from-purple-500 to-purple-600'
                    } text-white font-semibold px-3 py-1 rounded-full shadow-lg`}
                  >
                    {event.type}
                  </Badge>
                  <Badge 
                    className={`${
                      event.status === 'Đang đăng ký' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      'bg-gradient-to-r from-yellow-500 to-orange-500'
                    } text-white font-semibold px-3 py-1 rounded-full shadow-lg`}
                  >
                    {event.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-indigo-600 transition-colors leading-tight">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-700">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-gray-700">{event.time}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-700 truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-gray-700">{event.capacity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg">
                    <Ticket className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">
                      {event.price}
                    </span>
                  </div>
                  <Button asChild size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                    <Link href={`/events/${event.id}`}>
                      Chi tiết
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild variant="outline" size="lg" className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg">
            <Link href="/events">
              Xem lịch sự kiện đầy đủ
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

