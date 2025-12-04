'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useNotification } from '@/context/NotificationContext';
import { ArrowLeft } from 'lucide-react';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { validateRequired } from '@/lib/validators';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { showSuccess } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'NORMAL',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(formData.title)) newErrors.title = 'Title is required';
    if (!validateRequired(formData.content)) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess('Announcement posted successfully');
      router.push(ROUTES.ANNOUNCEMENTS);
    } catch (err) {
      setApiError('Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WARDEN]}>
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.ANNOUNCEMENTS)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">New Announcement</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Post a new announcement</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Announcement Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {apiError && <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />}

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Announcement title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={loading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="content"
                    name="content"
                    rows={6}
                    placeholder="Announcement content..."
                    value={formData.content}
                    onChange={handleChange}
                    disabled={loading}
                    className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ${errors.content ? 'border-red-500' : ''}`}
                  />
                  {errors.content && <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>}
                </div>

                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => router.push(ROUTES.ANNOUNCEMENTS)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <><LoadingSpinner size="sm" className="mr-2" />Posting...</> : 'Post Announcement'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
