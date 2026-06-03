// =====================================================
// GroceryMind - Utility Functions
// =====================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'AZN'): string {
  return new Intl.NumberFormat('en-AZ', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options || { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(d);
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined = undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate random color for items
export function getRandomColor(): string {
  const colors = [
    'bg-red-100 text-red-800',
    'bg-orange-100 text-orange-800',
    'bg-amber-100 text-amber-800',
    'bg-green-100 text-green-800',
    'bg-emerald-100 text-emerald-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800',
    'bg-sky-100 text-sky-800',
    'bg-blue-100 text-blue-800',
    'bg-indigo-100 text-indigo-800',
    'bg-violet-100 text-violet-800',
    'bg-purple-100 text-purple-800',
    'bg-fuchsia-100 text-fuchsia-800',
    'bg-pink-100 text-pink-800',
    'bg-rose-100 text-rose-800',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Categorize item
export function categorizeItem(itemName: string): string {
  const lowerName = itemName.toLowerCase();
  
  if (['milk', 'cheese', 'butter', 'cream', 'yogurt', 'kefir', 'sour cream'].some(w => lowerName.includes(w))) {
    return 'dairy';
  }
  if (['eggs', 'chicken', 'beef', 'pork', 'lamb', 'fish', 'seafood', 'shrimp', 'salmon'].some(w => lowerName.includes(w))) {
    return 'meat';
  }
  if (['bread', 'bun', 'roll', 'pastry', 'cookie', 'cake', 'muffin', 'pizza'].some(w => lowerName.includes(w))) {
    return 'bakery';
  }
  if (['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'watermelon', 'pineapple', 'lemon', 'lime'].some(w => lowerName.includes(w))) {
    return 'produce';
  }
  if (['rice', 'pasta', 'noodle', 'oat', 'bread', 'flour', 'sugar', 'honey'].some(w => lowerName.includes(w))) {
    return 'pantry';
  }
  if (['cleaning', 'soap', 'shampoo', 'toothpaste', 'tissue', 'paper', 'detergent', 'disinfectant'].some(w => lowerName.includes(w))) {
    return 'household';
  }
  if (['oil', 'vinegar', 'salt', 'pepper', 'spice', 'sauce', 'ketchup', 'mustard', 'mayonnaise'].some(w => lowerName.includes(w))) {
    return 'pantry';
  }
  if (['coffee', 'tea', 'cocoa', 'chocolate', 'snack', 'cracker', 'chip'].some(w => lowerName.includes(w))) {
    return 'snack';
  }
  
  return 'other';
}

// Check if item matches category
export function itemMatchesCategory(itemName: string, category: string): boolean {
  return categorizeItem(itemName) === category;
}

// Get category icon
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    produce: '🥬',
    dairy: '🧀',
    meat: '🥩',
    bakery: '🍞',
    pantry: '🍚',
    household: '🧹',
    snack: '🍿',
    frozen: '🍦',
    other: '📦',
  };
  return icons[category] || icons.other;
}

// Parse receipt data (basic implementation)
export function parseReceiptText(text: string): { store: string; items: Array<{ name: string; price: number; quantity: number }>; total: number } {
  const result: { store: string; items: Array<{ name: string; price: number; quantity: number }>; total: number } = {
    store: '',
    items: [],
    total: 0,
  };
  
  // Extract store name (first few lines)
  const lines = text.split('\n');
  if (lines.length > 0) {
    result.store = lines[0].trim().substring(0, 50);
  }
  
  // Extract total
  const totalMatch = text.match(/Total[:\s]+([\d,]+\.?\d*)/i);
  if (totalMatch) {
    result.total = parseFloat(totalMatch[1].replace(/,/g, ''));
  }
  
  // Extract items (simplified - in production use proper OCR parsing)
  const itemPattern = /([\w\s]+?)\s+([\d\.]+)\s*([₸$€£₽])/g;
  let match;
  while ((match = itemPattern.exec(text)) !== null) {
    result.items.push({
      name: match[1].trim(),
      price: parseFloat(match[2]),
      quantity: parseFloat(match[2]),
    });
  }
  
  return result;
}

// Get category color
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    produce: 'bg-green-500',
    dairy: 'bg-blue-500',
    meat: 'bg-red-500',
    bakery: 'bg-amber-500',
    pantry: 'bg-yellow-500',
    household: 'bg-purple-500',
    snack: 'bg-orange-500',
    frozen: 'bg-cyan-500',
    other: 'bg-gray-500',
  };
  return colors[category] || colors.other;
}