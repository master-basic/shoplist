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
                  const change = prev ? ((r.unit_price - prev.unit_price) / prev.unit_price) * 100 : 0;
                  return (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{new Date(r.purchased_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-600">{r.store_name}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(r.unit_price)}</td>
                      <td className="py-3 px-4 text-right">
                        {prev ? (
                          <span className={`font-medium ${change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                            {change > 0 ? '▲' : change < 0 ? '▼' : '■'} {Math.abs(change).toFixed(1)}%
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
