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
            <Button className="gap-2">
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
