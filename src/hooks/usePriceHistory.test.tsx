import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePriceHistory } from './usePriceHistory';
import { useStore } from '@/store/useStore';

vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('usePriceHistory', () => {
  const createWrapper = () => {
    const qc = new QueryClient({
      defaultQueryFn: () => Promise.resolve(null),
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={qc}>
        {children}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStore).mockReturnValue({
      currentHouseholdId: 'h1',
    } as any);
    
    // Mock global fetch
    global.fetch = vi.fn();
  });

  it('should return trend data correctly', () => {
    const { result } = renderHook(() => usePriceHistory('test'), { wrapper: createWrapper() });
    
    const trend = result.current.getPriceTrend(100, 80);
    expect(trend.change).toBe(20);
    expect(trend.percentage).toBe(25);
    expect(trend.indicator).toBe('↑');
    expect(trend.label).toBe('More expensive');

    const cheaper = result.current.getPriceTrend(80, 100);
    expect(cheaper.change).toBe(-20);
    expect(cheaper.indicator).toBe('↓');
    expect(cheaper.label).toBe('Cheaper');
  });

  it('should normalize item names', () => {
    const { result } = renderHook(() => usePriceHistory('test'), { wrapper: createWrapper() });
    expect(result.current.normalizeItemName('Coca Cola Brand 500ml')).toBe('coca cola 1 unit');
    expect(result.current.normalizeItemName('Store Milk 1kg')).toBe('milk 1 unit');
  });

  it('should fetch statistics when itemName is provided', async () => {
    const mockStats = {
      stats: {
        count: '5',
        min_price: '1.0',
        max_price: '5.0',
        avg_price: '3.0',
        cheapest_store: 'Store A',
        cheapest_price: '1.0',
      }
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockStats,
    });

    const { result } = renderHook(() => usePriceHistory('Milk'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.getStatistics).not.toBeNull();
    });

    expect(result.current.getStatistics?.avgPrice).toBe(3);
    expect(result.current.getStatistics?.cheapestStore).toBe('Store A');
  });
});
