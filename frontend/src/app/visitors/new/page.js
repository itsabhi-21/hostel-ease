'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { VisitorForm } from '@/components/visitors/VisitorForm';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/context/NotificationContext';
import { ArrowLeft } from 'lucide-react';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export default function NewVisitorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess } = useNotification();

  const handleSuccess = () => {
    showSuccess('Visitor registered successfully');
    router.push(ROUTES.VISITORS);
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.VISITORS)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Register Visitor</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new visitor entry</p>
            </div>
          </div>
          <VisitorForm studentId={user?.id} onSuccess={handleSuccess} onCancel={() => router.push(ROUTES.VISITORS)} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
