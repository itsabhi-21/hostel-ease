// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
};

// Dashboard routes
export const DASHBOARD_ROUTES = {
  STUDENT: '/dashboard/student',
  WARDEN: '/dashboard/warden',
  ADMIN: '/dashboard/admin',
};

// Feature routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Rooms
  ROOMS: '/rooms',
  ROOM_DETAILS: (id) => `/rooms/${id}`,
  
  // Complaints
  COMPLAINTS: '/complaints',
  NEW_COMPLAINT: '/complaints/new',
  COMPLAINT_DETAILS: (id) => `/complaints/${id}`,
  
  // Visitors
  VISITORS: '/visitors',
  NEW_VISITOR: '/visitors/new',
  
  // Leave
  LEAVE: '/leave',
  NEW_LEAVE: '/leave/new',
  
  // Mess Menu
  MESS_MENU: '/mess-menu',
  
  // Announcements
  ANNOUNCEMENTS: '/announcements',
  NEW_ANNOUNCEMENT: '/announcements/new',
  
  // Fee Payments
  FEE_PAYMENTS: '/fee-payments',
  NEW_FEE_PAYMENT: '/fee-payments/new',
  FEE_PAYMENT_DETAILS: (id) => `/fee-payments/${id}`,
  
  // Profile
  PROFILE: '/profile',
  
  // Error pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
};

// Get dashboard route based on role
export function getDashboardRoute(role) {
  switch (role) {
    case 'ADMIN':
      return DASHBOARD_ROUTES.ADMIN;
    case 'WARDEN':
      return DASHBOARD_ROUTES.WARDEN;
    case 'STUDENT':
      return DASHBOARD_ROUTES.STUDENT;
    default:
      return ROUTES.HOME;
  }
}

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.SIGNUP,
  ROUTES.NOT_FOUND,
];

// Check if route is public
export function isPublicRoute(path) {
  return PUBLIC_ROUTES.includes(path);
}
