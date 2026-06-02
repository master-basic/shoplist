import React, { useState, useEffect } from 'react';
import { useStore } from '@store/useStore';
import { formatCurrency } from '@utils/formatCurrency';

const Reports: React.FC = () => {
  const { purchaseSessions, priceHistory } = useStore((state) => ({
    purchaseSessions: state.purchaseSessions,
    priceHistory: state.priceHistory,
  }));
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Calculate spending data
  const getSpendingByCategory = () => {
    const today = new Date();
    const cutoffDate = new Date();
    if (dateRange === '7d') cutoffDate.setDate(today.getDate() - 7);
    else if (dateRange === '30d') cutoffDate.setDate(today.getDate() - 30);
    else if (dateRange === '90d') cutoffDate.setDate(today.getDate() - 90);

    const spending: Record<string, number> = {};
    let total = 0;

    purchaseSessions.forEach((session) => {
      if (new Date(session.purchase_date) >= cutoffDate) {
        session.items.forEach((item) => {
          const category = item.is_on_list ? 'Other' : 'Not on list';
          spending[category] = (spending[category] || 0) + item.total_price;
          total += item.total_price;
        });
      }
    });

    return { spending, total };
  };

  const getSpendingByStore = (): Record<string, number> => {
    const today = new Date();
    const cutoffDate = new Date();
    if (dateRange === '7d') cutoffDate.setDate(today.getDate() - 7);
    else if (dateRange === '30d') cutoffDate.setDate(today.getDate() - 30);
    else if (dateRange === '90d') cutoffDate.setDate(today.getDate() - 90);

    const spending: Record<string, number> = {};
    purchaseSessions.forEach((session) => {
      if (new Date(session.purchase_date) >= cutoffDate) {
        spending[session.store_name] = (spending[session.store_name] || 0) + session.total_paid;
      }
    });
    return spending;
  };

  const getSpendingByMember = () => {
    const today = new Date();
    const cutoffDate = new Date();
    if (dateRange === '7d') cutoffDate.setDate(today.getDate() - 7);
    else if (dateRange === '30d') cutoffDate.setDate(today.getDate() - 30);
    else if (dateRange === '90d') cutoffDate.setDate(today.getDate() - 90);

    const spending: Record<string, number> = {};
    purchaseSessions.forEach((session) => {
      if (new Date(session.purchase_date) >= cutoffDate) {
        spending[session.bought_by] = (spending[session.bought_by] || 0) + session.total_paid;
      }
    });
    return spending;
  };

  const getTopPurchasedItems = () => {
    const today = new Date();
    const cutoffDate = new Date();
    if (dateRange === '7d') cutoffDate.setDate(today.getDate() - 7);
    else if (dateRange === '30d') cutoffDate.setDate(today.getDate() - 30);
    else if (dateRange === '90d') cutoffDate.setDate(today.getDate() - 90);

    const counts: Record<string, number> = {};
    purchaseSessions.forEach((session) => {
      if (new Date(session.purchase_date) >= cutoffDate) {
        session.items.forEach((item) => {
          counts[item.name] = (counts[item.name] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const getTrendData = () => {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayTotal = purchaseSessions
        .filter((s) => {
          const sDate = new Date(s.purchase_date);
          return sDate.getDate() === date.getDate() &&
                 sDate.getMonth() === date.getMonth() &&
                 sDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, s) => sum + s.total_paid, 0);
      data.push({ day: dayLabel, value: dayTotal });
    }
    return data;
  };

  const { spending: categorySpending, total: totalSpending } = getSpendingByCategory();
  const storeSpending = getSpendingByStore();
  const memberSpending = getSpendingByMember();
  const topItems = getTopPurchasedItems();
  const trendData = getTrendData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
            >
              <option value="all">All stores</option>
              {Object.keys(storeSpending).map((store) => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              <option value="produce">Produce</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="bakery">Bakery</option>
              <option value="frozen">Frozen</option>
              <option value="household">Household</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalSpending)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Purchases</p>
              <p className="text-2xl font-bold text-gray-800">{purchaseSessions.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Most Spent Store</p>
              <p className="text-lg font-semibold text-gray-800">
                {Object.entries(storeSpending)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 1)
                  .map(([store]) => store)[0] || 'N/A'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Average per Purchase</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalSpending / (purchaseSessions.length || 1))}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Spending by Category */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h2>
              <div className="space-y-2">
                {Object.entries(categorySpending)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 capitalize">{category}</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(amount / (totalSpending || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{formatCurrency(amount)}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Spending by Store */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Store</h2>
              <div className="space-y-2">
                {Object.entries(storeSpending)
                  .sort((a, b) => b[1] - a[1])
                  .map(([store, amount]) => (
                    <div key={store} className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{store}</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${(amount / (totalSpending || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{formatCurrency(amount)}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Spending Trend</h2>
            <div className="h-48 flex items-end gap-2">
              {trendData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                    style={{ height: `${(day.value / (Math.max(...trendData.map(d => d.value))) || 1) * 100}%` }}
                  />
                  <p className="text-xs text-gray-600 mt-1">{day.day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Items */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Purchased Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map(([name, count]) => {
                    const itemTotal = purchaseSessions
                      .filter((s) => s.items.some((i) => i.name === name))
                      .reduce((sum, s) => {
                        const item = s.items.find((i) => i.name === name);
                        return sum + (item?.total_price || 0);
                      }, 0);
                    return (
                      <tr key={name} className="border-b">
                        <td className="py-2">{name}</td>
                        <td className="text-right py-2">{count}</td>
                        <td className="text-right py-2">{formatCurrency(itemTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {topItems.length === 0 && (
                <p className="text-gray-500 text-center py-8">No purchase data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;