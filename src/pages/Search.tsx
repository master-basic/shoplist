import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@store/useStore';
import { formatCurrency } from '@utils/formatCurrency';

const Search: React.FC = () => {
  const { lists, priceHistory, purchaseSessions, addItemToList } = useStore();
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    household_id: '',
    member_id: '',
    date_from: '',
    date_to: '',
    store: '',
    category: '',
    price_min: '',
    price_max: '',
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length > 0 && searchHistory.length === 0) {
      setSearchHistory([query]);
    } else if (query.length > 0) {
      setSearchHistory((prev) => [...prev.slice(-9), query]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Searching for:', query);
      // In a real app, this would search the database
    }
  };

  const handleQuickAdd = () => {
    const name = prompt('Enter item name:');
    if (!name) return;
    
    const list = lists.find((l) => l.id === filters.household_id);
    if (!list) return;
    
    addItemToList(list.id, {
      name,
      quantity: 1,
      unit: 'pcs',
      category: 'Other',
      estimated_price: 0,
      preferred_store: '',
      notes: '',
      is_checked: false,
    } as Omit<any, 'id'>);
  };

  const handleQuickPriceHistory = () => {
    // Show recent purchases for this query
    const recent = priceHistory
      .filter((p) => p.item_name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime())
      .slice(0, 5);
    
    if (recent.length > 0) {
      console.log('Price history:', recent);
    }
  };

  const handleSuggestionClick = (item: any) => {
    addItemToList(lists.find((l) => l.id === filters.household_id)?.id || '', {
      name: item.item_name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      estimated_price: item.unit_price,
      preferred_store: item.store_name,
      notes: '',
      is_checked: false,
    } as Omit<any, 'id'>);
  };

  const filteredPriceHistory = priceHistory.filter((p) =>
    p.item_name.toLowerCase().includes(query.toLowerCase())
  );

  const recentPurchases = purchaseSessions
    .filter((s) => {
      const matchesQuery = s.store_name.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    })
    .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Search</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items, stores, lists..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filters.household_id}
                onChange={(e) => setFilters({ ...filters, household_id: e.target.value })}
              >
                  <option value="">All Lists</option>
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                  ))}
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filters.store}
                onChange={(e) => setFilters({ ...filters, store: e.target.value })}
              >
                <option value="">All Stores</option>
                {Array.from(new Set(priceHistory.map((p) => p.store_name))).map((store) => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>

              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filters.date_from}
                onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              />

              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filters.date_to}
                onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Search
            </button>
          </form>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-600 mb-2">Search History</h2>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((history, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(history)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                  >
                    {history}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Quick Actions</h2>
            <div className="flex gap-2">
              <button
                onClick={handleQuickAdd}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                + Add Item
              </button>
              <button
                onClick={handleQuickPriceHistory}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                View Price History
              </button>
            </div>
          </div>

          {/* Price History Results */}
          {filteredPriceHistory.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Price History for "{query}" ({filteredPriceHistory.length} results)
              </h2>
              <div className="space-y-3">
                {filteredPriceHistory.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{item.item_name}</p>
                        <p className="text-sm text-gray-600">
                          {item.store_name} • {new Date(item.purchased_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Purchases */}
          {recentPurchases.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Purchases at "{query}"
              </h2>
              <div className="space-y-3">
                {recentPurchases.map((session) => (
                  <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{session.store_name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.purchase_date).toLocaleDateString()}
                        </p>
                      </div>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(session.total_paid)}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!query && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500">Start typing to search items, stores, or lists</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;