// =====================================================
// GroceryMind - Authentication Utilities
// =====================================================

/**
 * Format email for display
 */
export const formatEmail = (email: string): string => {
  // Hide middle part of email
  const parts = email.split('@');
  const local = parts[0];
  const domain = parts[1];
  
  const dotIndex = local.indexOf('.');
  if (dotIndex > 2) {
    return `${local.substring(0, dotIndex + 2)}${local.substring(dotIndex) + '@' + domain}`;
  }
  
  return `***@${domain}`;
};

/**
 * Generate invite token
 */
export const generateInviteToken = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = 'INVITE_';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Verify invite token format
 */
export const isValidInviteToken = (token: string): boolean => {
  return /^INVITE_[A-Za-z0-9]{12}$/.test(token);
};

/**
 * Generate session ID
 */
export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, format: 'full' | 'short' | 'time' | 'relative' = 'short'): string => {
  const d = new Date(date);
  
  if (format === 'full') {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Relative time
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(d, 'short');
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate random color for avatar
 */
export const getRandomColor = (): string => {
  const colors = [
    '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac',
    '#db2777', '#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8',
    '#dc2626', '#ef4444', '#f87171', '#fb923c', '#fdba74',
    '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc',
    '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Get avatar URL or initials
 */
export const getAvatar = (user: {name: string; avatar?: string}): string => {
  if (user.avatar && user.avatar.trim()) {
    return user.avatar;
  }
  const initials = getUserInitials(user.name);
  const color = getRandomColor();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${color}&color=fff&size=100`;
};

/**
 * Check if date is within range
 */
export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};

/**
 * Calculate days between dates
 */
export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((end.getTime() - start.getTime()) / msPerDay));
};

/**
 * Format price
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format quantity with unit
 */
export const formatQuantity = (quantity: number, unit: string): string => {
  if (quantity === 1) {
    return '1 ' + unit;
  }
  return `${quantity} ${unit}s`;
};

/**
 * Parse quantity from string
 */
export const parseQuantity = (str: string): {quantity: number; unit: string} | null => {
  const match = str.match(/^([\d.,]+)\s*(.*)$/);
  if (match) {
    return {
      quantity: parseFloat(match[1].replace(/,/g, '.')),
      unit: match[2].trim() || 'pcs',
    };
  }
  return null;
};

/**
 * Mask sensitive data
 */
export const maskData = (data: string, visible: number = 4): string => {
  if (data.length <= visible) return '*'.repeat(data.length);
  return data.substring(0, visible) + '*'.repeat(data.length - visible);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | undefined = undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if string is valid email
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Check if string is valid password
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && password.includes('a') && password.includes('A') && password.includes('1') && password.includes('!');
};

/**
 * Generate password reset token
 */
export const generateResetToken = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};