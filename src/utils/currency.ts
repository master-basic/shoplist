export const formatCurrency = (value: number | undefined | null, currency: string = 'USD'): string => {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};