// =====================================================
// List Detail Page Component
// =====================================================

import React, { useState } from 'react';
import { Card, Button, EmptyState, Toast, Input, Select, Badge } from '../components/ui';
import { useStore } from '../store/useStore';
import { GroceryItemCard } from '../components/GroceryItemCard';
import type { GroceryList, ListItem } from '../store/useStore';

interface Props {
  listId?: string;
  title?: string;
}

export const ListDetail: React.FC<Props> = ({ listId, title }) => {
  const lists = useStore((state) => state.lists);
  const addList = useStore((state) => state.addList);
  const deleteList = useStore((state) => state.deleteList);
  const deleteListItem = useStore((state) => state.deleteListItem);
  const addItemToList = useStore((state) => state.addItemToList);
  const updateItem = useStore((state) => state.updateItem);
  const toggleItem = useStore((state) => state.toggleItem);
  const archiveList = useStore((state) => state.archiveList);
  const user = useStore((state) => state.user);

  const [selectedList, setSelectedList] = useState<GroceryList | null>(null);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBack = () => {
    setSelectedList(null);
  };

  const handleListSelect = (list: GroceryList) => {
    setSelectedList(list);
  };

  const handleCreateItem = () => {
    const list = selectedList;
    if (!list) return;

    const newItem: Omit<ListItem, 'id'> = {
      name: 'New Item',
      category: 'other',
      list_id: list.id,
      quantity: 1,
      unit: 'pcs',
      estimated_price: 0,
      is_checked: false,
      assigned_to: [],
      checked_by: undefined,
      checked_at: undefined,
      is_recurring: false,
      restock_threshold: undefined,
      last_bought_at: undefined,
      price_history: [],
      notes: '',
      sort_order: list.items.length,
    };
    addItemToList(list.id, newItem);
    setShowNewItemModal(false);
    showNotification('Item added successfully');
  };

  const handleDeleteItem = (itemId: string) => {
    deleteListItem(selectedList?.id || '', itemId);
    showNotification('Item deleted');
  };

  const handleToggleItem = (itemId: string) => {
    toggleItem(selectedList!.id, itemId);
  };

  const handleUpdateItem = (updates: Partial<ListItem>) => {
    updateItem(selectedList!.id, updates.id || '', updates);
    showNotification('Item updated successfully');
  };

  const handleArchiveList = () => {
    archiveList(selectedList!.id);
    showNotification('List archived');
  };

  const handleDeleteList = () => {
    if (confirm('Are you sure you want to delete this list?')) {
      deleteList(selectedList!.id);
      setSelectedList(null);
      showNotification('List deleted');
    }
  };

  const items = selectedList?.items || [];
  const totalItems = items.length;
  const completedItems = items.filter((i) => i.checked_by).length;
  const remainingItems = totalItems - completedItems;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AZ', {
      style: 'currency',
      currency: 'AZN',
    }).format(price);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      produce: '🥬',
      dairy: '🥛',
      meat: '🥩',
      bakery: '🍞',
      frozen: '🍦',
      household: '🧼',
      beverages: '🥤',
      snacks: '🍿',
      pantry: '🥫',
      other: '📦',
    };
    return icons[category] || '📦';
  };

  const remainingItemsList = items.filter((item) => !item.checked_by);
  const sortedRemainingItems = [...remainingItemsList].sort((a, b) => {
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'archived':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (!selectedList) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Select a List"
          description="Choose a grocery list to view its details"
          icon="🛒"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <Toast
          variant="success"
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={handleBack}
              className="mb-2 text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{selectedList.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(selectedList.status)}>
              {selectedList.status}
            </Badge>
            <Button onClick={() => setShowNewItemModal(true)}>
              <span>+</span> Add Item
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {completedItems} / {totalItems} items completed
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    completionPercentage === 100 ? 'bg-green-600' : 'bg-green-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <div className="ml-6 space-y-3">
              <div className="text-sm text-gray-600">
                {items.some((i) => i.restock_threshold !== undefined) && (
                  <p>
                    Restock when: {items[0]?.restock_threshold || 0} {items[0]?.unit || 'pcs'}
                  </p>
                )}
                {items.some((i) => i.restock_threshold !== undefined) && remainingItems <= (items[0]?.restock_threshold || 0) && remainingItems > 0 && (
                  <p className="text-orange-600 font-medium mt-1">
                    ⚠️ Low on items - consider restocking!
                  </p>
                )}
              </div>
              {user && (
                <Button variant="secondary" size="sm" onClick={handleArchiveList}>
                  Archive List
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* List Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Updated: {selectedList.updated_at ? new Date(selectedList.updated_at).toLocaleDateString() : '-'}
          </span>
          <span>•</span>
          <span>Category: {items[0]?.category || 'mixed'}</span>
          {user && (
            <div className="ml-auto">
              <Button variant="danger" size="sm" onClick={handleDeleteList}>
                Delete List
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Items Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Items
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="primary">
              {remainingItems} remaining
            </Badge>
            <Badge variant={completionPercentage === 100 ? 'success' : 'secondary'}>
              {completionPercentage}%
            </Badge>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="No Items Yet"
            description="Add your first grocery item to get started"
            icon="🛒"
            actionLabel="Add Item"
            onAction={() => setShowNewItemModal(true)}
          />
        ) : (
          <div className="space-y-3">
            {/* Completed Items */}
            {items.filter((i) => i.checked_by).length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  ✅ Completed ({items.filter((i) => i.checked_by).length})
                </h3>
                <div className="space-y-2">
                  {items
                    .filter((i) => i.checked_by)
                    .sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0))
                    .slice(0, 5)
                    .map((item) => (
                      <GroceryItemCard
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onUpdate={handleUpdateItem}
                        onRemove={handleDeleteItem}
                        readOnly
                      />
                    ))}
                </div>
                {items.filter((i) => i.checked_by).length > 5 && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    +{items.filter((i) => i.checked_by).length - 5} more completed items
                  </p>
                )}
              </div>
            )}

            {/* Remaining Items */}
            {sortedRemainingItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  📋 To Buy ({sortedRemainingItems.length})
                </h3>
                <div className="space-y-2">
                  {sortedRemainingItems.map((item) => (
                    <GroceryItemCard
                      key={item.id}
                      item={item}
                      onToggle={handleToggleItem}
                      onUpdate={handleUpdateItem}
                      onRemove={handleDeleteItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Add Item Modal */}
      {showNewItemModal && selectedList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Item</h3>
              <button
                onClick={() => setShowNewItemModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateItem();
            }} className="space-y-4">
              <Input
                placeholder="Item name *"
                required
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Quantity"
                  defaultValue="1"
                />
                <Input
                  placeholder="Unit (kg, pcs, etc.)"
                  defaultValue="pcs"
                />
              </div>

              <Select
                label="Category"
                value="other"
                options={[
                  { label: 'Produce', value: 'produce' },
                  { label: 'Dairy', value: 'dairy' },
                  { label: 'Meat', value: 'meat' },
                  { label: 'Bakery', value: 'bakery' },
                  { label: 'Frozen', value: 'frozen' },
                  { label: 'Household', value: 'household' },
                  { label: 'Beverages', value: 'beverages' },
                  { label: 'Snacks', value: 'snacks' },
                  { label: 'Pantry', value: 'pantry' },
                  { label: 'Other', value: 'other' },
                ]}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Est. Price (AZN)"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="Restock @ Qty"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Notes</label>
                <Input
                  placeholder="Additional notes..."
                  type="textarea"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  Add Item
                </Button>
                <Button variant="secondary" onClick={() => setShowNewItemModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};