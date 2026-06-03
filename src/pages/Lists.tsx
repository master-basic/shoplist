// =====================================================
// Lists Page Component
// =====================================================

import React, { useState } from 'react';
import { Card, EmptyState, Button } from '../components/ui';
import { Badge } from '../components/ui/Badge';
import { GroceryItemCard } from '../components/GroceryItemCard';
import { useStore } from '../store/useStore';

interface List {
  id: string;
  name: string;
  description?: string;
  items: GroceryItem[];
  category?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

interface GroceryItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  completed: boolean;
  categoryId?: string;
  notes?: string;
}

export const Lists: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { lists, categories, loadLists, toggleItem } = useStore();

  React.useEffect(() => {
    loadLists();
  }, [loadLists]);

  const filteredLists = lists.filter((list) => {
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || list.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateList = () => {
    useStore.getState().createList();
  };

  const getRemainingItems = (items: GroceryItem[]) => {
    return items.filter((item) => !item.completed).length;
  };

  const getCompletionPercentage = (items: GroceryItem[]) => {
    if (items.length === 0) return 0;
    const completed = items.filter((item) => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">My Lists</h1>
          <Button onClick={handleCreateList} className="gap-2">
            <span>➕</span>
            New List
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Lists</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredLists.length === 0 && (
        <EmptyState
          icon="🛒"
          title={lists.length === 0 ? "No Lists Yet" : "No Matching Lists"}
          description={
            lists.length === 0
              ? "Create your first grocery list to get started"
              : "Try adjusting your search or filters"
          }
          actions={
            lists.length === 0 ? (
              <Button onClick={handleCreateList}>Create List</Button>
            ) : undefined
          }
        />
      )}

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => {
          const items = list.items?.filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.name.toLowerCase().includes(filter)
          ) || [];
          const remaining = getRemainingItems(items);
          const completion = getCompletionPercentage(items);

          return (
            <Card key={list.id} className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{list.name}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {list.description || 'No description'}
                  </p>
                </div>
                <Badge variant={list.status}>{list.status}</Badge>
              </div>

              {/* Progress Bar */}
              {items.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {completion}% complete
                    </span>
                    <span className="text-gray-600">
                      {remaining} remaining
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        completion === 100 ? 'bg-green-600' : 'bg-green-500'
                      }`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto max-h-48 mb-3">
                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.slice(0, 5).map((item) => (
                      <GroceryItemCard
                        key={item.id}
                        item={item}
                        onToggle={() => toggleItem(list.id, item.id)}
                      />
                    ))}
                    {items.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{items.length - 5} more items
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No items yet
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(list.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};