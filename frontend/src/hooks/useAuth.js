'use client';

import { useAuth as useAuthContext } from '@/context/AuthContext';

// Re-export useAuth hook for convenience
export function useAuth() {
  return useAuthContext();
}

// Hook to check if user has specific role
export function useRole() {
  const { user } = useAuthContext();
  
  return {
    role: user?.role || null,
    isAdmin: user?.role === 'ADMIN',
    isWarden: user?.role === 'WARDEN',
    isStudent: user?.role === 'STUDENT',
    isStaff: user?.role === 'ADMIN' || user?.role === 'WARDEN',
  };
}

// Hook to require authentication
export function useRequireAuth() {
  const { user, loading } = useAuthContext();
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
