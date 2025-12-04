'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { VisitorList } from '@/components/visitors/VisitorList';
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

export default function VisitorsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isStudent } = useRole();
  const { showSuccess } = useNotification();
  const [visitors, setVisitors] = useState([]);
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
    if (user?.id) {
      fetchVisitors();
    }
  }, [currentPage, user?.id]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params - students only see their own visitors
      let queryParams = `page=${currentPage}&limit=6`;
      if (isStudent && user?.id) {
        queryParams += `&studentId=${user.id}`;
      }

      // Real API call with pagination (6 items per page)
      const response = await api.get(`${API_ENDPOINTS.VISITORS}?${queryParams}`);
      setVisitors(response.data.data || []);
      
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkExit = async (visitorId) => {
    try {
      await api.put(API_ENDPOINTS.MARK_VISITOR_EXIT(visitorId));
      setVisitors((prev) =>
        prev.map((v) => (v.id === visitorId ? { ...v, exitTime: new Date().toISOString() } : v))
      );
      showSuccess('Visitor exit marked successfully');
    } catch (err) {
      console.error('Error marking visitor exit:', err);
      showSuccess('Failed to mark visitor exit', 'error');
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Visitors</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isStudent ? 'Manage your visitor registrations' : 'Monitor visitor entries and exits'}
              </p>
            </div>
            {isStudent && (
              <Button className="gap-2" onClick={() => router.push(ROUTES.NEW_VISITOR)}>
                <Plus className="h-4 w-4" />
                Register Visitor
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
              <VisitorList visitors={visitors} role={user?.role} onMarkExit={!isStudent ? handleMarkExit : null} />
              
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
