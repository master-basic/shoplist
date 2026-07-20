import React, { useState, useEffect } from 'react';
import { Card, Button, EmptyState, Badge, Spinner } from '../components/ui';
import { GroceryItemCard } from '../components/GroceryItemCard';
import { useStore } from '../store/useStore';
import { getUserLists } from '../api/lists';

export const ShoppingPage: React.FC = () => {
  const { user, lists, addList, toggleItem, updateItem, deleteListItem } = useStore();
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const fetchedLists = await getUserLists(user.id);
        for (const list of fetchedLists) {
          const existing = lists.find((l) => l.id === list.id);
          if (!existing) {
            addList(list);
          }
        }
      } catch (err) {
        console.error('Error fetching lists:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, [user?.id]);

  const handleToggleItem = (listId: string, itemId: string) => {
    toggleItem(listId, itemId);
  };

  const handleUpdateItem = (listId: string, item: any) => {
    updateItem(listId, item.id, item);
  };

  const handleRemoveItem = (listId: string, itemId: string) => {
    deleteListItem(listId, itemId);
  };

  const selectedList = lists.find((l) => l.id === selectedListId);
  const allItems = selectedList ? selectedList.items || [] : [];
  const totalItems = allItems.length;
  const completedItems = allItems.filter((item: any) => item.is_checked).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getStatusVariant = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | undefined => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'archived': return 'secondary';
      default: return undefined;
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          title="Please Log In"
          description="You need to be logged in to view shopping lists"
          icon="🔐"
          actionLabel="Go to Login"
          onAction={() => window.location.href = '/login'}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Mode</h1>
          <p className="text-gray-600 mt-1">Tap items as you shop</p>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {selectedList && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{selectedList.name} - Progress</h3>
                <p className="text-sm text-gray-600">
                  {completedItems} / {totalItems} items completed
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-green-600">{completionPercentage}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-green-500 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </Card>
        )}

        {lists.length === 0 ? (
          <Card>
            <EmptyState
              title="No Shopping Lists"
              description="Create a shopping list to start your grocery shopping"
              icon="🛒"
              actionLabel="Go to Lists"
              onAction={() => window.location.href = '/lists'}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lists.map((list: any) => (
              <Card key={list.id} className="h-full">
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <div>
                    <h3 className="font-semibold text-gray-800">{list.name}</h3>
                    <p className="text-sm text-gray-600">
                      {list.items?.length || 0} {list.items?.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusVariant(list.status)}>
                      {list.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant={selectedListId === list.id ? 'primary' : 'secondary'}
                      onClick={() => setSelectedListId(selectedListId === list.id ? null : list.id)}
                    >
                      {selectedListId === list.id ? 'Close' : 'Shop'}
                    </Button>
                  </div>
                </div>

                {selectedListId === list.id && list.items?.length > 0 ? (
                  <div className="space-y-2">
                    {list.items.map((item: any) => (
                      <GroceryItemCard
                        key={item.id}
                        item={item}
                        onToggle={() => handleToggleItem(list.id, item.id)}
                        onUpdate={() => handleUpdateItem(list.id, item)}
                        onRemove={() => handleRemoveItem(list.id, item.id)}
                      />
                    ))}
                  </div>
                ) : list.items?.length === 0 ? (
                  <EmptyState
                    title="No Items"
                    description="Add items to this list from the Lists page"
                    icon="📦"
                  />
                ) : selectedListId !== list.id ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Click "Shop" to start checking off items
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
