'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { validateRequired } from '@/lib/validators';

export function RoomAssignmentForm({ roomId, room, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentEmail: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.studentEmail)) {
      newErrors.studentEmail = 'Student email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    // Check if room is full
    if (room && room.currentOccupancy >= room.capacity) {
      setApiError('This room is at full capacity');
      return;
    }

    // Check if room is available
    if (room && room.status !== 'AVAILABLE') {
      setApiError(`Cannot assign students to a room with status: ${room.status}`);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In real implementation:
      // await api.post(API_ENDPOINTS.ASSIGN_ROOM, {
      //   roomId,
      //   studentEmail: formData.studentEmail,
      // });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to assign student to room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Student to Room {room?.roomNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />
          )}

          {room && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Occupancy:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {room.currentOccupancy} / {room.capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {room.status}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="studentEmail">Student Email</Label>
            <Input
              id="studentEmail"
              name="studentEmail"
              type="email"
              placeholder="student@example.com"
              value={formData.studentEmail}
              onChange={handleChange}
              disabled={loading}
              className={errors.studentEmail ? 'border-red-500' : ''}
            />
            {errors.studentEmail && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.studentEmail}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the email address of the student to assign to this room
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Assigning...
                </>
              ) : (
                'Assign Student'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
