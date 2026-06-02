// =====================================================
// GroceryMind - Currency Formatting Utilities
// =====================================================

/**
 * Format a number as currency based on the given currency code
 */
export const formatCurrency = (amount: number, currency: string = 'AZN'): string => {
  return new Intl.NumberFormat('en-AZ', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

/**
 * Format a number with commas as thousands separator
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-AZ').format(number);
};

/**
 * Format a date for display
 */
export const formatDate = (date: string | Date, format: string = 'medium'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return d.toLocaleDateString('en-AZ', { month: 'short', day: 'numeric' });
  } else if (format === 'long') {
    return d.toLocaleDateString('en-AZ', { month: 'long', day: 'numeric', year: 'numeric' });
  } else if (format === 'time') {
    return d.toLocaleTimeString('en-AZ', { hour: '2-digit', minute: '2-digit' });
  }
  
  return d.toLocaleDateString('en-AZ', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return formatDate(d, 'short');
};