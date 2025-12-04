// Token management
export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

// User data management
export function setUser(user) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function removeUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

// Clear all auth data
export function clearAuth() {
  removeToken();
  removeUser();
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getToken();
}

// Get user role
export function getUserRole() {
  const user = getUser();
  return user?.role || null;
}
