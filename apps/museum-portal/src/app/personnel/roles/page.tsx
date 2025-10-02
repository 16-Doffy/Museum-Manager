"use client";

import { Sidebar, Topbar } from '@/components';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/common';

export default function RolesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Phân quyền Hệ thống</h1>
            <Button>
              Tạo vai trò mới
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản trị viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số người dùng:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quyền hạn:</span>
                    <span className="text-sm text-green-600">Toàn quyền</span>
                  </div>
                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      Quản lý quyền
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quản lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số người dùng:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quyền hạn:</span>
                    <span className="text-sm text-blue-600">Quản lý bộ phận</span>
                  </div>
                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      Quản lý quyền
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Nhân viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số người dùng:</span>
                    <span className="font-medium">34</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quyền hạn:</span>
                    <span className="text-sm text-gray-600">Cơ bản</span>
                  </div>
                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      Quản lý quyền
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Chi tiết Phân quyền</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Vai trò</th>
                      <th className="text-left py-3 px-4">Quản lý bộ sưu tập</th>
                      <th className="text-left py-3 px-4">Quản lý sự kiện</th>
                      <th className="text-left py-3 px-4">Quản lý vé</th>
                      <th className="text-left py-3 px-4">Báo cáo</th>
                      <th className="text-left py-3 px-4">Cài đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Quản trị viên</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Quản lý</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Nhân viên</td>
                      <td className="py-3 px-4">
                        <span className="text-yellow-600">~</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-yellow-600">~</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
