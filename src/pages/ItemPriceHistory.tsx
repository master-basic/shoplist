import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiFetch } from '@/api/client';
import { Card, Skeleton, EmptyState, Button } from '@/components/ui';
import { PriceChart } from '@/components/PriceChart';
import { formatCurrency } from '@/utils/formatCurrency';
import { useLogRender } from '@/hooks/useLogRender';

interface PriceRecord {
  id: string;
  item_name: string;
  store_name: string;
  unit_price: number;
  purchased_at: string;
}

const ItemPriceHistory: React.FC = () => {
  useLogRender('ItemPriceHistory');
  const [searchParams] = useSearchParams();
  const itemName = searchParams.get('itemName') || '';
  const storeName = searchParams.get('storeName') || '';

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<PriceRecord[]>([]);

  useEffect(() => {
    if (!itemName) { setLoading(false); return; }
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ itemName, limit: '100' });
        if (storeName) params.set('storeName', storeName);
        const res = await apiFetch(`/api/price-history?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setRecords(data.priceHistory || []);
        }
      } catch (err) {
        console.error('Error fetching price history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemName, storeName]);

  const chartData = records
    .map(r => ({ date: r.purchased_at.split('T')[0], price: r.unit_price }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime()
  );

  const allTimeLow = records.length > 0 ? Math.min(...records.map(r => r.unit_price)) : 0;
  const allTimeHigh = records.length > 0 ? Math.max(...records.map(r => r.unit_price)) : 0;
  const allTimeLowRecord = records.length > 0 ? [...records].reduce((min, r) => r.unit_price < min.unit_price ? r : min) : null;
  const allTimeHighRecord = records.length > 0 ? [...records].reduce((max, r) => r.unit_price > max.unit_price ? r : max) : null;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!itemName) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState title="No Item Selected" description="Select an item to view its price history" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Price History: {itemName}</h1>
        <Link to="/reports">
          <Button variant="outline" size="sm">Back to Reports</Button>
        </Link>
      </div>

      {records.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="text-sm text-gray-500">All-Time Low</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(allTimeLow)}</div>
            <div className="text-xs text-gray-400 mt-1">{allTimeLowRecord?.store_name || ''}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500">
            <div className="text-sm text-gray-500">All-Time High</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(allTimeHigh)}</div>
            <div className="text-xs text-gray-400 mt-1">{allTimeHighRecord?.store_name || ''}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="text-sm text-gray-500">Average Price</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(records.reduce((s, r) => s + r.unit_price, 0) / records.length)}</div>
            <div className="text-xs text-gray-400 mt-1">{records.length} purchase records</div>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <PriceChart data={chartData} title="Price Over Time" />
      </Card>

      <Card>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Price Records</h2>
        </div>
        {sortedRecords.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No price data found" description="No price data found for this item" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="pb-3 px-4 font-medium text-gray-600">Store</th>
                  <th className="pb-3 px-4 font-medium text-gray-600 text-right">Price</th>
                  <th className="pb-3 px-4 font-medium text-gray-600 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((r, i) => {
                  const prev = sortedRecords[i + 1];
                  const change = prev && prev.unit_price ? ((r.unit_price - prev.unit_price) / prev.unit_price) * 100 : 0;
                  const isFiniteChange = isFinite(change);
                  return (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{new Date(r.purchased_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-600">{r.store_name}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(r.unit_price)}</td>
                      <td className="py-3 px-4 text-right">
                        {prev && prev.unit_price ? (
                          <span className={`font-medium ${change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                            {change > 0 ? '▲' : change < 0 ? '▼' : '■'} {isFiniteChange ? Math.abs(change).toFixed(1) : '0.0'}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export { ItemPriceHistory };
