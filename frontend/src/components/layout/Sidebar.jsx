'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Home, 
  MessageSquare, 
  Users, 
  Calendar, 
  UtensilsCrossed, 
  Megaphone,
  User,
  X,
  CreditCard
} from 'lucide-react';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

const navigationItems = {
  [ROLES.STUDENT]: [
    { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'Complaints', href: ROUTES.COMPLAINTS, icon: MessageSquare },
    { name: 'Visitors', href: ROUTES.VISITORS, icon: Users },
    { name: 'Leave Applications', href: ROUTES.LEAVE, icon: Calendar },
    { name: 'Fee Payments', href: ROUTES.FEE_PAYMENTS, icon: CreditCard },
    { name: 'Mess Menu', href: ROUTES.MESS_MENU, icon: UtensilsCrossed },
    { name: 'Announcements', href: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
    { name: 'Profile', href: ROUTES.PROFILE, icon: User },
  ],
  [ROLES.WARDEN]: [
    { name: 'Dashboard', href: '/dashboard/warden', icon: LayoutDashboard },
    { name: 'Rooms', href: ROUTES.ROOMS, icon: Home },
    { name: 'Complaints', href: ROUTES.COMPLAINTS, icon: MessageSquare },
    { name: 'Visitors', href: ROUTES.VISITORS, icon: Users },
    { name: 'Leave Applications', href: ROUTES.LEAVE, icon: Calendar },
    { name: 'Fee Payments', href: ROUTES.FEE_PAYMENTS, icon: CreditCard },
    { name: 'Mess Menu', href: ROUTES.MESS_MENU, icon: UtensilsCrossed },
    { name: 'Announcements', href: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
    { name: 'Profile', href: ROUTES.PROFILE, icon: User },
  ],
  [ROLES.ADMIN]: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Rooms', href: ROUTES.ROOMS, icon: Home },
    { name: 'Complaints', href: ROUTES.COMPLAINTS, icon: MessageSquare },
    { name: 'Visitors', href: ROUTES.VISITORS, icon: Users },
    { name: 'Leave Applications', href: ROUTES.LEAVE, icon: Calendar },
    { name: 'Fee Payments', href: ROUTES.FEE_PAYMENTS, icon: CreditCard },
    { name: 'Mess Menu', href: ROUTES.MESS_MENU, icon: UtensilsCrossed },
    { name: 'Announcements', href: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
    { name: 'Profile', href: ROUTES.PROFILE, icon: User },
  ],
};

export function Sidebar({ role, isOpen, onClose }) {
  const pathname = usePathname();
  const navItems = navigationItems[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        // Close mobile menu on navigation
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-gray-900 dark:bg-gray-700 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
