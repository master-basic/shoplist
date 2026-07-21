import React, { useState, useEffect } from 'react';
import { Card, Button, EmptyState, Badge, Input, SkeletonCard } from '../components/ui';
import { PurchaseConfirmModal } from '../components/PurchaseConfirmModal';
import { useStore } from '../store/useStore';
import { getUserLists } from '../api/lists';
import { useLogRender } from '@/hooks/useLogRender';
import { apiFetch } from '@/api/client';
import log from '@/utils/debug';

export const ShoppingPage: React.FC = () => {
  useLogRender('ShoppingPage');
  const { user, lists, addList, toggleItem } = useStore();
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [shoppingMode, setShoppingMode] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [hideChecked, setHideChecked] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState<any[]>([]);
  const [itemPrices, setItemPrices] = useState<Record<string, number>>({});

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
          if (existing) {
            useStore.setState({ lists: lists.map((l) => l.id === list.id ? list : l) });
          } else {
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

  const handleOpenPurchaseModal = () => {
    if (!selectedListId || !user?.id) return;
    const list = lists.find((l) => l.id === selectedListId);
    if (!list) return;
    const items = list.items.filter((i: any) => i.is_checked).map((i: any) => ({
      listItemId: i.id,
      name: i.name,
      quantity: i.quantity || 1,
      unitPrice: itemPrices[i.id] !== undefined ? itemPrices[i.id] : (i.estimated_price || 0),
    }));
    setPurchaseItems(items);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async (updatedItems: any[]) => {
    if (!selectedListId || !user?.id) return;
    setCompleting(true);
    try {
      const res = await apiFetch('/api/purchase-sessions', {
        method: 'POST',
        body: JSON.stringify({
          listId: selectedListId,
          storeName: storeName || 'Unknown',
          userId: user.id,
          items: updatedItems,
        }),
      });
      if (!res.ok) {
        log.error('ShoppingPage: complete purchase failed', { status: res.status });
      }
      setShowPurchaseModal(false);
      setShoppingMode(false);
      setSelectedListId(null);
    } catch (err) {
      console.error('Error completing purchase:', err);
    } finally {
      setCompleting(false);
    }
  };

  const selectedList = lists.find((l) => l.id === selectedListId);
  const allItems = selectedList ? selectedList.items || [] : [];
  const totalItems = allItems.length;
  const completedItems = allItems.filter((item: any) => item.is_checked).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const visibleItems = hideChecked ? allItems.filter((i: any) => !i.is_checked) : allItems;

  const getStatusVariant = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | undefined => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'archived': return 'secondary';
      default: return undefined;
    }
  };

  if (shoppingMode && selectedList) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShoppingMode(false)} className="p-2 hover:bg-gray-100 rounded-lg text-xl">&larr;</button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedList.name}</h2>
              <p className="text-sm text-gray-500">{completedItems}/{totalItems} checked</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={hideChecked} onChange={(e) => setHideChecked(e.target.checked)} className="w-4 h-4" />
              Hide checked
            </label>
            <div className="w-32 bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-green-500 transition-all" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
          {visibleItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">All done!</h3>
              <p className="text-gray-500 mb-4">Every item has been checked off.</p>
              <Button onClick={handleOpenPurchaseModal} variant="primary" size="lg">Complete Purchase</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {visibleItems.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(selectedList.id, item.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    item.is_checked
                      ? 'bg-green-50 border-green-300 opacity-60'
                      : 'bg-white border-gray-200 hover:border-green-300 active:scale-[0.99]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                    item.is_checked ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {item.is_checked ? '✓' : ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg font-medium truncate ${item.is_checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {item.name}
                    </p>
                    {item.is_checked && (
                      <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                        <label className="text-[10px] uppercase text-gray-400 font-bold">Price</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={itemPrices[item.id] !== undefined ? itemPrices[item.id] : (item.estimated_price || 0)}
                          onChange={(e: any) => setItemPrices((prev) => ({ ...prev, [item.id]: parseFloat(e.target.value) || 0 }))}
                          className="h-8 w-24 text-sm"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      {item.quantity || 1} {item.unit || 'pcs'} {item.estimated_price ? `• ${(item.estimated_price * (item.quantity || 1)).toFixed(2)} AZN` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-2xl mx-auto flex gap-3 items-center">
            <Input
              placeholder="Store name (e.g. Bravo)"
              value={storeName}
              onChange={(e: any) => setStoreName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleOpenPurchaseModal}
              variant="primary"
              size="lg"
              disabled={completedItems === 0}
            >
              Complete Purchase ({completedItems})
            </Button>
          </div>
        </div>

        <PurchaseConfirmModal
          isOpen={showPurchaseModal}
          items={purchaseItems}
          storeName={storeName || 'Unknown'}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setShowPurchaseModal(false)}
          isLoading={completing}
        />
      </div>
    );
  }

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
    return <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
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
                      variant="primary"
                      onClick={() => { setSelectedListId(list.id); setShoppingMode(true); }}
                    >
                      Shop
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
