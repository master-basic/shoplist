import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, Button, EmptyState, Toast, Input, Select, Badge, Spinner } from '../components/ui';
import { useStore } from '../store/useStore';
import { GroceryItemCard } from '../components/GroceryItemCard';
import { getUserLists, getListById, createListItem, deleteListItem as apiDeleteListItem, toggleItemCompletion, updateList, deleteList as apiDeleteList } from '../api/lists';
import { getHouseholdMembers } from '../api/auth';
import { AddItemModal } from '../components/AddItemModal';
import type { GroceryList, ListItem } from '../types';

interface HouseholdMember {
  id: string;
  name: string;
  email?: string;
}

export const ListDetail: React.FC = () => {
  const { id: routeListId } = useParams<{ id: string }>();
  const location = useLocation();
  const { user, lists, addList, deleteList: storeDeleteList, deleteListItem: storeDeleteListItem, addItemToList, updateItem, toggleItem, archiveList } = useStore();
  const pathId = location.pathname.startsWith('/list/') ? location.pathname.slice(6) : null;
  const [selectedListId, setSelectedListId] = useState<string | null>(routeListId || pathId || null);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [bestDeals, setBestDeals] = useState<Record<string, { store: string; price: number }>>({});

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

  const selectedList = lists.find((l) => l.id === selectedListId);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedList?.household_id) return;
      try {
        const data = await getHouseholdMembers(selectedList.household_id);
        setMembers(data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };
    fetchMembers();
  }, [selectedList?.household_id]);

  useEffect(() => {
    const fetchBestDeals = async () => {
      if (!selectedList?.items?.length) { setBestDeals({}); return; }
      const names = [...new Set(selectedList.items.map((i: any) => i.name).filter(Boolean))];
      try {
        const res = await fetch('http://localhost:3001/api/price-history/best-deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemNames: names }),
        });
        if (res.ok) {
          const data = await res.json();
          setBestDeals(data.deals || {});
        }
      } catch (err) {
        console.error('Error fetching best deals:', err);
      }
    };
    fetchBestDeals();
  }, [selectedList?.items?.length, selectedList?.items?.map((i: any) => i.name).join(',')]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateItem = async (itemData: Omit<ListItem, 'id' | 'list_id' | 'created_at' | 'updated_at'>) => {
    if (!selectedList || !user?.id) return;
    try {
      const newItem = await createListItem(
        itemData.name,
        itemData.quantity,
        itemData.estimated_price,
        itemData.category,
        selectedList.id,
        user.id,
        itemData.assigned_to?.[0],
        itemData.unit,
        itemData.notes
      );
      addItemToList(selectedList.id, {
        ...itemData,
        ...newItem,
        list_id: selectedList.id,
        is_checked: newItem.is_checked || false,
        sort_order: newItem.sort_order || selectedList.items?.length || 0,
        is_recurring: false,
        price_history: [],
        assigned_to: itemData.assigned_to || [],
      });
      setShowNewItemModal(false);
      showNotification('Item added successfully');
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedList || !user?.id) return;
    try {
      await apiDeleteListItem(itemId, selectedList.id, user.id);
      storeDeleteListItem(selectedList.id, itemId);
      showNotification('Item deleted');
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleToggleItem = async (itemId: string) => {
    if (!selectedList) return;
    const item = selectedList.items?.find((i) => i.id === itemId);
    if (item) {
      try {
        await toggleItemCompletion(itemId, !item.is_checked);
        toggleItem(selectedList.id, itemId);
      } catch (err) {
        console.error('Error toggling item:', err);
      }
    }
  };

  const handleNotBought = async (itemId: string, reason: string) => {
    if (!selectedList) return;
    try {
      await toggleItemCompletion(itemId, true, reason);
      toggleItem(selectedList.id, itemId);
      showNotification(`Marked "${selectedList.items?.find(i => i.id === itemId)?.name}" as not bought`);
    } catch (err) {
      console.error('Error marking as not bought:', err);
    }
  };

  const handleUpdateItem = (updates: Partial<ListItem>) => {
    if (!selectedList || !updates.id) return;
    updateItem(selectedList.id, updates.id, updates);
    showNotification('Item updated');
  };

  const handleDeleteList = async () => {
    if (!selectedList || !user?.id) return;
    if (confirm('Are you sure you want to delete this list?')) {
      try {
        await apiDeleteList(selectedList.id, user.id);
        storeDeleteList(selectedList.id);
        setSelectedListId(null);
        showNotification('List deleted');
      } catch (err) {
        console.error('Error deleting list:', err);
      }
    }
  };

  const items = selectedList?.items || [];
  const totalItems = items.length;
  const completedItems = items.filter((i) => i.is_checked).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner /></div>;
  }

  if (!selectedListId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Select a List</h1>
        {lists.length === 0 ? (
          <EmptyState title="No Lists" description="Create a list first" icon="🛒" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <Card key={list.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedListId(list.id)}>
                <h3 className="font-semibold text-gray-800">{list.name}</h3>
                <p className="text-sm text-gray-600">{list.items?.length || 0} items</p>
                <Badge variant={list.status === 'active' ? 'primary' : 'secondary'}>{list.status}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && <Toast variant="success" message={notification} onClose={() => setNotification(null)} />}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button onClick={() => setSelectedListId(null)} className="mb-2 text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <span>←</span><span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{selectedList?.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={selectedList?.status === 'active' ? 'primary' : 'secondary'}>{selectedList?.status}</Badge>
            <Button onClick={() => setShowNewItemModal(true)}>+ Add Item</Button>
          </div>
        </div>

        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{completedItems} / {totalItems} completed</span>
                <span className="text-2xl font-bold text-green-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${completionPercentage === 100 ? 'bg-green-600' : 'bg-green-500'}`} style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
            <div className="ml-6">
              <Button variant="danger" size="sm" onClick={handleDeleteList}>Delete List</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Items</h2>
          <Badge variant="primary">{items.filter((i) => !i.is_checked).length} remaining</Badge>
        </div>

        {items.length === 0 ? (
          <EmptyState title="No Items Yet" description="Add your first grocery item" icon="🛒" actionLabel="Add Item" onAction={() => setShowNewItemModal(true)} />
        ) : (
          <div className="space-y-3">
            {items.filter((i) => i.is_checked).length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Completed ({items.filter((i) => i.is_checked).length})</h3>
                <div className="space-y-2">
                  {items.filter((i) => i.is_checked).slice(0, 5).map((item) => (
                    <GroceryItemCard key={item.id} item={item} onToggle={handleToggleItem} onUpdate={handleUpdateItem} onRemove={handleDeleteItem} members={members} bestDeal={bestDeals[item.name?.toLowerCase()] || null} readOnly />

                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">To Buy ({items.filter((i) => !i.is_checked).length})</h3>
              <div className="space-y-2">
                  {items.filter((i) => !i.is_checked).map((item) => (
                    <GroceryItemCard key={item.id} item={item} onToggle={handleToggleItem} onUpdate={handleUpdateItem} onRemove={handleDeleteItem} onNotBought={handleNotBought} members={members} bestDeal={bestDeals[item.name?.toLowerCase()] || null} />
                  ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {showNewItemModal && (
        <AddItemModal isOpen={showNewItemModal} onClose={() => setShowNewItemModal(false)} onSubmit={handleCreateItem} existingItems={items} />
      )}
    </div>
  );
};
