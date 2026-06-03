// =====================================================
// Shopping Page Component
// =====================================================

import React, { useState, useEffect } from 'react';
import { Card, Button, EmptyState, Badge, Spinner } from '../components/ui';
import { GroceryItemCard } from '../components/GroceryItemCard';
import { useStore } from '../store/useStore';

export const ShoppingPage: React.FC = () => {
  const { lists, addItemToList, deleteList, toggleItem, updateItem, deleteListItem, archiveList } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleBack = () => {
    window.location.href = '/lists';
  };

  const fetchLists = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/lists/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        data.lists.forEach((list: any) => {
          const existingIndex = lists.findIndex((l: any) => l.id === list.id);
          if (existingIndex >= 0) {
            lists[existingIndex] = list;
          } else {
            lists.push(list);
          }
        });
        return data;
      }
    } catch (err) {
      console.error('Error fetching lists:', err);
    }
    return { lists };
  };

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
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'archived':
        return 'secondary';
      default:
        return undefined;
    }
  };

  if (lists.length === 0) {
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
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleBack}
                className="mb-2 text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <span>←</span>
                <span>Back to Lists</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Shopping Mode
              </h1>
              <p className="text-gray-600 mt-1">
                Tap items as you shop
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Progress Overview */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Shopping Progress</h3>
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

        {/* Shopping Lists */}
        {lists.length === 0 ? (
          <Card>
            <EmptyState
              title="No Shopping Lists"
              description="Create a shopping list to start your grocery shopping"
              icon="🛒"
              actionLabel="Create List"
              onAction={handleBack}
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
                  <Badge variant={getStatusVariant(list.status)}>
                    {list.status}
                  </Badge>
                </div>

                {list.items?.length === 0 ? (
                  <EmptyState
                    title="No Items"
                    description="Add items to this list"
                    icon="📦"
                    actionLabel="Add Item"
                    onAction={() => {}}
                  />
                ) : (
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
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};