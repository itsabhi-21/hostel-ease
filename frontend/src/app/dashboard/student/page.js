'use client';

import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { ROLES } from '@/constants/roles';

export default function StudentDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
      <DashboardLayout>
        <StudentDashboard userId={user?.id} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
