'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, User } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { ROLE_NAMES } from '@/constants/roles';

export function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                HostelEase
              </h1>
            </div>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* User info - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ROLE_NAMES[user.role]}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-900 dark:bg-gray-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                </div>

                {/* Mobile user avatar */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="sm:hidden h-10 w-10 rounded-full bg-gray-900 dark:bg-gray-600 flex items-center justify-center text-white font-semibold overflow-hidden"
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </button>

                {/* Logout button - desktop */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile user menu */}
      {showUserMenu && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-900 dark:bg-gray-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {ROLE_NAMES[user.role]}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
