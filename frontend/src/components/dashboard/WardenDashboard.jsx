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
  Users,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { formatDateTime } from '@/lib/validators';

export function WardenDashboard({ wardenId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    pendingComplaints: 0,
    pendingLeaves: 0,
    totalStudents: 0,
    recentVisitors: [],
    urgentComplaints: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [wardenId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const complaintsRes = await api.get(API_ENDPOINTS.COMPLAINTS).catch((err) => {
        console.warn('Failed to fetch complaints:', err.message);
        return { data: { data: [] } };
      });

      const leavesRes = await api.get(API_ENDPOINTS.LEAVES).catch((err) => {
        console.warn('Failed to fetch leaves:', err.message);
        return { data: { data: [] } };
      });

      const visitorsRes = await api.get(API_ENDPOINTS.VISITORS).catch((err) => {
        console.warn('Failed to fetch visitors:', err.message);
        return { data: { data: [] } };
      });

      const complaints = complaintsRes.data.data || [];
      const leaves = leavesRes.data.data || [];
      const visitors = visitorsRes.data.data || [];

      setDashboardData({
        pendingComplaints: complaints.filter(c => c.status === 'PENDING').length,
        pendingLeaves: leaves.filter(l => l.status === 'PENDING').length,
        totalStudents: 150, // This would come from an API
        recentVisitors: visitors.slice(0, 5),
        urgentComplaints: complaints.filter(c => c.priority === 'URGENT' && c.status === 'PENDING').slice(0, 3),
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      // Don't show error, use default values
      setDashboardData({
        pendingComplaints: 0,
        pendingLeaves: 0,
        totalStudents: 0,
        recentVisitors: [],
        urgentComplaints: [],
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
          Warden Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage hostel operations and student requests
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Pending Complaints"
          value={dashboardData.pendingComplaints}
          icon={MessageSquare}
          description="Requires attention"
          onClick={() => router.push(ROUTES.COMPLAINTS)}
        />
        <DashboardCard
          title="Pending Leave Requests"
          value={dashboardData.pendingLeaves}
          icon={Calendar}
          description="Awaiting approval"
          onClick={() => router.push(ROUTES.LEAVE)}
        />
        <DashboardCard
          title="Total Students"
          value={dashboardData.totalStudents}
          icon={UserCheck}
          description="Under your supervision"
        />
      </div>

      {/* Urgent Complaints */}
      {dashboardData.urgentComplaints.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Urgent Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.urgentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {complaint.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Room {complaint.roomNumber} - {complaint.studentName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`${ROUTES.COMPLAINTS}/${complaint.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Visitors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Visitor Entries
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(ROUTES.VISITORS)}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recentVisitors.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {visitor.visitorName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Visiting: {visitor.studentName} (Room {visitor.roomNumber})
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Entry: {formatDateTime(visitor.entryTime)}
                    </p>
                  </div>
                  {!visitor.exitTime && (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No recent visitors
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => router.push(ROUTES.ROOMS)}
            >
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
