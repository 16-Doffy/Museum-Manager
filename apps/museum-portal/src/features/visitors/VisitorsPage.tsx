import { useState } from 'react';
import VisitorTable from '../../components/visitors/VisitorTable';
import { Users, Plus } from 'lucide-react';

export default function VisitorsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (id: string) => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = (id: string) => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Khách tham quan</h1>
              <p className="text-gray-500 mt-1">Quản lý thông tin khách tham quan bảo tàng</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm khách tham quan</span>
        </button>
      </div>

      <VisitorTable
        key={refreshKey}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
