'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardRoute } from '@/constants/routes';
import { LoadingPage } from '@/components/common/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to role-appropriate dashboard
        const dashboardRoute = getDashboardRoute(user.role);
        router.push(dashboardRoute);
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  return <LoadingPage />;
}
