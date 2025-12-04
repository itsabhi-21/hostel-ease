'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeaveList } from '@/components/leave/LeaveList';
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

export default function LeavePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isStudent } = useRole();
  const { showSuccess } = useNotification();
  const [leaves, setLeaves] = useState([]);
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
      fetchLeaves();
    }
  }, [currentPage, user?.id]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params - students only see their own leaves
      let queryParams = `page=${currentPage}&limit=6`;
      if (isStudent && user?.id) {
        queryParams += `&studentId=${user.id}`;
      }

      // Real API call with pagination (6 items per page)
      const response = await api.get(`${API_ENDPOINTS.LEAVES}?${queryParams}`);
      setLeaves(response.data.data || []);
      
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setError('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApprove = async (leaveId) => {
    try {
      await api.put(API_ENDPOINTS.APPROVE_LEAVE(leaveId), {
        approvedBy: user?.name || 'Warden'
      });
      setLeaves((prev) => prev.map((l) => (l.id === leaveId ? { ...l, status: 'APPROVED' } : l)));
      showSuccess('Leave application approved');
    } catch (err) {
      console.error('Error approving leave:', err);
      showSuccess('Failed to approve leave', 'error');
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await api.put(API_ENDPOINTS.REJECT_LEAVE(leaveId), {
        rejectionReason: 'Not approved',
        approvedBy: user?.name || 'Warden'
      });
      setLeaves((prev) => prev.map((l) => (l.id === leaveId ? { ...l, status: 'REJECTED', rejectionReason: 'Not approved' } : l)));
      showSuccess('Leave application rejected');
    } catch (err) {
      console.error('Error rejecting leave:', err);
      showSuccess('Failed to reject leave', 'error');
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Leave Applications</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isStudent ? 'Manage your leave requests' : 'Review and approve leave applications'}
              </p>
            </div>
            {isStudent && (
              <Button className="gap-2" onClick={() => router.push(ROUTES.NEW_LEAVE)}>
                <Plus className="h-4 w-4" />
                Apply for Leave
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
              <LeaveList
                leaves={leaves}
                role={user?.role}
                onApprove={!isStudent ? handleApprove : null}
                onReject={!isStudent ? handleReject : null}
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
