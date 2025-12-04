'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnnouncementList } from '@/components/announcements/AnnouncementList';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Pagination } from '@/components/common/Pagination';
import { useNotification } from '@/context/NotificationContext';
import { Plus } from 'lucide-react';
import { useAuth, useRole } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export default function AnnouncementsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isStaff } = useRole();
  const { showSuccess } = useNotification();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 6
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [currentPage]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      // Real API call with pagination (6 items per page)
      const response = await api.get(`${API_ENDPOINTS.ANNOUNCEMENTS}?page=${currentPage}&limit=6`);
      setAnnouncements(response.data.data || []);
      
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkRead = async (announcementId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Update the announcement to mark as read
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === announcementId 
            ? { ...ann, read: true } 
            : ann
        )
      );
      
      showSuccess('Marked as read');
    } catch (err) {
      showSuccess('Failed to mark as read', 'error');
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Announcements</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isStaff ? 'Manage hostel announcements' : 'Stay updated with hostel news'}
              </p>
            </div>
            {isStaff && (
              <Button className="gap-2" onClick={() => router.push(ROUTES.NEW_ANNOUNCEMENT)}>
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          ) : (
            <>
              <AnnouncementList announcements={announcements} role={user?.role} onMarkRead={handleMarkRead} />
              
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
