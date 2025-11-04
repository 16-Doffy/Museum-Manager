'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Landmark, MapPin, Building2, Ticket } from 'lucide-react';
import { getMuseums, type MuseumSummary, getToken } from '@/lib/api';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@museum-manager/ui-core/carousel';

// No hard-coded museums; we render exactly what API returns

export default function SelectMuseumPage() {
  const router = useRouter();
  const [museums, setMuseums] = useState<MuseumSummary[]>([]);
  const [loadingMuseums, setLoadingMuseums] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    const session = typeof window !== 'undefined' ? localStorage.getItem('vp_session_user') : null;
    if (!session) {
      router.replace('/login');
      return;
    }

    // Load museums
    (async () => {
      try {
        setLoadingMuseums(true);
        const list = await getMuseums({ pageIndex: 1, pageSize: 12 });
        setMuseums(Array.isArray(list) ? list : []);
        setLoadError(null);
      } catch (e: any) {
        setMuseums([]);
        setLoadError(e?.message || 'Không tải được danh sách bảo tàng');
      } finally {
        setLoadingMuseums(false);
      }
    })();
  }, [router]);

  function chooseMuseum(id: string) {
    router.push(`/museums/${id}`);
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-6">
        <AutoPlayCarousel />
      </div>
      <Card style={{ background: '#ede7dd' }}>
        <CardHeader>
          <CardTitle className="text-center">Chào mừng bạn đã đến với hệ thống bảo tàng lớn nhất Việt Nam</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">vui lòng chọn các bảo tàng bạn muốn tham quan</p>
          {loadError ? (
            <div className="text-center text-red-600 mb-4">{loadError}</div>
          ) : null}
          {loadingMuseums ? (
            <div className="text-center text-neutral-500">Đang tải danh sách bảo tàng...</div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {museums.map((m: any) => {
              const Icon = (m.icon as any) || Landmark;
              return (
                <div key={m.id} className="rounded-2xl bg-neutral-900 text-white p-8 border border-neutral-800">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-16 rounded-full bg-neutral-800 flex items-center justify-center">
                      <Icon className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{m.name}</h3>
                      <p className="text-sm text-neutral-300 mt-1">{m.description}</p>
                    </div>
                    <Button variant="outline" className="mt-2" onClick={() => chooseMuseum(m.id)}>
                      Tham quan
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {!loadingMuseums && !loadError && museums.length === 0 ? (
            <div className="text-center text-neutral-500">Chưa có bảo tàng nào.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function AutoPlayCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;
    const intervalId = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
        <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {[
              {
                src: 'https://old3.commonsupport.com/wp/muzex/wp-content/uploads/2020/05/1.jpg',
                eyebrow: 'Open every day of the week.',
                title: 'One Of The Finest Collections Of\nMuzex Art.',
              },
              {
                src: 'https://old3.commonsupport.com/wp/muzex/wp-content/uploads/2020/05/2.jpg',
                eyebrow: 'Open every day of the week.',
                title: 'Discover The Treasures Of A Egypt\nHistorical Museum',
              },
              {
                src: 'https://old3.commonsupport.com/wp/muzex/wp-content/uploads/2020/05/3.jpg',
                eyebrow: 'Open every day of the week.',
                title: "World's Leading Museum Of History\nOver 2.3 K Collection",
              },
            ].map((item, idx) => (
              <CarouselItem key={idx} style={{ flex: '0 0 100%' }}>
                <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden rounded-xl">
                  <img src={item.src} alt="Museum banner" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="text-center text-white max-w-4xl">
                      <div className="mb-4 text-sm sm:text-base font-semibold tracking-wide opacity-90">
                        {item.eyebrow}
                      </div>
                      <h2 className="whitespace-pre-line text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow">
                        {item.title}
                      </h2> 
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="right-3 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
  );
}


