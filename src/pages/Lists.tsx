import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, EmptyState, Button, Input, Select, SkeletonCard } from '../components/ui';
import { Badge } from '../components/ui/Badge';
import { GroceryItemCard } from '../components/GroceryItemCard';
import { StockBadge } from '../components/StockBadge';
import { useStore } from '../store/useStore';
import { getUserLists, createList, deleteList as apiDeleteList, createListItem, deleteListItem as apiDeleteListItem, toggleItemCompletion } from '../api/lists';
import { getUserHouseholds } from '../api/auth';
import type { GroceryList, ListItem } from '../types';
import log from '@/utils/debug';
import { useLogRender } from '@/hooks/useLogRender';

export const Lists: React.FC = () => {
  useLogRender('Lists');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'lists' | 'items'>('lists');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState('');
  const { user, lists, priceHistory, addList, deleteList: storeDeleteList, toggleItem, updateItem, deleteListItem: storeDeleteListItem, currentHouseholdId, setCurrentHouseholdId } = useStore();
  const [households, setHouseholds] = useState<any[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const hh = await getUserHouseholds(user.id);
        setHouseholds(hh);
        if (hh.length > 0 && !currentHouseholdId) setCurrentHouseholdId(hh[0].id);
        const fetchedLists = await getUserLists(user.id);
        // Clear existing lists from store and replace with server data
        useStore.getState().lists.forEach((l) => useStore.getState().deleteList(l.id));
        for (const list of fetchedLists) {
          addList(list);
        }
      } catch (err) {
        console.error('Error fetching lists:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, [user?.id]);

  const filteredLists = lists.filter((list) => {
    if (!list) return false;
    if (currentHouseholdId && list.household_id !== currentHouseholdId) return false;
    const matchesSearch = (list.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || list.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateList = async () => {
    setError('');
    if (!user?.id) { setError('Please log in first'); return; }
    if (!newListName.trim()) { setError('List name is required'); return; }
    if (!currentHouseholdId) { setError('No household found.'); return; }
    try {
      const res = await createList(newListName.trim(), currentHouseholdId, user.id);
      const createdList = res.list || res;
      addList({
        ...createdList,
        items: [],
        status: createdList.status || 'active',
        description: createdList.description || '',
      });
      setNewListName('');
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await apiDeleteList(listId, user?.id || '');
      storeDeleteList(listId);
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  const handleToggleItem = async (listId: string, itemId: string) => {
    const list = lists.find((l) => l.id === listId);
    const item = list?.items?.find((i) => i.id === itemId);
    if (item) {
      try {
        await toggleItemCompletion(itemId, !item.is_checked);
        toggleItem(listId, itemId);
      } catch (err) {
        console.error('Error toggling item:', err);
      }
    }
  };

  const handleRemoveItem = async (listId: string, itemId: string) => {
    try {
      await apiDeleteListItem(itemId, listId, user?.id || '');
      storeDeleteListItem(listId, itemId);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const smartSuggestions = useMemo(() => {
    if (searchMode !== 'items') return [];
    const frequentlyBought = priceHistory.reduce((acc, item) => {
      acc[item.item_name] = (acc[item.item_name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);
    const activeListItems = new Set(
      lists.find(l => l.status === 'active')?.items.map(i => i.name.toLowerCase()) || []
    );
    return Object.entries(frequentlyBought)
      .filter(([name]) => !activeListItems.has(name.toLowerCase()))
      .slice(0, 5)
      .map(([name, qty]) => ({
        item_name: name,
        frequency: qty,
        last_price: priceHistory.filter(item => item.item_name === name)
          .sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime())[0]?.unit_price || 0,
      }));
  }, [searchMode, priceHistory, lists]);

  const itemSearchResults = useMemo(() => {
    if (searchMode !== 'items' || !searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    const results: Array<{ id: string; name: string; listName: string; category: string; quantity: number }> = [];
    lists.filter(l => l.status === 'active').forEach(list => {
      list.items.forEach(item => {
        if (item.name.toLowerCase().includes(q)) {
          results.push({ id: item.id, name: item.name, listName: list.name, category: item.category, quantity: item.quantity });
        }
      });
    });
    return results;
  }, [searchMode, searchTerm, lists]);

  const getCompletionPercentage = (items: ListItem[]) => {
    if (items.length === 0) return 0;
    return Math.round((items.filter((i) => i.is_checked).length / items.length) * 100);
  };

  const getStatusVariant = (status: string): 'primary' | 'secondary' | 'success' => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {households.length > 1 && currentHouseholdId
                ? `${households.find(h => h.id === currentHouseholdId)?.name || 'My'} Lists`
                : 'My Lists'}
            </h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setSearchMode('lists')} className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${searchMode === 'lists' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>Lists</button>
              <button onClick={() => setSearchMode('items')} className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${searchMode === 'items' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>Items</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {households.length > 1 && (
              <select
                value={currentHouseholdId || ''}
                onChange={(e) => setCurrentHouseholdId(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                {households.map((hh: any) => (
                  <option key={hh.id} value={hh.id}>{hh.name}</option>
                ))}
              </select>
            )}
            {households.length === 0 && (
              <Link to="/household" className="text-sm text-green-600 hover:underline">Create household</Link>
            )}
            {searchMode === 'lists' && (
              <Button onClick={() => setShowCreateModal(true)} className="gap-2"><span>+</span> New List</Button>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder={searchMode === 'lists' ? "Search lists by name..." : "Search items across all lists..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {searchMode === 'lists' && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Lists</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </div>

      {searchMode === 'items' && smartSuggestions.length > 0 && (
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Items You Might Need</h2>
          <div className="space-y-3">
            {smartSuggestions.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{s.item_name}</p>
                  <p className="text-sm text-gray-600">Bought {s.frequency} time(s)</p>
                </div>
                <Button onClick={async () => { const activeList = lists.find(l => l.status === 'active'); if (activeList && user?.id) { await createListItem(s.item_name, 1, 0, 'Other', activeList.id, user.id); } }} variant="primary" size="sm">Add to List</Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {searchMode === 'items' && searchTerm.trim() && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Search Results</h2>
          {itemSearchResults.length === 0 ? (
            <EmptyState title="No items found" description="Try a different search term" />
          ) : (
            <div className="space-y-2">
              {itemSearchResults.map(r => (
                <Card key={r.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{r.name}</p>
                    <p className="text-sm text-gray-500">in <button onClick={() => navigate(`/list/${lists.find(l => l.name === r.listName)?.id}`)} className="text-green-600 hover:underline">{r.listName}</button> &middot; {r.category}</p>
                  </div>
                  <Badge variant="secondary">Qty: {r.quantity}</Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {searchMode === 'lists' && filteredLists.length === 0 && (
        <EmptyState
          title={lists.length === 0 ? 'No Lists Yet' : 'No Matching Lists'}
          description={lists.length === 0 ? 'Create your first grocery list to get started' : 'Try adjusting your search or filters'}
          icon="🛒"
          actionLabel={lists.length === 0 ? 'Create List' : undefined}
          onAction={lists.length === 0 ? () => setShowCreateModal(true) : undefined}
        />
      )}

      {searchMode === 'lists' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => {
          const items = list.items || [];
          const completion = getCompletionPercentage(items);
          return (
            <Card key={list.id} className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <button onClick={() => navigate(`/list/${list.id}`)} className="text-left">
                    <h3 className="font-semibold text-gray-800 truncate hover:text-green-600">{list.name}</h3>
                  </button>
                  <p className="text-sm text-gray-600 truncate">{list.description || 'No description'}</p>
                </div>
                <Badge variant={getStatusVariant(list.status)}>{list.status}</Badge>
              </div>
              {items.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{completion}% complete</span>
                    <span className="text-gray-600">{items.filter((i) => !i.is_checked).length} remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${completion === 100 ? 'bg-green-600' : 'bg-green-500'}`} style={{ width: `${completion}%` }} />
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-y-auto max-h-48 mb-3">
                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.slice(0, 5).map((item) => (
                      <div key={item.id} className="relative">
                        <GroceryItemCard
                          item={item}
                          onToggle={() => handleToggleItem(list.id, item.id)}
                          onUpdate={(updated) => updateItem(list.id, item.id, updated)}
                          onRemove={() => handleRemoveItem(list.id, item.id)}
                        />
                        <div className="absolute top-2 right-2">
                          <StockBadge threshold={item.restock_threshold ?? null} lastBoughtAt={item.last_bought_at} />
                        </div>
                      </div>
                    ))}
                    {items.length > 5 && <p className="text-sm text-gray-500 text-center">+{items.length - 5} more</p>}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No items yet</div>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                <button onClick={() => handleDeleteList(list.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Create New List</h3>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error} <button onClick={() => navigate('/household')} className="underline font-medium">Create or join one here</button></div>}
            <Input
              label="List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g., Weekly Groceries"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreateList} className="flex-1">Create</Button>
              <Button variant="secondary" onClick={() => { setShowCreateModal(false); setError(''); }} className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
