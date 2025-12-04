'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessMenuDisplay } from '@/components/mess/MessMenuDisplay';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export default function MessMenuPage() {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    fetchMenu();
  }, [weekStart]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock menu data
      const mockMenu = [
        { day: 'MONDAY', mealType: 'BREAKFAST', items: ['Idli', 'Sambar', 'Chutney', 'Tea'] },
        { day: 'MONDAY', mealType: 'LUNCH', items: ['Rice', 'Dal', 'Roti', 'Vegetable Curry'] },
        { day: 'MONDAY', mealType: 'SNACKS', items: ['Samosa', 'Tea'] },
        { day: 'MONDAY', mealType: 'DINNER', items: ['Chapati', 'Paneer Curry', 'Rice'] },
        { day: 'TUESDAY', mealType: 'BREAKFAST', items: ['Poha', 'Tea', 'Banana'] },
        { day: 'TUESDAY', mealType: 'LUNCH', items: ['Rice', 'Rajma', 'Roti', 'Salad'] },
        { day: 'TUESDAY', mealType: 'SNACKS', items: ['Pakora', 'Coffee'] },
        { day: 'TUESDAY', mealType: 'DINNER', items: ['Fried Rice', 'Manchurian', 'Soup'] },
      ];

      setMenu(mockMenu);
    } catch (err) {
      setError('Failed to load mess menu');
    } finally {
      setLoading(false);
    }
  };

  const handleWeekChange = (days) => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + days);
    setWeekStart(getMonday(newDate));
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mess Menu</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View weekly meal schedule</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          ) : (
            <MessMenuDisplay weekStart={weekStart} menu={menu} onWeekChange={handleWeekChange} />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
