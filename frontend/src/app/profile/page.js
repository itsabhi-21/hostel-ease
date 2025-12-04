'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Home, Camera, Key } from 'lucide-react';
import { ROLE_NAMES } from '@/constants/roles';
import { validateEmail, validatePassword, validateRequired } from '@/lib/validators';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showSuccess } = useNotification();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return userData.profileImage || user?.profileImage || null;
    }
    return user?.profileImage || null;
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setApiError('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!validateRequired(formData.name)) newErrors.name = 'Name is required';
    if (!validateRequired(formData.email)) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!validateRequired(passwordData.currentPassword)) newErrors.currentPassword = 'Current password is required';
    if (!validateRequired(passwordData.newPassword)) newErrors.newPassword = 'New password is required';
    else if (!validatePassword(passwordData.newPassword)) newErrors.newPassword = 'Password must be at least 8 characters with a letter and number';
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      // Save profile data including image to localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.name = formData.name;
      userData.email = formData.email;
      
      if (imagePreview) {
        userData.profileImage = imagePreview;
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      await refreshUser();
      showSuccess('Profile updated successfully');
      setEditMode(false);
      
      // Force a re-render to show the new image
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setApiError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    } catch (err) {
      setApiError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information</p>
          </div>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <div className="flex gap-2">
                  {!editMode && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setShowPasswordModal(true)}>
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button size="sm" onClick={() => setEditMode(true)}>Edit Profile</Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {apiError && <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />}
                  
                  {/* Profile Image Upload */}
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <label htmlFor="profile-image" className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                          <Camera className="h-4 w-4 text-white" />
                          <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Upload a profile picture (max 5MB)
                        </p>
                        <div className="flex gap-2">
                          <label htmlFor="profile-image-button">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => document.getElementById('profile-image').click()}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Choose Photo
                            </Button>
                          </label>
                          {imagePreview && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={handleRemoveImage}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setEditMode(false)} disabled={loading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? <><LoadingSpinner size="sm" className="mr-2" />Saving...</> : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Profile Image Display */}
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ROLE_NAMES[user?.role]}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user?.email}</p>
                      </div>
                    </div>
                    {user?.role === 'STUDENT' && (
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Room Number</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{user?.roomNumber || '101'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Change Modal */}
          {showPasswordModal && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowPasswordModal(false);
                }
              }}
            >
              <Card className="w-full max-w-md bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {apiError && <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />}
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        className={errors.currentPassword ? 'border-red-500' : ''}
                      />
                      {errors.currentPassword && <p className="text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        className={errors.newPassword ? 'border-red-500' : ''}
                      />
                      {errors.newPassword && <p className="text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errors.confirmPassword && <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)} disabled={loading}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? <><LoadingSpinner size="sm" className="mr-2" />Changing...</> : 'Change Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
