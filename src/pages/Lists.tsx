import React, { useState, useEffect } from 'react';
import { Card, EmptyState, Button, Input, Select, Spinner } from '../components/ui';
import { Badge } from '../components/ui/Badge';
import { GroceryItemCard } from '../components/GroceryItemCard';
import { useStore } from '../store/useStore';
import { getUserLists, createList, deleteList as apiDeleteList, createListItem, deleteListItem as apiDeleteListItem, toggleItemCompletion } from '../api/lists';
import type { GroceryList, ListItem } from '../types';

export const Lists: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const { user, lists, addList, deleteList: storeDeleteList, toggleItem, updateItem, deleteListItem: storeDeleteListItem } = useStore();

  useEffect(() => {
    const fetchLists = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const fetchedLists = await getUserLists(user.id);
        for (const list of fetchedLists) {
          const existing = lists.find((l) => l.id === list.id);
          if (!existing) addList(list);
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
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || list.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateList = async () => {
    if (!user?.id || !newListName.trim()) return;
    try {
      const newList = await createList(newListName.trim(), user.id, user.id);
      addList({
        ...newList,
        items: [],
        status: newList.status || 'active',
        description: newList.description || '',
      });
      setNewListName('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating list:', err);
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
    return <div className="flex justify-center py-12"><Spinner /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">My Lists</h1>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <span>+</span> New List
          </Button>
        </div>
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

      {filteredLists.length === 0 && (
        <EmptyState
          title={lists.length === 0 ? 'No Lists Yet' : 'No Matching Lists'}
          description={lists.length === 0 ? 'Create your first grocery list to get started' : 'Try adjusting your search or filters'}
          icon="🛒"
          actionLabel={lists.length === 0 ? 'Create List' : undefined}
          onAction={lists.length === 0 ? () => setShowCreateModal(true) : undefined}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => {
          const items = list.items || [];
          const completion = getCompletionPercentage(items);
          return (
            <Card key={list.id} className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{list.name}</h3>
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
                      <GroceryItemCard
                        key={item.id}
                        item={item}
                        onToggle={() => handleToggleItem(list.id, item.id)}
                        onUpdate={(updated) => updateItem(list.id, item.id, updated)}
                        onRemove={() => handleRemoveItem(list.id, item.id)}
                      />
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Create New List</h3>
            <Input
              label="List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g., Weekly Groceries"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreateList} className="flex-1">Create</Button>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
