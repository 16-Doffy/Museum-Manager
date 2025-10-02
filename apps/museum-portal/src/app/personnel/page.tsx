"use client";

import { Sidebar, Topbar } from '@/components';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/common';
import { StatCard } from '@/components/dashboard';

export default function PersonnelPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Quản lý Nhân viên</h1>
            {/* <Button>
              Thêm nhân viên mới
            </Button> */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard title="Tổng nhân viên" value="45" />
            <StatCard title="Đang làm việc" value="42" />
            <StatCard title="Nghỉ phép" value="3" />
            <StatCard title="Nhân viên mới tháng này" value="5" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-600">Danh sách nhân viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-black py-3 px-4">Tên nhân viên</th>
                      <th className="text-left text-black  py-3 px-4">Chức vụ</th>
                      <th className="text-left text-black py-3 px-4">Phòng ban</th>
                      <th className="text-left text-black py-3 px-4">Trạng thái</th>
                      <th className="text-left text-black py-3 px-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">N</span>
                          </div>
                          <div>
                            <p className="font-medium text-black">Nguyễn Văn A</p>
                            <p className="text-sm text-gray-400">nv.a@museum.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-black">Quản lý bộ sưu tập</td>
                      <td className="py-3 px-4 text-black">Phòng trưng bày</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Đang làm việc
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className='text-green-500 border-green-700'>Sửa</Button>
                          <Button size="sm" variant="outline" className='text-red-500 border-red-400'>Xem</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">T</span>
                          </div>
                          <div>
                            <p className="font-medium text-black">Trần Thị B</p>
                            <p className="text-sm text-gray-500">tt.b@museum.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-black">Hướng dẫn viên</td>
                      <td className="py-3 px-4 text-black">Phòng dịch vụ</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Đang làm việc
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                        <Button size="sm" variant="outline" className='text-green-500 border-green-400'>Sửa</Button>
                        <Button size="sm" variant="outline" className='text-red-500 border-red-400'>Xem</Button>
                        </div>
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
