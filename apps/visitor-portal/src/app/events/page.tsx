'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/client';
import { Button } from '@museum-manager/ui-core/client';
import { Badge } from '@museum-manager/ui-core/client';
import { Input } from '@museum-manager/ui-core/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@museum-manager/ui-core/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@museum-manager/ui-core/client';
import { Search, Calendar, Clock, MapPin, Users, Ticket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const events = [
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
    category: 'Học thuật',
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
    category: 'Thực hành',
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
    category: 'Nghệ thuật',
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
    category: 'Học thuật',
  },
  {
    id: 5,
    title: 'Lễ Hội "Tết Cổ Truyền"',
    description: 'Trải nghiệm không khí Tết cổ truyền với các hoạt động văn hóa, ẩm thực và trò chơi dân gian.',
    date: '10/02/2025',
    time: '08:00 - 18:00',
    location: 'Sân bảo tàng',
    capacity: '1000 người',
    price: 'Miễn phí',
    type: 'Lễ hội',
    status: 'Sắp diễn ra',
    category: 'Văn hóa',
  },
  {
    id: 6,
    title: 'Workshop "Vẽ Tranh Dân Gian"',
    description: 'Học vẽ tranh dân gian Việt Nam với sự hướng dẫn của nghệ nhân làng Đông Hồ.',
    date: '05/03/2025',
    time: '10:00 - 15:00',
    location: 'Phòng workshop',
    capacity: '25 người',
    price: '200,000 VNĐ',
    type: 'Workshop',
    status: 'Sắp mở đăng ký',
    category: 'Thực hành',
  },
];

const eventTypes = [
  'Tất cả',
  'Hội thảo',
  'Workshop',
  'Khai mạc',
  'Thuyết trình',
  'Lễ hội',
];

const categories = [
  'Tất cả',
  'Học thuật',
  'Thực hành',
  'Nghệ thuật',
  'Văn hóa',
];

export default function EventsPage() {
  const todayEvents = events.filter(event => event.date === '25/01/2025');
  const upcomingEvents = events.filter(event => event.date !== '25/01/2025');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Sự Kiện & Hoạt Động
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tham gia các sự kiện, hội thảo và workshop đặc biệt được tổ chức tại bảo tàng. 
              Cơ hội học hỏi và trải nghiệm văn hóa độc đáo.
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
                placeholder="Tìm kiếm sự kiện..."
                className="pl-10"
              />
            </div>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Loại sự kiện" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

            <Button className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Lọc</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Events Tabs */}
      <div className="container mx-auto px-4 pb-16">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Hôm Nay</TabsTrigger>
            <TabsTrigger value="upcoming">Sắp Tới</TabsTrigger>
            <TabsTrigger value="all">Tất Cả</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Sự Kiện Hôm Nay
              </h2>
              <p className="text-slate-600">
                Các sự kiện đang diễn ra trong ngày hôm nay
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={event.type === 'Hội thảo' ? 'default' : event.type === 'Workshop' ? 'secondary' : 'outline'}
                        className={
                          event.type === 'Hội thảo' ? 'bg-blue-500' : 
                          event.type === 'Workshop' ? 'bg-green-500' : 
                          'bg-purple-500 text-white'
                        }
                      >
                        {event.type}
                      </Badge>
                      <Badge 
                        variant={event.status === 'Đang đăng ký' ? 'default' : 'secondary'}
                        className={event.status === 'Đang đăng ký' ? 'bg-green-500' : 'bg-yellow-500'}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-slate-500">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Users className="w-4 h-4" />
                          <span>{event.capacity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Ticket className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {event.price}
                        </span>
                      </div>
                      <Button asChild size="sm" className="group-hover:bg-red-600 transition-colors">
                        <Link href={`/events/${event.id}`}>
                          Chi tiết
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Sự Kiện Sắp Tới
              </h2>
              <p className="text-slate-600">
                Các sự kiện sẽ diễn ra trong thời gian tới
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={event.type === 'Hội thảo' ? 'default' : event.type === 'Workshop' ? 'secondary' : 'outline'}
                        className={
                          event.type === 'Hội thảo' ? 'bg-blue-500' : 
                          event.type === 'Workshop' ? 'bg-green-500' : 
                          'bg-purple-500 text-white'
                        }
                      >
                        {event.type}
                      </Badge>
                      <Badge 
                        variant={event.status === 'Đang đăng ký' ? 'default' : 'secondary'}
                        className={event.status === 'Đang đăng ký' ? 'bg-green-500' : 'bg-yellow-500'}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-slate-500">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Users className="w-4 h-4" />
                          <span>{event.capacity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Ticket className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {event.price}
                        </span>
                      </div>
                      <Button asChild size="sm" className="group-hover:bg-red-600 transition-colors">
                        <Link href={`/events/${event.id}`}>
                          Chi tiết
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Tất Cả Sự Kiện
              </h2>
              <p className="text-slate-600">
                Danh sách đầy đủ các sự kiện tại bảo tàng
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={event.type === 'Hội thảo' ? 'default' : event.type === 'Workshop' ? 'secondary' : 'outline'}
                        className={
                          event.type === 'Hội thảo' ? 'bg-blue-500' : 
                          event.type === 'Workshop' ? 'bg-green-500' : 
                          'bg-purple-500 text-white'
                        }
                      >
                        {event.type}
                      </Badge>
                      <Badge 
                        variant={event.status === 'Đang đăng ký' ? 'default' : 'secondary'}
                        className={event.status === 'Đang đăng ký' ? 'bg-green-500' : 'bg-yellow-500'}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Ticket className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {event.price}
                        </span>
                      </div>
                      <Button asChild size="sm" className="group-hover:bg-red-600 transition-colors">
                        <Link href={`/events/${event.id}`}>
                          Chi tiết
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm sự kiện
          </Button>
        </div>
      </div>
    </div>
  );
}

