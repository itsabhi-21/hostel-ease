'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { API_ENDPOINTS, PAYMENT_STATUS, FEE_TYPES } from '@/constants/apiEndpoints';
import { ROUTES } from '@/constants/routes';
import { formatDateReadable, formatCurrency } from '@/lib/validators';
import { 
  CreditCard, 
  Plus, 
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

function FeePaymentsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    feeType: '',
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (user?.role === 'STUDENT') {
        params.append('studentId', user.id);
      }
      if (filters.status) params.append('status', filters.status);
      if (filters.feeType) params.append('feeType', filters.feeType);
      
      const response = await api.get(`${API_ENDPOINTS.FEE_PAYMENTS}?${params}`);
      setPayments(response.data.data || []);
    } catch (err) {
      setError('Failed to load fee payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (user?.role === 'STUDENT') {
        params.append('studentId', user.id);
      }
      
      const response = await api.get(`${API_ENDPOINTS.FEE_PAYMENT_STATS}?${params}`);
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      PARTIALLY_PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      WAIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status] || styles.PENDING}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getFeeTypeLabel = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading && !payments.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Fee Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and track your fee payments
          </p>
        </div>
        {user?.role !== 'STUDENT' && (
          <Button onClick={() => router.push(ROUTES.NEW_FEE_PAYMENT)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Fee Payment
          </Button>
        )}
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(stats.paidAmount)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.totalOverdue}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="">All Statuses</option>
              {Object.keys(PAYMENT_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>

            <select
              value={filters.feeType}
              onChange={(e) => setFilters({ ...filters, feeType: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="">All Fee Types</option>
              {Object.keys(FEE_TYPES).map((type) => (
                <option key={type} value={type}>
                  {getFeeTypeLabel(type)}
                </option>
              ))}
            </select>

            {(filters.status || filters.feeType) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ status: '', feeType: '' })}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No fee payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Fee Type
                    </th>
                    {user?.role !== 'STUDENT' && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Student
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Semester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {getFeeTypeLabel(payment.feeType)}
                      </td>
                      {user?.role !== 'STUDENT' && (
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          <div>
                            <div className="font-medium">{payment.studentName}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              Room: {payment.roomNumber || 'N/A'}
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {formatDateReadable(payment.dueDate)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {payment.semester} - {payment.academicYear}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(ROUTES.FEE_PAYMENT_DETAILS(payment.id))}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FeePaymentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <FeePaymentsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
