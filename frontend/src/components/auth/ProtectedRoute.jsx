'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push(ROUTES.HOME);
        return;
      }

      // If role restrictions exist, check if user has allowed role
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push(ROUTES.UNAUTHORIZED);
      }
    }
  }, [user, loading, allowedRoles, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render children
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}

// HOC for protecting pages
export function withAuth(Component, allowedRoles = []) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
