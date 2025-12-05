'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoomList } from '@/components/rooms/RoomList';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useNotification } from '@/context/NotificationContext';
import { Plus } from 'lucide-react';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export default function RoomsPage() {
  const router = useRouter();
  const { showSuccess } = useNotification();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 6
  });
  const [filters, setFilters] = useState({
    floor: '',
    status: '',
    availability: '',
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    roomId: null
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    roomNumber: '',
    floor: '1',
    capacity: '2',
    type: 'SHARED'
  });

  useEffect(() => {
    fetchRooms();
  }, [currentPage]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Real API call with pagination (6 items per page)
      const response = await api.get(`${API_ENDPOINTS.ROOMS}?page=${currentPage}&limit=6`);
      setRooms(response.data.data || []);
      
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoomClick = (roomId) => {
    // Don't navigate, just expand the card
    console.log('Room clicked:', roomId);
  };

  const handleDeleteRoom = (roomId) => {
    setDeleteDialog({
      isOpen: true,
      roomId
    });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(API_ENDPOINTS.ROOM_BY_ID(deleteDialog.roomId));
      
      // Refresh the current page to get updated data
      await fetchRooms();
      
      showSuccess('Room deleted successfully');
    } catch (err) {
      console.error('Error deleting room:', err);
      showSuccess('Failed to delete room', 'error');
    }
  };

  const handleUpdateRoom = async (roomId, updates) => {
    try {
      await api.put(API_ENDPOINTS.ROOM_BY_ID(roomId), updates);
      await fetchRooms(); // Refresh the list
      showSuccess('Room updated successfully');
    } catch (err) {
      console.error('Error updating room:', err);
      showSuccess('Failed to update room', 'error');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Convert strings to numbers for API
      const roomData = {
        ...createFormData,
        floor: parseInt(createFormData.floor),
        capacity: parseInt(createFormData.capacity)
      };
      await api.post(API_ENDPOINTS.ROOMS, roomData);
      showSuccess('Room created successfully');
      setShowCreateModal(false);
      setCreateFormData({
        roomNumber: '',
        floor: '1',
        capacity: '2',
        type: 'SHARED'
      });
      fetchRooms();
    } catch (err) {
      console.error('Error creating room:', err);
      showSuccess('Failed to create room', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WARDEN]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Room Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage hostel rooms and assignments
              </p>
            </div>
            <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Add Room
            </Button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          ) : (
            <>
              <RoomList
                rooms={rooms}
                onRoomClick={handleRoomClick}
                filters={filters}
                onFilterChange={setFilters}
                onDelete={handleDeleteRoom}
                onUpdate={handleUpdateRoom}
              />
              
              {pagination.total > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, roomId: null })}
          onConfirm={confirmDelete}
          title="Delete Room"
          message="Are you sure you want to delete this room? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create New Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.roomNumber}
                    onChange={(e) => setCreateFormData({ ...createFormData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Floor *
                  </label>
                  <input
                    type="number"
                    required
                    value={createFormData.floor}
                    onChange={(e) => setCreateFormData({ ...createFormData, floor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="4"
                    value={createFormData.capacity}
                    onChange={(e) => setCreateFormData({ ...createFormData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Room Type *
                  </label>
                  <select
                    required
                    value={createFormData.type}
                    onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="SINGLE">Single</option>
                    <option value="SHARED">Shared</option>
                    <option value="SUITE">Suite</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateFormData({
                        roomNumber: '',
                        floor: '1',
                        capacity: '2',
                        type: 'SHARED'
                      });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Room'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
