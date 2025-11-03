import { useState, useCallback } from 'react';
import { AreaTable } from '../../components/areas/AreaTable';
import { useAreas } from '../../lib/api/hooks';
import { Area } from '../../lib/api/types';
import { MapPin, Filter } from 'lucide-react';

export default function AreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const searchParams = {
    pageIndex,
    pageSize,
    ...(searchTerm && { areaName: searchTerm }),
    includeDeleted,
  };

  const { 
    areas, 
    loading, 
    error, 
    pagination,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea
  } = useAreas(searchParams);

  const handlePageChange = useCallback((page: number) => {
    setPageIndex(page);
  }, []);

  const handleEdit = useCallback(async (area: Area) => {
    await fetchAreas();
  }, [fetchAreas]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteArea(id);
    } catch (error) {
      console.error('Delete area error:', error);
    }
  }, [deleteArea]);

  // Museums API returns 403 - not accessible for museum-portal users
  // Using empty array for now
  const apiMuseums: Array<{ id: string; name: string }> = [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Khu vực</h1>
              <p className="text-gray-500 mt-1">Quản lý các khu vực trưng bày trong bảo tàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Tổng khu vực</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {pagination.totalItems.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Khu vực hoạt động</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {areas.filter(area => area.isActive && !area.isDeleted).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 text-green-600">✓</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Khu vực bảo trì</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {areas.filter(area => !area.isActive && !area.isDeleted).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 text-yellow-600">⚠</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khu vực..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Bao gồm đã xóa</span>
            </label>
          </div>
        </div>
      </div>

      {/* Areas Table */}
      <AreaTable
        areas={areas}
        loading={loading}
        error={error}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        includeDeleted={includeDeleted}
        setIncludeDeleted={setIncludeDeleted}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        createArea={createArea}
        updateArea={updateArea}
        museums={apiMuseums.map(m => ({ id: m.id, name: m.name }))}
      />
    </div>
  );
}
