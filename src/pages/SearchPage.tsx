import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { normalizeItemName, fuzzyMatch, STORES, CATEGORIES } from '@/types';

const SearchPage: React.FC = () => {
  const { lists, priceHistory, purchaseSessions, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'items' | 'lists' | 'stores'>('items');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'smart'>('smart');

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchType, lists, priceHistory, purchaseSessions]);

  const performSearch = () => {
    const normalizedQuery = normalizeItemName(searchQuery);
    const results: any[] = [];

    // Search items in active lists
    lists.filter(list => list.status === 'active').forEach(list => {
      list.items.forEach(item => {
        const normalizedItem = normalizeItemName(item.name);
        const score = fuzzyMatch(normalizedQuery, normalizedItem);
        
        if (score > 0.3) {
          results.push({
            id: `item-${list.id}-${item.id}`,
            type: 'item',
            list_name: list.name,
            item_name: item.name,
            category: item.category,
            quantity: item.quantity,
            estimated_price: item.estimated_price,
            store: item.preferred_store,
            score: score,
          });
        }
      });
    });

    // Search purchase history
    priceHistory.forEach(historyItem => {
      const normalizedHistory = normalizeItemName(historyItem.item_name);
      const score = fuzzyMatch(normalizedQuery, normalizedHistory);
      
      if (score > 0.3) {
        results.push({
          id: `history-${historyItem.id}`,
          type: 'history',
          item_name: historyItem.item_name,
          store_name: historyItem.store_name,
          unit_price: historyItem.unit_price,
          purchased_at: historyItem.purchased_at,
          score: score,
        });
      }
    });

    // Search stores
    STORES.forEach(store => {
      if (normalizedQuery.includes(normalizeItemName(store).charAt(0))) {
        results.push({
          id: `store-${store}`,
          type: 'store',
          name: store,
          score: 0.5,
        });
      }
    });

    // Search lists
    lists.forEach(list => {
      const listScore = fuzzyMatch(normalizedQuery, normalizeItemName(list.name));
      if (listScore > 0.3) {
        results.push({
          id: `list-${list.id}`,
          type: 'list',
          name: list.name,
          category: 'Shopping List',
          score: listScore,
        });
      }
    });

    setSearchResults(results.sort((a, b) => b.score - a.score));
  };

  const handleQuickAdd = (item: any) => {
    // Add item to first active list
    const activeList = lists.find(l => l.status === 'active');
    if (activeList) {
      // In a real app, this would call an API
      alert(`Added "${item.item_name || item.name}" to ${activeList.name}`);
    }
  };

  const getSmartSuggestions = () => {
    // Find items you frequently buy but don't have on current list
    const frequentlyBought = priceHistory
      .reduce((acc, item) => {
        acc[item.item_name] = (acc[item.item_name] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

    const activeListItems = new Set(
      lists.find(l => l.status === 'active')?.items.map(i => i.name) || []
    );

    return Object.entries(frequentlyBought)
      .filter(([name]) => !activeListItems.has(normalizeItemName(name)))
      .slice(0, 5)
      .map(([name, qty]) => ({
        item_name: name,
        frequency: qty,
        last_bought_at: priceHistory
          .filter(item => item.item_name === name)
          .sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime())[0]?.purchased_at,
        last_price: priceHistory
          .filter(item => item.item_name === name)
          .sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime())[0]?.unit_price || 0,
      }));
  };

  const smartSuggestions = activeTab === 'smart' ? getSmartSuggestions() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Search</h1>

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search items, stores, or lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'items' | 'lists' | 'stores')}
            >
              <option value="items">Items</option>
              <option value="lists">Lists</option>
              <option value="stores">Stores</option>
            </select>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setActiveTab('results')}
            variant={activeTab === 'results' ? 'primary' : 'ghost'}
          >
            Results
          </Button>
          <Button
            onClick={() => setActiveTab('smart')}
            variant={activeTab === 'smart' ? 'primary' : 'ghost'}
          >
            Smart Suggestions
          </Button>
        </div>

        {/* Smart Suggestions */}
        {activeTab === 'smart' && smartSuggestions.length > 0 && (
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Items You Might Need</h2>
            <div className="space-y-3">
              {smartSuggestions.map((suggestion, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{suggestion.item_name}</p>
                    <p className="text-sm text-gray-600">
                      Bought {suggestion.frequency} time(s) • Last: {suggestion.last_bought_at ? new Date(suggestion.last_bought_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <Button onClick={() => handleQuickAdd(suggestion)} variant="primary" size="sm">
                    Add to List
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Search Results */}
        {activeTab === 'results' && (
          <>
            {searchResults.length === 0 ? (
              searchQuery && !searchQuery.trim().includes(' ') ? (
                <EmptyState
                  title="No results found"
                  description="Try a different search term or add new items to your lists."
                />
              ) : (
                <EmptyState
                  title="Start searching"
                  description="Search for items in your lists, purchase history, or stores."
                />
              )
            ) : (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <Card key={result.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {result.type === 'item' && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">In "{result.list_name}"</span>
                            <Badge variant="secondary">{result.category}</Badge>
                          </div>
                        )}
                        <p className="font-medium text-gray-800 text-lg">{result.item_name || result.name}</p>
                        
                        {result.type === 'item' && (
                          <>
                            <p className="text-sm text-gray-600">
                              Qty: {result.quantity} • ${result.estimated_price.toFixed(2)}
                            </p>
                            {result.store && (
                              <p className="text-sm text-gray-500">Store: {result.store}</p>
                            )}
                          </>
                        )}
                        
                        {result.type === 'history' && (
                          <>
                            <p className="text-sm text-gray-600">
                              Price: ${result.unit_price.toFixed(2)} • Purchased: {new Date(result.purchased_at).toLocaleDateString()}
                            </p>
                          </>
                        )}
                        
                        {result.type === 'list' && (
                          <p className="text-sm text-gray-600">Your shopping list</p>
                        )}
                        
                        {result.type === 'store' && (
                          <p className="text-sm text-gray-600">Shop at {result.name}</p>
                        )}
                      </div>
                      
                      {result.type === 'item' && (
                        <Button onClick={() => handleQuickAdd(result)} variant="primary" size="sm">
                          Quick Add
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export { SearchPage };