'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { validateRequired, validateDate, isDateBefore } from '@/lib/validators';

export function LeaveForm({ studentId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    destination: '',
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
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.startDate)) {
      newErrors.startDate = 'Start date is required';
    } else if (!validateDate(formData.startDate)) {
      newErrors.startDate = 'Invalid date';
    }

    if (!validateRequired(formData.endDate)) {
      newErrors.endDate = 'End date is required';
    } else if (!validateDate(formData.endDate)) {
      newErrors.endDate = 'Invalid date';
    } else if (isDateBefore(formData.endDate, formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!validateRequired(formData.reason)) {
      newErrors.reason = 'Reason is required';
    }

    if (!validateRequired(formData.destination)) {
      newErrors.destination = 'Destination is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const leaveData = {
        studentId: studentId || userData.id,
        roomNumber: userData.roomNumber || 'N/A',
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        destination: formData.destination
      };

      const response = await fetch('http://localhost:4000/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit leave application');
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setApiError(err.message || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for Leave</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              name="destination"
              placeholder="Where will you be going?"
              value={formData.destination}
              onChange={handleChange}
              disabled={loading}
              className={errors.destination ? 'border-red-500' : ''}
            />
            {errors.destination && <p className="text-sm text-red-600 dark:text-red-400">{errors.destination}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave</Label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              placeholder="Explain the reason for your leave..."
              value={formData.reason}
              onChange={handleChange}
              disabled={loading}
              className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ${errors.reason ? 'border-red-500' : ''}`}
            />
            {errors.reason && <p className="text-sm text-red-600 dark:text-red-400">{errors.reason}</p>}
          </div>

          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? <><LoadingSpinner size="sm" className="mr-2" />Submitting...</> : 'Submit Application'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
