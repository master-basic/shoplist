import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { API_BASE } from '@/config';
import type { PriceHistoryItem } from '@/types';

export interface PriceAlert {
  item_name: string;
  store_name: string;
  current_price: number;
  previous_price: number;
  percentage: number;
  current_date: string;
  previous_date: string;
}

export interface PriceTrend {
  change: number;
  percentage: number;
  indicator: string;
  label: string;
}

export const usePriceHistory = () => {
  const { currentHouseholdId } = useStore();

  const queryClient = useQueryClient();

  const loadPriceHistory = async (itemName: string, storeName?: string) => {
    const params = new URLSearchParams();
    if (itemName) params.append('itemName', itemName);
    if (storeName) params.append('store', storeName);
    params.append('limit', '100');

    const response = await fetch(`${API_BASE}/api/price-history?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to load price history');
    const data = await response.json();
    return data.priceHistory || [];
  };

  const checkPriceAlerts = async () => {
    const response = await fetch(`${API_BASE}/api/price-history?limit=200`);
    if (!response.ok) throw new Error('Failed to check price alerts');
    const data = await response.json();
    const history = data.priceHistory || [];
    const alerts: PriceAlert[] = [];

    for (let i = 1; i < history.length; i++) {
      const current = history[i - 1];
      const previous = history[i];
      if (previous.unit_price > 0 && current.item_name === previous.item_name) {
        const percentage = ((current.unit_price - previous.unit_price) / previous.unit_price) * 100;
        if (percentage >= 5) {
          alerts.push({
            item_name: current.item_name,
            store_name: current.store_name,
            current_price: current.unit_price,
            previous_price: previous.unit_price,
            percentage,
            current_date: current.purchased_at,
            previous_date: previous.purchased_at,
          });
        }
      }
    }
    return alerts;
  };

  const addPriceEntryMutation = useMutation({
    mutationFn: async (entry: Omit<PriceHistoryItem, 'id' | 'created_at'>) => {
      const response = await fetch(`${API_BASE}/api/price-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to add price entry');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceHistory'] });
    },
  });

  const getStatisticsQuery = useQuery({
    queryKey: ['priceHistoryStats', 'itemName'],
    queryFn: async (context) => {
      const itemName = context.queryKey[2] as string;
      const response = await fetch(`${API_BASE}/api/price-history/stats?itemName=${encodeURIComponent(itemName)}`);
      if (!response.ok) throw new Error('Failed to get statistics');
      const data = await response.json();
      const stats = data.stats;
      return {
        count: parseInt(stats.count) || 0,
        stores: stats.stores || [],
        minPrice: parseFloat(stats.min_price) || 0,
        maxPrice: parseFloat(stats.max_price) || 0,
        avgPrice: parseFloat(stats.avg_price) || 0,
        cheapestStore: stats.cheapest_store,
        cheapestPrice: parseFloat(stats.cheapest_price) || 0,
        mostRecent: null,
      };
    },
  });

  const priceHistoryQuery = useQuery({
    queryKey: ['priceHistory'],
    queryFn: () => loadPriceHistory(''),
  });

  const priceAlertsQuery = useQuery({
    queryKey: ['priceAlerts'],
    queryFn: checkPriceAlerts,
    refetchInterval: 5 * 60 * 1000,
  });

  const getPriceTrend = (currentPrice: number, previousPrice: number): PriceTrend => {
    if (!previousPrice || previousPrice === 0) {
      return { change: 0, percentage: 0, indicator: '-', label: 'No previous data' };
    }
    const change = currentPrice - previousPrice;
    const percentage = (change / previousPrice) * 100;
    let indicator = '-';
    let label = '';
    if (percentage > 0) {
      indicator = String.fromCharCode(8593);
      label = 'More expensive';
    } else if (percentage < 0) {
      indicator = String.fromCharCode(8595);
      label = 'Cheaper';
    }
    return { change, percentage, indicator, label };
  };

  const addPriceEntry = addPriceEntryMutation.mutate;

  return {
    priceHistory: priceHistoryQuery.data || [],
    priceAlerts: priceAlertsQuery.data || [],
    loading: priceHistoryQuery.isLoading,
    error: priceHistoryQuery.error as Error | null,
    loadPriceHistory: loadPriceHistory,
    getPriceTrend,
    checkPriceAlerts: () => queryClient.invalidateQueries({ queryKey: ['priceAlerts'] }),
    addPriceEntry,
    getStatistics: getStatisticsQuery.data || null,
    normalizeItemName: (name: string): string => {
      return name
        .toLowerCase()
        .replace(/brand|marca|marque/g, '')
        .replace(/store|shop/g, '')
        .replace(/\d+\s*(ml|cl|l|kg|g|oz|lbs|pcs|pieces)/g, '1 unit')
        .trim();
    },
  };
};
