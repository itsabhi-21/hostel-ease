'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComplaintList } from '@/components/complaints/ComplaintList';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useNotification } from '@/context/NotificationContext';
import { Plus, Filter, Search, X } from 'lucide-react';
import { useAuth, useRole } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import api from '@/lib/api';
import { API_ENDPOINTS, COMPLAINT_STATUS, COMPLAINT_CATEGORIES } from '@/constants/apiEndpoints';

export default function ComplaintsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isStudent } = useRole();
  const { showSuccess } = useNotification();
  const [complaints, setComplaints] = useState([]);
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
    status: '',
    category: '',
    search: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    complaintId: null
  });

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 6);
      
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`${API_ENDPOINTS.COMPLAINTS}?${params}`);
      setComplaints(response.data.data || []);
      
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      // Real API call
      await api.put(API_ENDPOINTS.UPDATE_COMPLAINT_STATUS(complaintId), {
        status: newStatus
      });
      
      // Update local state
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
      );
      
      showSuccess('Complaint status updated successfully');
    } catch (err) {
      console.error('Error updating complaint:', err);
      showSuccess('Failed to update complaint status', 'error');
    }
  };

  const handleDeleteComplaint = (complaintId) => {
    setDeleteDialog({
      isOpen: true,
      complaintId
    });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(API_ENDPOINTS.COMPLAINT_BY_ID(deleteDialog.complaintId));
      
      // Refresh the current page to get updated data
      await fetchComplaints();
      
      showSuccess('Complaint deleted successfully');
    } catch (err) {
      console.error('Error deleting complaint:', err);
      showSuccess('Failed to delete complaint', 'error');
    }
  };

  const handleComplaintClick = (complaintId) => {
    // Don't navigate, just expand the card
    console.log('Complaint clicked:', complaintId);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Complaints
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isStudent ? 'View and manage your complaints' : 'Review and resolve student complaints'}
              </p>
            </div>
            {isStudent && (
              <Button 
                className="gap-2"
                onClick={() => router.push(ROUTES.NEW_COMPLAINT)}
              >
                <Plus className="h-4 w-4" />
                New Complaint
              </Button>
            )}
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">All Statuses</option>
                {Object.keys(COMPLAINT_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">All Categories</option>
                {Object.keys(COMPLAINT_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(filters.status || filters.category || filters.search) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ status: '', category: '', search: '' })}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
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
              <ComplaintList
                complaints={complaints}
                role={user?.role}
                onComplaintClick={handleComplaintClick}
                onStatusChange={!isStudent ? handleStatusChange : null}
                onDelete={handleDeleteComplaint}
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
          onClose={() => setDeleteDialog({ isOpen: false, complaintId: null })}
          onConfirm={confirmDelete}
          title="Delete Complaint"
          message="Are you sure you want to delete this complaint? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
