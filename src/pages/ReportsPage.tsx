import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

const ReportsPage: React.FC = () => {
  const { priceHistory, purchaseSessions, lists, user } = useStore();
  const [dateRange, setDateRange] = useState<string>('all-time');
  const [selectedStore, setSelectedStore] = useState<string>('all');

  // Get unique stores from purchase history
  const stores = [...new Set(priceHistory.map(item => item.store_name).filter(Boolean))];

  // Get unique categories from lists
  const categories = lists.flatMap(list => {
    const itemCategories = list.items?.map(item => item.category).filter(Boolean) || [];
    return itemCategories;
  });

  // Calculate statistics
  const totalSpent = priceHistory.reduce((sum, item) => sum + (item.unit_price || 0) * (item.quantity || 1), 0);
  const avgPricePerItem = priceHistory.length > 0 ? totalSpent / priceHistory.length : 0;
  const totalItems = priceHistory.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const getSpendingByStore = () => {
    const storeMap: Record<string, number> = {};
    
    priceHistory.forEach(item => {
      storeMap[item.store_name || 'Unknown'] = 
        (storeMap[item.store_name || 'Unknown'] || 0) + 
        (item.unit_price || 0) * (item.quantity || 1);
    });
    
    return Object.entries(storeMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  };

  const getSpendingByCategory = () => {
    const categoryMap: Record<string, number> = {};
    
    // Sum up total_spent from each list by category
    lists.forEach(list => {
      // Calculate list total from actual prices or estimated prices
      const listTotal = list.items?.reduce((sum, item) => {
        const actualPrice = item.actual_price || item.estimated_price || 0;
        return sum + (actualPrice * item.quantity);
      }, 0) || 0;
      
      list.items?.forEach(item => {
        const categoryName = item.category || 'Other';
        const actualPrice = item.actual_price || item.estimated_price || 0;
        const itemTotal = actualPrice * item.quantity;
        categoryMap[categoryName] = (categoryMap[categoryName] || 0) + itemTotal;
      });
    });
    
    return Object.entries(categoryMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  };

  const getRecentPurchases = () => {
    return purchaseSessions
      .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
      .slice(0, 5);
  };

  const recentPurchases = getRecentPurchases();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Spending Reports</h1>

        {/* Store Filter */}
        <div className="mb-6">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="all">All Stores</option>
            {stores.map(store => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalSpent)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Average Price Per Item</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(avgPricePerItem)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
          </Card>
        </div>

        {/* Spending by Store */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Store</h2>
          {getSpendingByStore().length === 0 ? (
            <EmptyState
              title="No shopping history"
              description="Start shopping and we'll track your stores!"
            />
          ) : (
            <div className="space-y-3">
              {getSpendingByStore()
                .filter(store => selectedStore === 'all' || store.name === selectedStore)
                .map(({ name, total }) => (
                <div key={name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                    <span className="text-sm text-gray-600">{formatCurrency(total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(total / totalSpent) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Spending by Category */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h2>
          {getSpendingByCategory().length === 0 ? (
            <EmptyState
              title="No shopping data yet"
              description="Start shopping and we'll track your categories!"
            />
          ) : (
            <div className="space-y-3">
              {getSpendingByCategory().map(({ name, total }) => (
                <div key={name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                    <span className="text-sm text-gray-600">{formatCurrency(total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(total / totalSpent) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Purchases */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Purchases</h2>
          {recentPurchases.length === 0 ? (
            <EmptyState
              title="No purchases yet"
              description="Your purchase history will appear here!"
            />
          ) : (
            <div className="space-y-4">
              {recentPurchases.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{session.store_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.purchase_date).toLocaleDateString()}
                        {session.purchase_date && ` • ${new Date(session.purchase_date).toLocaleTimeString()}`}
                      </p>
                    </div>
                    <Badge variant="success">
                      {formatCurrency(session.total_paid)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {session.items?.length} items purchased
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export { ReportsPage };