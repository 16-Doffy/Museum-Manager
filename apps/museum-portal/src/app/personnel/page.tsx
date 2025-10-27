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
            <Button 
              onClick={() => alert('Chức năng thêm nhân viên mới sẽ được triển khai')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Thêm nhân viên mới
            </Button>
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
                          <button 
                            onClick={() => alert('Xem chi tiết nhân viên: Nguyễn Văn A')}
                            className="px-3 py-1 text-sm border border-red-400 text-red-500 rounded hover:bg-red-50"
                          >
                            Xem
                          </button>
                          <button 
                            onClick={() => alert('Chỉnh sửa nhân viên: Nguyễn Văn A')}
                            className="px-3 py-1 text-sm border border-green-700 text-green-500 rounded hover:bg-green-50"
                          >
                            Sửa
                          </button>
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
                          <button 
                            onClick={() => alert('Xem chi tiết nhân viên: Trần Thị B')}
                            className="px-3 py-1 text-sm border border-red-400 text-red-500 rounded hover:bg-red-50"
                          >
                            Xem
                          </button>
                          <button 
                            onClick={() => alert('Chỉnh sửa nhân viên: Trần Thị B')}
                            className="px-3 py-1 text-sm border border-green-700 text-green-500 rounded hover:bg-green-50"
                          >
                            Sửa
                          </button>
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
