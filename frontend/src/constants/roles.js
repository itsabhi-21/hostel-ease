// User roles
export const ROLES = {
  ADMIN: 'ADMIN',
  WARDEN: 'WARDEN',
  STUDENT: 'STUDENT',
};

// Role display names
export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.WARDEN]: 'Warden',
  [ROLES.STUDENT]: 'Student',
};

// Check if user has admin role
export function isAdmin(role) {
  return role === ROLES.ADMIN;
}

// Check if user has warden role
export function isWarden(role) {
  return role === ROLES.WARDEN;
}

// Check if user has student role
export function isStudent(role) {
  return role === ROLES.STUDENT;
}

// Check if user is staff (admin or warden)
export function isStaff(role) {
  return role === ROLES.ADMIN || role === ROLES.WARDEN;
}
