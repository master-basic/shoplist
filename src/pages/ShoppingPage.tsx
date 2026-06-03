// =====================================================
// Shopping Page Component
// =====================================================

import React, { useState, useEffect } from 'react';
import { Card, Button, EmptyState, Badge, Spinner } from '../components/ui';
import { GroceryItemCard } from '../components/GroceryItemCard';

const useAuth = () => {
  const isAuthenticated = !!localStorage.getItem('user_id');
  const user = React.useMemo(() => {
    return {
      id: localStorage.getItem('user_id') || '',
      name: localStorage.getItem('user_name') || 'User',
      email: localStorage.getItem('user_email') || '',
    };
  }, []);
  return { isAuthenticated, user };
};

export const ShoppingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const handleBack = () => {
    window.location.href = '/lists';
  };

  const fetchLists = async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://shoplist-api.onrender.com/lists/user/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          return data.lists;
        }
      } catch (err) {
        console.error('Error fetching lists:', err);
      }
    }
    return [];
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchLists().then(setLists).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const selectedLists = React.useMemo(() => {
    return lists.filter((list: any) => list.status === 'active' && list.is_my_list);
  }, [lists]);

  const totalLists = selectedLists.length;
  const totalItems = selectedLists.reduce((sum: number, list: any) => sum + list.items.length, 0);
  const completedItems = selectedLists.reduce((sum: number, list: any) => {
    return sum + list.items.filter((item: any) => item.checked_by).length;
  }, 0);
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Flatten all items from selected lists
  const allItems = selectedLists.flatMap((list: any) => list.items);

  if (!isAuthenticated) {
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

  if (selectedLists.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          title="No Shopping Lists"
          description="Create a shopping list to start your grocery shopping"
          icon="🛒"
          actionLabel="Create List"
          onAction={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-2 text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to Lists</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Shopping Lists
          </h1>
          <p className="text-gray-600 mt-1">
            {totalLists} {totalLists === 1 ? 'list' : 'lists'} • {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </p>
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
        {allItems.length === 0 ? (
          <Card>
            <EmptyState
              title="No Items in Shopping Lists"
              description="Add items to your shopping lists to start"
              icon="🛒"
              actionLabel="Create List"
              onAction={handleBack}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Group by list */}
            {selectedLists.map((list: any) => (
              <Card key={list.id}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <div>
                    <h3 className="font-semibold text-gray-800">{list.name}</h3>
                    <p className="text-sm text-gray-600">
                      {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <Badge variant={list.status === 'active' ? 'primary' : 'secondary'}>
                    {list.status}
                  </Badge>
                </div>

                {list.items.length === 0 ? (
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
                        onToggle={() => {}}
                        onUpdate={() => {}}
                        onRemove={() => {}}
                        readOnly
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