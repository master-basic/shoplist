import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Card, EmptyState, SkeletonCard } from '@/components/ui';
import { getUserLists } from '@/api/lists';
import { CATEGORIES } from '@/types';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

import { API_BASE } from '@/config';

const ReportsPage: React.FC = () => {
  const { user, lists, addList } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'reports' | 'purchases'>(location.pathname === '/purchases' ? 'purchases' : 'reports');
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('90');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const fetchedLists = await getUserLists(user.id);
        for (const list of fetchedLists) {
          const existing = lists.find((l) => l.id === list.id);
          if (!existing) addList(list);
        }
        const [historyRes, alertsRes, sessionsRes] = await Promise.all([
          fetch(`${API_BASE}/api/price-history?limit=500`),
          fetch(`${API_BASE}/api/price-history/alerts?userId=${user.id}&threshold=5`),
          fetch(`${API_BASE}/api/purchase-sessions/user/${user.id}`)
        ]);
        if (historyRes.ok) {
          const data = await historyRes.json();
          setPriceHistory(data.priceHistory || []);
        }
        if (alertsRes.ok) {
          const data = await alertsRes.json();
          setAlerts(data.alerts || []);
        }
        if (sessionsRes.ok) {
          const data = await sessionsRes.json();
          setSessions(data.sessions || []);
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

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState title="Please Log In" description="Log in to view reports" icon="📊" actionLabel="Go to Login" onAction={() => window.location.href = '/login'} />
      </div>
    );
  }

  const totalSpentSessions = sessions.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Spending</h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => { setTab('reports'); navigate('/reports'); }} className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${tab === 'reports' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>Reports</button>
              <button onClick={() => { setTab('purchases'); navigate('/purchases'); }} className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${tab === 'purchases' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>Purchase History</button>
            </div>
          </div>
          {tab === 'reports' && (
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
          )}
        </div>

        {tab === 'purchases' ? (
          <>
            <div className="mb-6">
              <p className="text-gray-500">{sessions.length} purchases · {formatCurrency(totalSpentSessions)} total</p>
            </div>
            {sessions.length === 0 ? (
              <Card><EmptyState title="No Purchases Yet" description="Complete a shopping session to see your purchase history" icon="🛍️" /></Card>
            ) : (
              <div className="space-y-3">
                {sessions.map((session: any) => {
                  const storeName = (session.name || '').replace('Purchase - ', '');
                  const isExpanded = expandedId === session.id;
                  return (
                    <Card key={session.id} className="overflow-hidden">
                      <button onClick={() => setExpandedId(isExpanded ? null : session.id)} className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">🏪</div>
                          <div>
                            <p className="font-semibold text-gray-800">{storeName || 'Unknown Store'}</p>
                            <p className="text-sm text-gray-500">{new Date(session.created_at).toLocaleDateString()} · {session.items?.length || 0} items</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-green-600">{formatCurrency(session.total_amount || 0)}</span>
                          <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </button>
                      {isExpanded && session.items && (
                        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                          <table className="w-full text-sm">
                            <thead><tr className="text-gray-500 border-b border-gray-200"><th className="text-left pb-2 font-medium">Item</th><th className="text-right pb-2 font-medium">Qty</th><th className="text-right pb-2 font-medium">Price</th><th className="text-right pb-2 font-medium">Total</th></tr></thead>
                            <tbody>
                              {session.items.map((item: any) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                  <td className="py-2 text-gray-800">{item.name}</td>
                                  <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                                  <td className="py-2 text-right text-gray-600">{formatCurrency(item.unit_price)}</td>
                                  <td className="py-2 text-right font-medium">{formatCurrency(item.total_price)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <React.Fragment>
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
          </React.Fragment>
      )}
    </div>
    </div>
  );
};

export { ReportsPage };
