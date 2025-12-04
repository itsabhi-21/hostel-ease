'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute.jsx';
import { DashboardLayout } from '@/components/layout/DashboardLayout.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { LoadingSpinner } from '@/components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '@/components/common/ErrorMessage.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import api from '@/lib/api';
import { API_ENDPOINTS, PAYMENT_METHODS } from '@/constants/apiEndpoints';
import { ROUTES } from '@/constants/routes';
import { formatDateReadable, formatCurrency } from '@/lib/validators';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';

function FeePaymentDetailsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    transactionId: '',
    paymentMethod: 'UPI',
    paidDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchPayment();
  }, [params.id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.FEE_PAYMENT_BY_ID(params.id));
      setPayment(response.data.data);
    } catch (err) {
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.put(API_ENDPOINTS.PAY_FEE(params.id), paymentData);
      setShowPaymentForm(false);
      fetchPayment();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
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
      <span className={`px-3 py-1 text-sm font-semibold rounded ${styles[status] || styles.PENDING}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading && !payment) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Payment not found" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(ROUTES.FEE_PAYMENTS)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Payments
      </Button>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Fee Payment Details</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Payment ID: {payment.id}
              </p>
            </div>
            {getStatusBadge(payment.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Fee Type
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {payment.feeType.replace(/_/g, ' ')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Amount
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(payment.amount)}
              </p>
            </div>

            {user?.role !== 'STUDENT' && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Student Name
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {payment.studentName}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Room Number
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {payment.roomNumber || 'Not Assigned'}
                  </p>
                </div>
              </>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Due Date
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatDateReadable(payment.dueDate)}
              </p>
            </div>

            {payment.paidDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Paid Date
                </h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatDateReadable(payment.paidDate)}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Semester
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {payment.semester}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Academic Year
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {payment.academicYear}
              </p>
            </div>

            {payment.transactionId && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Transaction ID
                </h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {payment.transactionId}
                </p>
              </div>
            )}

            {payment.paymentMethod && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Payment Method
                </h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {payment.paymentMethod.replace(/_/g, ' ')}
                </p>
              </div>
            )}

            {payment.remarks && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Remarks
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {payment.remarks}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {payment.status === 'PENDING' && user?.role !== 'STUDENT' && (
        <Card>
          <CardHeader>
            <CardTitle>Mark as Paid</CardTitle>
          </CardHeader>
          <CardContent>
            {!showPaymentForm ? (
              <Button onClick={() => setShowPaymentForm(true)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            ) : (
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    placeholder="Enter transaction ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    {Object.keys(PAYMENT_METHODS).map((method) => (
                      <option key={method} value={method}>
                        {method.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={paymentData.paidDate}
                    onChange={(e) => setPaymentData({ ...paymentData, paidDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner size="sm" /> : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Payment
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPaymentForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function FeePaymentDetailsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <FeePaymentDetailsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
