import { Badge } from './ui';

interface StockBadgeProps {
  threshold: number | null;
  lastBoughtAt?: string | null;
}

export function StockBadge({ threshold, lastBoughtAt }: StockBadgeProps) {
  if (threshold == null) return null;

  const daysSinceLastBought = lastBoughtAt
    ? Math.floor((Date.now() - new Date(lastBoughtAt).getTime()) / (1000 * 60 * 60 * 24))
    : Infinity;

  if (daysSinceLastBought > threshold) {
    return <Badge variant="error" size="sm">Low stock</Badge>;
  }
  if (daysSinceLastBought > threshold / 2) {
    return <Badge variant="warning" size="sm">Running low</Badge>;
  }
  return <Badge variant="success" size="sm">In stock</Badge>;
}
