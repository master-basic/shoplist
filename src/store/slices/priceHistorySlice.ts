import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { PriceHistoryItem } from '@/types';
import log from '@/utils/debug';

export interface PriceHistorySlice {
  priceHistory: PriceHistoryItem[];
  addPriceHistory: (item: PriceHistoryItem) => void;
  getPriceHistory: (itemName: string, days?: number) => PriceHistoryItem[];
}

export const createPriceHistorySlice: StateCreator<PriceHistorySlice, [], [], PriceHistorySlice> = (set, get) => ({
  priceHistory: [],
  addPriceHistory: (item) => {
    log.info('Store addPriceHistory', { itemName: item.item_name, unitPrice: item.unit_price });
    set({ priceHistory: [...get().priceHistory, { ...item, id: uuidv4() }] });
  },
  getPriceHistory: (itemName, days = 90) => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const results = get().priceHistory.filter((item) => { const itemDate = new Date(item.purchased_at); return item.item_name.toLowerCase().includes(itemName.toLowerCase()) && itemDate >= cutoffDate; }).sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());
    log.info('Store getPriceHistory', { itemName, days, resultCount: results.length });
    return results;
  },
});
