import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { getUserLists } from '@/api/lists';
import { CATEGORIES } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';

const API_BASE = 'http://localhost:3001';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const ReportsPage: React.FC = () => {
  const { user, lists, addList } = useStore();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('90');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const fetchedLists = await getUserLists(user.id);
        for (const list of fetchedLists) {
          const existing = lists.find((l) => l.id === list.id);
          if (!existing) addList(list);
        }
        const [historyRes, alertsRes] = await Promise.all([
          fetch(`${API_BASE}/api/price-history?limit=500`),
          fetch(`${API_BASE}/api/price-history/alerts?userId=${user.id}&threshold=5`)
        ]);
        if (historyRes.ok) {
          const data = await historyRes.json();
          setPriceHistory(data.priceHistory || []);
        }
        if (alertsRes.ok) {
          const data = await alertsRes.json();
          setAlerts(data.alerts || []);
        }
      } catch (err) {
        console.error('Error fetching report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));

  const filteredHistory = priceHistory.filter(
    (h: any) => new Date(h.purchased_at || h.created_at) >= cutoffDate
  );

  const totalSpent = filteredHistory.reduce((sum: number, h: any) => sum + (h.unit_price || 0) * (h.quantity || 1), 0);
  const totalItems = filteredHistory.reduce((sum: number, h: any) => sum + (h.quantity || 1), 0);
  const avgPrice = totalItems > 0 ? totalSpent / totalItems : 0;

  const byStore = filteredHistory.reduce((acc: Record<string, number>, h: any) => {
    const store = h.store_name || 'Unknown';
    acc[store] = (acc[store] || 0) + (h.unit_price || 0) * (h.quantity || 1);
    return acc;
  }, {});
  const storeData = Object.entries(byStore)
    .map(([name, total]) => ({ name, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);

  const byItem = filteredHistory.reduce((acc: Record<string, { total: number; count: number }>, h: any) => {
    const name = h.item_name || 'Unknown';
    if (!acc[name]) acc[name] = { total: 0, count: 0 };
    acc[name].total += (h.unit_price || 0) * (h.quantity || 1);
    acc[name].count += h.quantity || 1;
    return acc;
  }, {});
  const itemData = Object.entries(byItem)
    .map(([name, v]) => ({ name, total: Math.round(v.total * 100) / 100, count: v.count }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const byDate = filteredHistory.reduce((acc: Record<string, number>, h: any) => {
    const date = (h.purchased_at || h.created_at || '').split('T')[0];
    if (date) acc[date] = (acc[date] || 0) + (h.unit_price || 0) * (h.quantity || 1);
    return acc;
  }, {});
  const trendData = Object.entries(byDate)
    .map(([date, total]) => ({ date, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const byCategory = filteredHistory.reduce((acc: Record<string, number>, h: any) => {
    const name = (h.item_name || '').toLowerCase();
    let cat = 'Other';
    for (const c of CATEGORIES) {
      if (name.includes(c.toLowerCase())) { cat = c; break; }
    }
    acc[cat] = (acc[cat] || 0) + (h.unit_price || 0) * (h.quantity || 1);
    return acc;
  }, {});
  const categoryData = Object.entries(byCategory)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState title="Please Log In" description="Log in to view reports" icon="📊" actionLabel="Go to Login" onAction={() => window.location.href = '/login'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Spending Reports</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
            <option value="9999">All time</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalSpent)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Items Purchased</p>
            <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Avg Price/Item</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(avgPrice)}</p>
          </Card>
        </div>

        {alerts.length > 0 && (
          <Card className="mb-6 p-4 border-amber-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">⚠️ Price Alerts</h2>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.itemName} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{alert.itemName}</p>
                    <p className="text-xs text-gray-500">at {alert.store}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${alert.direction === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                      {alert.direction === 'up' ? '↑' : '↓'} {Math.abs(alert.changePercent)}%
                    </p>
                    <p className="text-xs text-gray-500">{alert.currentPrice.toFixed(2)} vs avg {alert.averagePrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Store</h2>
            {storeData.length === 0 ? (
              <EmptyState title="No data" description="Purchase history will appear here" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={storeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v) || 0)} />
                  <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h2>
            {categoryData.length === 0 ? (
              <EmptyState title="No data" description="Add items with categories to see this chart" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v) || 0)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending Trend</h2>
          {trendData.length === 0 ? (
            <EmptyState title="No data" description="Purchase history will appear here" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => formatCurrency(Number(v) || 0)} />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Items by Spending</h2>
          {itemData.length === 0 ? (
            <EmptyState title="No data" description="Purchase history will appear here" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-gray-600">Item</th>
                    <th className="pb-2 font-medium text-gray-600">Times Bought</th>
                    <th className="pb-2 font-medium text-gray-600 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {itemData.map((item, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 font-medium text-gray-800">{item.name}</td>
                      <td className="py-2 text-gray-600">{item.count}</td>
                      <td className="py-2 text-gray-800 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export { ReportsPage };
