import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/api/client';
import { Card, EmptyState, Skeleton } from '@/components/ui';
import { SearchBar } from '@/components/SearchBar';
import { useLogRender } from '@/hooks/useLogRender';
import type { GroceryList } from '@/types';

interface SearchResult {
  list: GroceryList;
  matchingItems: string[];
}

const SearchPage: React.FC = () => {
  useLogRender('SearchPage');
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const performSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim() || !user?.id) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/api/lists?search=${encodeURIComponent(q)}&userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const lists: GroceryList[] = data.lists || [];
        const qLower = q.toLowerCase();
        const grouped: SearchResult[] = lists
          .filter(list => list.items?.some(item => item.name.toLowerCase().includes(qLower)))
          .map(list => ({
            list,
            matchingItems: list.items
              .filter(item => item.name.toLowerCase().includes(qLower))
              .map(item => item.name),
          }));
        setResults(grouped);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Global Search</h1>
      <SearchBar onSearch={performSearch} placeholder="Search items across all lists..." />

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <EmptyState
          title="No results found"
          description="Try a different search term"
        />
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map(({ list, matchingItems }) => (
            <Card key={list.id}>
              <div className="p-4">
                <Link to={`/list/${list.id}`} className="text-lg font-semibold text-green-600 hover:underline">
                  {list.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{list.items?.length || 0} items</p>
                <div className="mt-3 space-y-1">
                  {matchingItems.map((name) => {
                    const item = list.items?.find(i => i.name === name);
                    return (
                      <div key={item?.id || name} className="flex items-center justify-between py-1 px-2 bg-green-50 rounded">
                        <span className="font-medium text-gray-800">{name}</span>
                        <span className="text-sm text-gray-500">Qty: {item?.quantity || 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && !query.trim() && (
        <EmptyState
          title="Search across all lists"
          description="Type in the search bar above to find items in any of your lists"
        />
      )}
    </div>
  );
};

export { SearchPage };
