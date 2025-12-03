// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  
  // Rooms
  ROOMS: '/api/rooms',
  ROOM_BY_ID: (id) => `/api/rooms/${id}`,
  ASSIGN_ROOM: '/api/rooms/assign',
  
  // Complaints
  COMPLAINTS: '/api/complaints',
  COMPLAINT_BY_ID: (id) => `/api/complaints/${id}`,
  UPDATE_COMPLAINT_STATUS: (id) => `/api/complaints/${id}/status`,
  
  // Visitors
  VISITORS: '/api/visitors',
  VISITOR_BY_ID: (id) => `/api/visitors/${id}`,
  MARK_VISITOR_EXIT: (id) => `/api/visitors/${id}/exit`,
  
  // Leave
  LEAVES: '/api/leaves',
  LEAVE_BY_ID: (id) => `/api/leaves/${id}`,
  APPROVE_LEAVE: (id) => `/api/leaves/${id}/approve`,
  REJECT_LEAVE: (id) => `/api/leaves/${id}/reject`,
  
  // Mess Menu
  MESS_MENU: '/api/mess-menu',
  MESS_MENU_BY_WEEK: (weekStart) => `/api/mess-menu/${weekStart}`,
  
  // Announcements
  ANNOUNCEMENTS: '/api/announcements',
  ANNOUNCEMENT_BY_ID: (id) => `/api/announcements/${id}`,
  MARK_ANNOUNCEMENT_READ: (id) => `/api/announcements/${id}/read`,
  
  // Fee Payments
  FEE_PAYMENTS: '/api/fee-payments',
  FEE_PAYMENT_BY_ID: (id) => `/api/fee-payments/${id}`,
  FEE_PAYMENT_STATS: '/api/fee-payments/stats',
  PAY_FEE: (id) => `/api/fee-payments/${id}/pay`,
  UPDATE_FEE_STATUS: (id) => `/api/fee-payments/${id}/status`,
  
  // Profile
  PROFILE: '/api/profile',
  UPDATE_PROFILE: '/api/profile',
  CHANGE_PASSWORD: '/api/profile/password',
};

// Complaint categories
export const COMPLAINT_CATEGORIES = {
  MAINTENANCE: 'MAINTENANCE',
  CLEANLINESS: 'CLEANLINESS',
  FOOD: 'FOOD',
  SECURITY: 'SECURITY',
  OTHER: 'OTHER',
};

// Complaint statuses
export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
};

// Room statuses
export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  RESERVED: 'RESERVED',
};

// Leave statuses
export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Announcement priorities
export const ANNOUNCEMENT_PRIORITY = {
  NORMAL: 'NORMAL',
  IMPORTANT: 'IMPORTANT',
  URGENT: 'URGENT',
};

// Meal types
export const MEAL_TYPES = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  SNACKS: 'SNACKS',
  DINNER: 'DINNER',
};

// Days of week
export const DAYS_OF_WEEK = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};

// Fee types
export const FEE_TYPES = {
  HOSTEL_FEE: 'HOSTEL_FEE',
  MESS_FEE: 'MESS_FEE',
  MAINTENANCE_FEE: 'MAINTENANCE_FEE',
  SECURITY_DEPOSIT: 'SECURITY_DEPOSIT',
  CAUTION_DEPOSIT: 'CAUTION_DEPOSIT',
  OTHER: 'OTHER',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  WAIVED: 'WAIVED',
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
  NET_BANKING: 'NET_BANKING',
  CHEQUE: 'CHEQUE',
  DEMAND_DRAFT: 'DEMAND_DRAFT',
};
