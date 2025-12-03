// Email validation
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Phone validation (supports various formats)
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's between 10-15 digits (international format)
  return cleaned.length >= 10 && cleaned.length <= 15;
}

// Password validation (min 8 chars, at least one letter and one number)
export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
}

// Required field validation
export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

// Date validation
export function validateDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Check if date1 is before date2
export function isDateBefore(date1, date2) {
  return new Date(date1) < new Date(date2);
}

// Check if date1 is after date2
export function isDateAfter(date1, date2) {
  return new Date(date1) > new Date(date2);
}

// Check if two date ranges overlap
export function datesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  
  return s1 <= e2 && s2 <= e1;
}

// Format date to YYYY-MM-DD
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format date to readable string
export function formatDateReadable(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Format datetime to readable string
export function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format currency
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
