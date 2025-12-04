'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComplaintForm } from '@/components/complaints/ComplaintForm';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/context/NotificationContext';
import { ArrowLeft } from 'lucide-react';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

export default function NewComplaintPage() {
  const router = useRouter();
  const { showSuccess } = useNotification();

  const handleSuccess = () => {
    showSuccess('Complaint submitted successfully');
    router.push(ROUTES.COMPLAINTS);
  };

  const handleCancel = () => {
    router.push(ROUTES.COMPLAINTS);
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(ROUTES.COMPLAINTS)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                New Complaint
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Report an issue or concern
              </p>
            </div>
          </div>

          {/* Form */}
          <ComplaintForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
