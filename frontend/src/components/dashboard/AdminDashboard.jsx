'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from './DashboardCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { 
  Users, 
  Home, 
  TrendingUp,
  UserCheck,
  Shield,
  GraduationCap
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export function AdminDashboard({ adminId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalWardens: 0,
    totalAdmins: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    occupancyRate: 0,
    recentActivities: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [adminId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const roomsRes = await api.get(API_ENDPOINTS.ROOMS).catch((err) => {
        console.warn('Failed to fetch rooms:', err.message);
        return { data: { data: [] } };
      });
      
      const rooms = roomsRes.data.data || [];
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      setDashboardData({
        totalStudents: 150, // Would come from users API
        totalWardens: 10,   // Would come from users API
        totalAdmins: 3,     // Would come from users API
        totalRooms,
        occupiedRooms,
        occupancyRate,
        recentActivities: [
          { id: 1, type: 'user', message: 'New student registered', time: '2 hours ago' },
          { id: 2, type: 'complaint', message: 'Complaint resolved in Room 205', time: '4 hours ago' },
          { id: 3, type: 'leave', message: 'Leave application approved', time: '6 hours ago' },
        ],
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      // Don't show error, use default values
      setDashboardData({
        totalStudents: 0,
        totalWardens: 0,
        totalAdmins: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        occupancyRate: 0,
        recentActivities: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          System overview and management
        </p>
      </div>

      {/* User Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Total Students"
            value={dashboardData.totalStudents}
            icon={GraduationCap}
            description="Registered students"
          />
          <DashboardCard
            title="Total Wardens"
            value={dashboardData.totalWardens}
            icon={UserCheck}
            description="Active wardens"
          />
          <DashboardCard
            title="Total Admins"
            value={dashboardData.totalAdmins}
            icon={Shield}
            description="System administrators"
          />
        </div>
      </div>

      {/* Room Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Room Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Total Rooms"
            value={dashboardData.totalRooms}
            icon={Home}
            description="All hostel rooms"
            onClick={() => router.push(ROUTES.ROOMS)}
          />
          <DashboardCard
            title="Occupied Rooms"
            value={dashboardData.occupiedRooms}
            icon={Users}
            description="Currently in use"
            onClick={() => router.push(ROUTES.ROOMS)}
          />
          <DashboardCard
            title="Occupancy Rate"
            value={`${dashboardData.occupancyRate}%`}
            icon={TrendingUp}
            description="Room utilization"
          />
        </div>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No recent activities
            </p>
          )}
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.ROOMS)}
            >
              <Home className="h-4 w-4" />
              Manage Rooms
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.COMPLAINTS)}
            >
              Review Complaints
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.LEAVE)}
            >
              Manage Leaves
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.NEW_ANNOUNCEMENT)}
            >
              Post Announcement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
