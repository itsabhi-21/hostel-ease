'use client';

import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WardenDashboard } from '@/components/dashboard/WardenDashboard';
import { ROLES } from '@/constants/roles';

export default function WardenDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[ROLES.WARDEN]}>
      <DashboardLayout>
        <WardenDashboard wardenId={user?.id} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
