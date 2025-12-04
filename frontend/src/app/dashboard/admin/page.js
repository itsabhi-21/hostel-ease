'use client';

import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ROLES } from '@/constants/roles';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <DashboardLayout>
        <AdminDashboard adminId={user?.id} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
