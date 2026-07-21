import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { API_BASE } from '@/config';
import { authHeaders } from '@/api/client';
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

export const usePriceHistory = (itemName?: string) => {
  const { currentHouseholdId } = useStore();
  
  const queryClient = useQueryClient();
  
  const loadPriceHistory = async (targetName: string, storeName?: string) => {
    const params = new URLSearchParams();
    if (targetName) params.append('itemName', targetName);
    if (storeName) params.append('store', storeName);
    if (currentHouseholdId) params.append('householdId', currentHouseholdId);
    params.append('limit', '100');

    const response = await fetch(`${API_BASE}/api/price-history?${params.toString()}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
    if (!response.ok) throw new Error('Failed to load price history');
    const data = await response.json();
    return data.priceHistory || [];
  };

  const getStatisticsQuery = useQuery({
    queryKey: ['priceHistoryStats', itemName],
    queryFn: async () => {
      if (!itemName) throw new Error('Item name required');
      const response = await fetch(`${API_BASE}/api/price-history/stats?itemName=${encodeURIComponent(itemName)}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
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
    enabled: !!itemName,
  });

  const priceHistoryQuery = useQuery({
    queryKey: ['priceHistory', itemName],
    queryFn: () => loadPriceHistory(itemName || ''),
  });



  const priceAlertsQuery = useQuery({
    queryKey: ['priceAlerts'],
    queryFn: async () => {
      // Implementation for checkPriceAlerts
      return [];
    },
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

  const addPriceEntryMutation = useMutation({
    mutationFn: async (data: { itemName: string; storeName: string; price: number }) => {
      const response = await fetch(`${API_BASE}/api/price-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add price entry');
      return response.json();
    },
  });

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
        .replace(/\s+/g, ' ')
        .trim();
    },
  };
};
