import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Museum Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">BT</span>
              </div>
              <span className="font-bold text-xl">Bảo Tàng Lịch Sử</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Khám phá lịch sử và văn hóa Việt Nam qua các triển lãm, sự kiện và hiện vật quý giá.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/exhibits" className="text-slate-300 hover:text-white transition-colors">
                  Triển Lãm Hiện Tại
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-300 hover:text-white transition-colors">
                  Sự Kiện Sắp Tới
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-slate-300 hover:text-white transition-colors">
                  Bộ Sưu Tập
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  Giới Thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thông Tin Liên Hệ</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">
                  216 Trần Quang Khải, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">(028) 3829 8146</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">info@baotanglichsu.vn</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Giờ Mở Cửa</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-slate-300">Thứ 2 - Chủ Nhật</div>
                  <div className="text-slate-400">8:00 - 17:00</div>
                </div>
              </div>
              <div className="text-slate-400 text-xs mt-2">
                * Đóng cửa vào các ngày lễ tết
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © 2024 Bảo Tàng Lịch Sử Việt Nam. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Chính Sách Bảo Mật
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                Điều Khoản Sử Dụng
              </Link>
              <Link href="/accessibility" className="text-slate-400 hover:text-white transition-colors">
                Khả Năng Tiếp Cận
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

