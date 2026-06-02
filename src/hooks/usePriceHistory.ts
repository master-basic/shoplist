// =====================================================
// GroceryMind - Price History Hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useStore } from '@/store/useStore';
import type { PriceHistoryItem } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const usePriceHistory = () => {
  const { currentHouseholdId } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  // Load price history for an item
  const loadPriceHistory = useCallback(async (itemName: string, storeName?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const query = supabase
        .from('price_history')
        .select('*')
        .ilike('item_name', itemName)
        .order('purchased_at', { ascending: false });
      
      if (storeName) {
        query.eq('store_name', storeName);
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      
      if (data) {
        setPriceHistory(data);
      }
    } catch (err) {
      console.error('Error loading price history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load price history');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get price trend
  const getPriceTrend = useCallback((currentPrice: number, previousPrice: number): PriceTrend => {
    if (!previousPrice || previousPrice === 0) {
      return {
        change: 0,
        percentage: 0,
        indicator: '-',
        label: 'No previous data',
      };
    }
    
    const change = currentPrice - previousPrice;
    const percentage = (change / previousPrice) * 100;
    
    let indicator = '-';
    let label = '';
    
    if (percentage > 0) {
      indicator = String.fromCharCode(8593); // ↑
      label = 'More expensive';
    } else if (percentage < 0) {
      indicator = String.fromCharCode(8595); // ↓
      label = 'Cheaper';
    }
    
    return {
      change,
      percentage,
      indicator,
      label,
    };
  }, []);

  // Check for price change alerts
  const checkPriceAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .order('purchased_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const alerts: PriceAlert[] = [];
        
        for (let i = 1; i < data.length; i++) {
          const current = data[i - 1];
          const previous = data[i];
          
          if (previous.unit_price > 0) {
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
        
        setPriceAlerts(alerts);
      }
    } catch (err) {
      console.error('Error checking price alerts:', err);
    }
  }, []);

  // Add price history entry
  const addPriceEntry = async (entry: Omit<PriceHistoryItem, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('price_history')
        .insert([entry]);
      
      if (error) throw error;
      
      await checkPriceAlerts();
    } catch (err) {
      console.error('Error adding price entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to add price entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get statistics
  const getStatistics = useCallback(async (itemName: string) => {
    try {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .ilike('item_name', itemName)
        .order('purchased_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return null;
      }
      
      const prices = data.map(d => d.unit_price);
      const stores = new Set(data.map(d => d.store_name));
      
      // Calculate statistics
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      
      // Get cheapest store
      const cheapestEntry = data.find(d => d.unit_price === minPrice);
      
      return {
        count: data.length,
        stores: Array.from(stores),
        minPrice,
        maxPrice,
        avgPrice,
        cheapestStore: cheapestEntry?.store_name,
        cheapestPrice: minPrice,
        mostRecent: data[0],
      };
    } catch (err) {
      console.error('Error getting statistics:', err);
      throw err;
    }
  }, []);

  // Normalize item name
  const normalizeItemName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/brand|marca|marque/g, '')
      .replace(/store|shop/g, '')
      .replace(/\d+\s*(ml|cl|l|kg|g|oz|lbs|pcs|pieces)/g, '1 unit')
      .trim();
  };

  return {
    priceHistory,
    priceAlerts,
    loading,
    error,
    loadPriceHistory,
    getPriceTrend,
    checkPriceAlerts,
    addPriceEntry,
    getStatistics,
    normalizeItemName,
  };
};

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
