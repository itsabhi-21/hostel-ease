'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken, getToken, removeToken, setUser, getUser, removeUser, clearAuth } from '@/lib/auth';
import { getDashboardRoute } from '@/constants/routes';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const savedUser = getUser();
      
      if (token && savedUser) {
        setUserState(savedUser);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      const { token, user: userData } = response.data;

      // Store token and user data
      setToken(token);
      setUser(userData);
      setUserState(userData);

      // Redirect to role-appropriate dashboard
      const dashboardRoute = getDashboardRoute(userData.role);
      router.push(dashboardRoute);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password, role = 'STUDENT') => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(API_ENDPOINTS.SIGNUP, { name, email, password, role });
      const { token, user: userData } = response.data;

      // Store token and user data
      setToken(token);
      setUser(userData);
      setUserState(userData);

      // Redirect to role-appropriate dashboard
      const dashboardRoute = getDashboardRoute(userData.role);
      router.push(dashboardRoute);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint (optional, for server-side cleanup)
      await api.post(API_ENDPOINTS.LOGOUT).catch(() => {
        // Ignore errors, we're logging out anyway
      });
    } finally {
      // Clear local auth data
      clearAuth();
      setUserState(null);
      setError(null);
      
      // Redirect to login
      router.push('/login');
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ME);
      const userData = response.data.user;
      
      setUser(userData);
      setUserState(userData);
      
      return userData;
    } catch (err) {
      // If refresh fails, logout
      logout();
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
