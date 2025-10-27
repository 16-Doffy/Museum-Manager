import { useState, useCallback } from 'react';
import { DisplayPositionTable } from '../../components/display-positions/DisplayPositionTable';
import { useDisplayPositions, useAreas } from '../../lib/api/hooks';
import { DisplayPosition } from '../../lib/api/types';
import { Layout, Filter } from 'lucide-react';

export default function DisplayPositionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaName, setAreaName] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const { 
    displayPositions, 
    loading, 
    error, 
    pagination,
    fetchDisplayPositions,
    createDisplayPosition,
    updateDisplayPosition,
    deleteDisplayPosition
  } = useDisplayPositions({
    displayPositionName: searchTerm || undefined,
    areaName: areaName || undefined,
    includeDeleted,
    pageIndex,
    pageSize,
  });

  // Get areas for dropdown
  const { areas } = useAreas({
    pageIndex: 1,
    pageSize: 100, // Get all areas
  });

  const handlePageChange = useCallback((page: number) => {
    setPageIndex(page);
  }, []);

  const handleEdit = useCallback(async (displayPosition: DisplayPosition) => {
    await fetchDisplayPositions();
  }, [fetchDisplayPositions]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteDisplayPosition(id);
    } catch (error) {
      console.error('Delete display position error:', error);
    }
  }, [deleteDisplayPosition]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Vị trí trưng bày</h1>
              <p className="text-gray-500 mt-1">Quản lý các vị trí trưng bày hiện vật</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Tổng vị trí</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                {pagination.totalItems.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Layout className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Vị trí hoạt động</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {displayPositions.filter(pos => pos.isActive && !pos.isDeleted).length}
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
              <p className="text-gray-500 text-sm font-medium">Vị trí bảo trì</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {displayPositions.filter(pos => !pos.isActive && !pos.isDeleted).length}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm vị trí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Lọc theo khu vực..."
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-600">Bao gồm đã xóa</span>
          </label>
        </div>
      </div>

      {/* Display Positions Table */}
      <DisplayPositionTable
        displayPositions={displayPositions}
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
        areaName={areaName}
        setAreaName={setAreaName}
        includeDeleted={includeDeleted}
        setIncludeDeleted={setIncludeDeleted}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        createDisplayPosition={createDisplayPosition}
        updateDisplayPosition={updateDisplayPosition}
        areas={areas.map(area => ({ id: area.id, name: area.name }))}
      />
    </div>
  );
}
