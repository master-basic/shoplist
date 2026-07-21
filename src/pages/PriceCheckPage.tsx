import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Input, Badge, Spinner, EmptyState } from '@/components/ui';
import { API_BASE } from '@/config';
import { authHeaders } from '@/api/client';
import { PRODUCT_CATALOG } from '@/data/productCatalog';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { useLogRender } from '@/hooks/useLogRender';

type TabType = 'compare' | 'history' | 'trends';

interface CompareEntry {
  product_name: string;
  store: string;
  price: number;
  currency: string;
  unit: string;
  checked_at: string;
}

interface HistoryEntry {
  price: number;
  store: string;
  checked_at: string;
}

interface TrendEntry {
  product_name: string;
  store: string;
  current_price: number;
  previous_price: number;
  change_percent: number;
  direction: 'up' | 'down' | 'same';
  checked_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  produce: 'Produce', dairy: 'Dairy', meat: 'Meat', bakery: 'Bakery',
  frozen: 'Frozen', pantry: 'Pantry', beverages: 'Beverages', snacks: 'Snacks',
  household: 'Household', personal_care: 'Personal Care', condiments: 'Condiments',
};

export const PriceCheckPage: React.FC = () => {
  useLogRender('PriceCheckPage');
  const [tab, setTab] = useState<TabType>('compare');
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('All');
  const [stores, setStores] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<CompareEntry[]>([]);
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [trends, setTrends] = useState<TrendEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const seen = new Set<string>();
    return PRODUCT_CATALOG.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }).slice(0, 20);
  }, [search]);

  useEffect(() => {
    fetch(`${API_BASE}/api/price-check/stores`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } })
      .then(r => r.json())
      .then(d => setStores(d.stores || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProduct) { setCompareData([]); setHistoryData([]); return; }
    setLoading(true);
    setError('');

    const h = { 'Content-Type': 'application/json', ...authHeaders() };
    const fetchCompare = fetch(`${API_BASE}/api/price-check/compare?product_name=${encodeURIComponent(selectedProduct)}`, { headers: h })
      .then(r => r.ok ? r.json() : { comparison: [] })
      .then(d => setCompareData(d.comparison || []));

    const fetchHistory = fetch(`${API_BASE}/api/price-check/products/${encodeURIComponent(selectedProduct)}/history`, { headers: h })
      .then(r => r.ok ? r.json() : { history: [] })
      .then(d => setHistoryData(d.history || []));

    const fetchTrends = fetch(`${API_BASE}/api/price-check/trends`, { headers: h })
      .then(r => r.ok ? r.json() : { trends: [] })
      .then(d => setTrends(d.trends || []));

    Promise.all([fetchCompare, fetchHistory, fetchTrends])
      .catch(() => setError('Failed to load price data'))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelectProduct = (name: string) => {
    setSelectedProduct(name);
    setSearch(name);
    setShowSuggestions(false);
  };

  const uniqueStores = [...new Set(compareData.map(d => d.store))];
  const productsByStore = useMemo(() => {
    const map: Record<string, CompareEntry> = {};
    for (const d of compareData) {
      if (!map[d.store] || new Date(d.checked_at) > new Date(map[d.store].checked_at)) {
        map[d.store] = d;
      }
    }
    return map;
  }, [compareData]);

  const minPrice = Math.min(...Object.values(productsByStore).map(p => p.price), Infinity);
  const chartData = useMemo(() => {
    const grouped: Record<string, Record<string, string | number>> = {};
    for (const h of historyData) {
      const key = h.checked_at.split('T')[0];
      if (!grouped[key]) grouped[key] = { date: key };
      grouped[key][h.store] = h.price;
    }
    return Object.values(grouped).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [historyData]);

  const storeColors: Record<string, string> = { Bravo: '#22c55e', Araz: '#3b82f6' };

  const trendFiltered = useMemo(() => {
    let items = trends;
    if (selectedStore !== 'All') items = items.filter(t => t.store === selectedStore);
    return items.sort((a, b) => Math.abs(b.change_percent) - Math.abs(a.change_percent));
  }, [trends, selectedStore]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Price Check</h1>
          <p className="text-sm text-gray-500">Compare prices across stores and track history</p>
        </div>
      </div>

      {/* Search */}
      <div ref={searchRef} className="relative">
        <Input
          placeholder="Search for a product..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && filteredProducts.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredProducts.map(p => (
              <button
                key={p.name}
                className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm flex justify-between items-center"
                onClick={() => handleSelectProduct(p.name)}
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-400 text-xs">{CATEGORY_LABELS[p.category] || p.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      {selectedProduct && (
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {(['compare', 'history', 'trends'] as TabType[]).map(t => (
            <button
              key={t}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow text-green-700' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setTab(t)}
            >
              {t === 'compare' ? 'Store Comparison' : t === 'history' ? 'Price History' : 'Trends'}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!selectedProduct && !loading && (
        <EmptyState
          title="Select a Product"
          description="Search for a product above to see price comparisons across stores."
        />
      )}

      {/* Compare Tab */}
      {selectedProduct && tab === 'compare' && !loading && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedProduct}
              <span className="text-sm font-normal text-gray-400 ml-2">— Current Prices</span>
            </h2>
          </div>
          {uniqueStores.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No price data available yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {uniqueStores.map(store => {
                const entry = productsByStore[store];
                const isCheapest = entry && entry.price === minPrice;
                return (
                  <div key={store} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${storeColors[store] || '#999'}`} style={{ backgroundColor: storeColors[store] || '#999' }} />
                      <span className="font-medium text-gray-700">{store}</span>
                      {isCheapest && <Badge variant="success">Best Price</Badge>}
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${isCheapest ? 'text-green-600' : 'text-gray-700'}`}>
                        {entry?.price.toFixed(2)} AZN
                      </span>
                      {entry?.unit && <span className="text-xs text-gray-400 ml-1">/{entry.unit}</span>}
                      <div className="text-xs text-gray-400">
                        {entry?.checked_at ? new Date(entry.checked_at).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* History Tab */}
      {selectedProduct && tab === 'history' && !loading && (
        <Card>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedProduct} — Price History
            </h2>
          </div>
          {chartData.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No history data yet</div>
          ) : (
            <>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} tickFormatter={(v) => `${v.toFixed(2)}`} />
                    <Tooltip formatter={(value) => `${Number(value).toFixed(2)} AZN`} />
                    <Legend />
                    {uniqueStores.map(store => (
                      <Line
                        key={store}
                        type="monotone"
                        dataKey={store}
                        stroke={storeColors[store] || '#888'}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {historyData.sort((a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()).map((h, i) => {
                  const next = historyData.find(x => x.store === h.store && new Date(x.checked_at) < new Date(h.checked_at));
                  const change = next ? ((h.price - next.price) / next.price * 100) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: storeColors[h.store] || '#999' }} />
                        <span className="text-gray-600">{h.store}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{h.price.toFixed(2)} AZN</span>
                        {next && (
                          <span className={`text-xs font-medium ${change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                            {change > 0 ? '▲' : change < 0 ? '▼' : '■'} {Math.abs(change).toFixed(1)}%
                          </span>
                        )}
                        <span className="text-gray-400 text-xs">{new Date(h.checked_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>
      )}

      {/* Trends Tab */}
      {selectedProduct && tab === 'trends' && !loading && (
        <Card>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Price Trends</h2>
            <select
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            >
              <option value="All">All Stores</option>
              {stores.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {trendFiltered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No trend data available</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {trendFiltered.slice(0, 50).map((t, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: storeColors[t.store] || '#999' }} />
                    <div>
                      <span className="font-medium text-gray-800">{t.product_name}</span>
                      <span className="text-xs text-gray-400 ml-2">{t.store}</span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-sm">
                      <span className="text-gray-400 line-through mr-1">{t.previous_price.toFixed(2)}</span>
                      <span className="font-bold">{t.current_price.toFixed(2)} AZN</span>
                    </div>
                    <Badge variant={t.direction === 'down' ? 'success' : t.direction === 'up' ? 'error' : 'secondary'}>
                      {t.direction === 'down' ? '▼' : t.direction === 'up' ? '▲' : '■'} {Math.abs(t.change_percent).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
