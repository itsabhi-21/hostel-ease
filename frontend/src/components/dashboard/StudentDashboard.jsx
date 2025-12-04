'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from './DashboardCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { 
  MessageSquare, 
  Calendar, 
  Megaphone, 
  Home,
  Plus,
  Users,
  CreditCard
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { formatDateReadable } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';

export function StudentDashboard({ userId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    roomNumber: null,
    wardenName: null,
    complaintsCount: 0,
    leaveCount: 0,
    announcementsCount: 0,
    pendingFeesCount: 0,
    recentAnnouncements: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data with individual error handling - don't let one failure break everything
      const complaintsRes = await api.get(API_ENDPOINTS.COMPLAINTS).catch((err) => {
        console.warn('Failed to fetch complaints:', err.message);
        return { data: { data: [] } };
      });

      const leavesRes = await api.get(API_ENDPOINTS.LEAVES).catch((err) => {
        console.warn('Failed to fetch leaves:', err.message);
        return { data: { data: [] } };
      });

      const announcementsRes = await api.get(API_ENDPOINTS.ANNOUNCEMENTS).catch((err) => {
        console.warn('Failed to fetch announcements:', err.message);
        return { data: { data: [] } };
      });

      const feePaymentsRes = await api.get(`${API_ENDPOINTS.FEE_PAYMENTS}?studentId=${userId}`).catch((err) => {
        console.warn('Failed to fetch fee payments:', err.message);
        return { data: { data: [] } };
      });

      setDashboardData({
        roomNumber: user?.roomNumber || 'Not Assigned',
        wardenName: 'Mr. Smith', // This would come from user profile
        complaintsCount: complaintsRes.data.data?.length || 0,
        leaveCount: leavesRes.data.data?.filter(l => l.status === 'PENDING').length || 0,
        announcementsCount: announcementsRes.data.data?.filter(a => !a.read).length || 0,
        pendingFeesCount: feePaymentsRes.data.data?.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').length || 0,
        recentAnnouncements: announcementsRes.data.data?.slice(0, 3) || [],
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      // Don't show error, just use default values
      setDashboardData({
        roomNumber: user?.roomNumber || 'Not Assigned',
        wardenName: 'Mr. Smith',
        complaintsCount: 0,
        leaveCount: 0,
        announcementsCount: 0,
        pendingFeesCount: 0,
        recentAnnouncements: [],
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Welcome Back, {user?.name || 'Student'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Here's what's happening in your hostel
        </p>
      </div>

      {/* Room Info Card */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Home className="h-6 w-6" />
            Your Room Information
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Room Number</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.roomNumber || dashboardData.roomNumber || 'Not Assigned'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Warden</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {dashboardData.wardenName || 'Not Assigned'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Pending Complaints"
          value={dashboardData.complaintsCount}
          icon={MessageSquare}
          description="Click to view all complaints"
          onClick={() => router.push(ROUTES.COMPLAINTS)}
        />
        <DashboardCard
          title="Active Leave Applications"
          value={dashboardData.leaveCount}
          icon={Calendar}
          description="Click to view leave status"
          onClick={() => router.push(ROUTES.LEAVE)}
        />
        <DashboardCard
          title="Unread Announcements"
          value={dashboardData.announcementsCount}
          icon={Megaphone}
          description="Click to view announcements"
          onClick={() => router.push(ROUTES.ANNOUNCEMENTS)}
        />
        <DashboardCard
          title="Pending Fees"
          value={dashboardData.pendingFeesCount}
          icon={CreditCard}
          description="Click to view fee payments"
          onClick={() => router.push(ROUTES.FEE_PAYMENTS)}
        />
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.NEW_COMPLAINT)}
            >
              <Plus className="h-4 w-4" />
              New Complaint
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.NEW_VISITOR)}
            >
              <Plus className="h-4 w-4" />
              Register Visitor
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.NEW_LEAVE)}
            >
              <Plus className="h-4 w-4" />
              Apply for Leave
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.MESS_MENU)}
            >
              <Users className="h-4 w-4" />
              View Mess Menu
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.FEE_PAYMENTS)}
            >
              <CreditCard className="h-4 w-4" />
              View Fee Payments
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span>Recent Announcements</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(ROUTES.ANNOUNCEMENTS)}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          {dashboardData.recentAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {announcement.content}
                      </p>
                    </div>
                    {announcement.priority === 'URGENT' && (
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formatDateReadable(announcement.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No announcements yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
