'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoomAssignmentForm } from '@/components/rooms/RoomAssignmentForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useNotification } from '@/context/NotificationContext';
import { ArrowLeft, Home, Users, Edit } from 'lucide-react';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { formatEnumValue } from '@/lib/utils';

export default function RoomDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { showSuccess } = useNotification();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchRoomDetails();
    }
  }, [params.id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockRoom = {
        id: params.id,
        roomNumber: '101',
        floor: 1,
        capacity: 2,
        currentOccupancy: 1,
        status: 'AVAILABLE',
        assignedStudents: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
        ],
      };

      setRoom(mockRoom);
    } catch (err) {
      setError('Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSuccess = () => {
    showSuccess('Student assigned successfully');
    setShowAssignForm(false);
    fetchRoomDetails();
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WARDEN]}>
        <DashboardLayout>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !room) {
    return (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WARDEN]}>
        <DashboardLayout>
          <ErrorMessage message={error || 'Room not found'} />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WARDEN]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(ROUTES.ROOMS)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Room {room.roomNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Floor {room.floor}
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Room
            </Button>
          </div>

          {/* Room Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Room Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Room Number</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {room.roomNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Floor</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {room.floor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {room.capacity} students
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Occupancy</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {room.currentOccupancy} / {room.capacity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatEnumValue(room.status)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Assigned Students
                  </span>
                  {room.currentOccupancy < room.capacity && room.status === 'AVAILABLE' && (
                    <Button
                      size="sm"
                      onClick={() => setShowAssignForm(true)}
                    >
                      Assign Student
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {room.assignedStudents && room.assignedStudents.length > 0 ? (
                  <div className="space-y-3">
                    {room.assignedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.email}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No students assigned yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Assignment Form */}
          {showAssignForm && (
            <RoomAssignmentForm
              roomId={room.id}
              room={room}
              onSuccess={handleAssignmentSuccess}
              onCancel={() => setShowAssignForm(false)}
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
