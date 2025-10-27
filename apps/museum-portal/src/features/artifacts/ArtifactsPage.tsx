import CollectionTable from '../../components/collections/CollectionTable';
import { Package, Plus } from 'lucide-react';

export default function ArtifactsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Hiện vật</h1>
              <p className="text-gray-500 mt-1">Quản lý bộ sưu tập hiện vật trong bảo tàng</p>
            </div>
          </div>
        </div>
      </div>
      
      <CollectionTable />
    </div>
  );
}
