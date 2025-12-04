'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { validateRequired, validatePhone } from '@/lib/validators';

export function VisitorForm({ studentId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorContact: '',
    purpose: '',
    expectedDuration: '2',
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

    if (!validateRequired(formData.visitorName)) {
      newErrors.visitorName = 'Visitor name is required';
    }

    if (!validateRequired(formData.visitorContact)) {
      newErrors.visitorContact = 'Contact number is required';
    } else if (!validatePhone(formData.visitorContact)) {
      newErrors.visitorContact = 'Please enter a valid phone number';
    }

    if (!validateRequired(formData.purpose)) {
      newErrors.purpose = 'Purpose of visit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSuccess) onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to register visitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Visitor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />}

          <div className="space-y-2">
            <Label htmlFor="visitorName">Visitor Name</Label>
            <Input
              id="visitorName"
              name="visitorName"
              placeholder="Enter visitor's full name"
              value={formData.visitorName}
              onChange={handleChange}
              disabled={loading}
              className={errors.visitorName ? 'border-red-500' : ''}
            />
            {errors.visitorName && <p className="text-sm text-red-600 dark:text-red-400">{errors.visitorName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitorContact">Contact Number</Label>
            <Input
              id="visitorContact"
              name="visitorContact"
              placeholder="+1234567890"
              value={formData.visitorContact}
              onChange={handleChange}
              disabled={loading}
              className={errors.visitorContact ? 'border-red-500' : ''}
            />
            {errors.visitorContact && <p className="text-sm text-red-600 dark:text-red-400">{errors.visitorContact}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <textarea
              id="purpose"
              name="purpose"
              rows={3}
              placeholder="Reason for visiting..."
              value={formData.purpose}
              onChange={handleChange}
              disabled={loading}
              className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ${errors.purpose ? 'border-red-500' : ''}`}
            />
            {errors.purpose && <p className="text-sm text-red-600 dark:text-red-400">{errors.purpose}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDuration">Expected Duration (hours)</Label>
            <Input
              id="expectedDuration"
              name="expectedDuration"
              type="number"
              min="1"
              max="24"
              value={formData.expectedDuration}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? <><LoadingSpinner size="sm" className="mr-2" />Registering...</> : 'Register Visitor'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
