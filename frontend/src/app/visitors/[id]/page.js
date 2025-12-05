'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute.jsx';
import { DashboardLayout } from '@/components/layout/DashboardLayout.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { LoadingSpinner } from '@/components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '@/components/common/ErrorMessage.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import { useNotification } from '@/context/NotificationContext.jsx';
import api from '@/lib/api.js';
import { API_ENDPOINTS } from '@/constants/apiEndpoints.js';
import { ROUTES } from '@/constants/routes.js';
import { formatDateReadable } from '@/lib/validators.js';
import { ArrowLeft, Edit2, Trash2, Save, X } from 'lucide-react';

export default function VisitorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { showSuccess } = useNotification();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    purpose: '',
    checkOutTime: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'WARDEN';

  useEffect(() => {
    fetchVisitor();
  }, [params.id]);

  const fetchVisitor = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.VISITOR_BY_ID(params.id));
      setVisitor(response.data.data);
      setFormData({
        visitorName: response.data.data.visitorName,
        visitorPhone: response.data.data.visitorPhone,
        purpose: response.data.data.purpose,
        checkOutTime: response.data.data.checkOutTime || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visitor details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.put(API_ENDPOINTS.VISITOR_BY_ID(params.id), formData);
      showSuccess('Visitor updated successfully');
      setEditMode(false);
      fetchVisitor();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update visitor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this visitor record?')) return;
    
    try {
      await api.delete(API_ENDPOINTS.VISITOR_BY_ID(params.id));
      showSuccess('Visitor deleted successfully');
      router.push(ROUTES.VISITORS);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete visitor');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.put(API_ENDPOINTS.VISITOR_BY_ID(params.id), {
        ...formData,
        checkOutTime: new Date().toISOString(),
        status: 'CHECKED_OUT'
      });
      showSuccess('Visitor checked out successfully');
      fetchVisitor();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check out visitor');
    }
  };

  if (loading && !visitor) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <LoadingSpinner />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(ROUTES.VISITORS)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Visitor Details
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  View and manage visitor information
                </p>
              </div>
            </div>
            
            {isStaff && !editMode && (
              <div className="flex gap-2">
                {visitor?.status === 'CHECKED_IN' && (
                  <Button onClick={handleCheckOut}>
                    Check Out
                  </Button>
                )}
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

          {/* Visitor Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editMode ? 'Edit Visitor Information' : 'Visitor Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="visitorName">Visitor Name *</Label>
                      <Input
                        id="visitorName"
                        value={formData.visitorName || ''}
                        onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="visitorPhone">Phone Number *</Label>
                      <Input
                        id="visitorPhone"
                        value={formData.visitorPhone || ''}
                        onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="purpose">Purpose *</Label>
                      <Input
                        id="purpose"
                        value={formData.purpose || ''}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          visitorName: visitor.visitorName,
                          visitorPhone: visitor.visitorPhone,
                          purpose: visitor.purpose,
                          checkOutTime: visitor.checkOutTime || ''
                        });
                      }}
                      disabled={submitting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      <Save className="h-4 w-4 mr-2" />
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visitor Name</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {visitor?.visitorName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {visitor?.visitorPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Purpose</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {visitor?.purpose}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Room Number</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {visitor?.roomNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      visitor?.status === 'CHECKED_IN'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {visitor?.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Check-in Time</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {visitor?.checkInTime ? formatDateReadable(visitor.checkInTime) : 'N/A'}
                    </p>
                  </div>

                  {visitor?.checkOutTime && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Check-out Time</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {formatDateReadable(visitor.checkOutTime)}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {visitor?.studentName || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
