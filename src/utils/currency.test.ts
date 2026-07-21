import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('should format a number as currency', () => {
    expect(formatCurrency(100, 'USD')).toContain('$100.00');
  });

  it('should return — for null or undefined', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(undefined)).toBe('—');
  });
});
