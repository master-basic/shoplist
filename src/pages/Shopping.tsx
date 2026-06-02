import React, { useState } from 'react';
import { useStore } from '@store/useStore';
import { formatCurrency } from '@utils/formatCurrency';
import type { ListItem, PriceHistoryItem, PurchaseSession, PurchasedItem } from '@/types';

const Shopping: React.FC = () => {
  const { lists, toggleItem, addPurchasedItem, addPriceHistory, purchaseSessions, addPurchaseSession, user } = useStore();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; itemId: string; item: ListItem | null } | null>(null);
  const [notBoughtDialog, setNotBoughtDialog] = useState<{ show: boolean; itemId: string; item: ListItem | null } | null>(null);

  const selectedList = selectedListId ? lists.find((l) => l.id === selectedListId) : null;

  const handleToggleItem = (itemId: string) => {
    const item = selectedList?.items.find((i) => i.id === itemId);
    if (item) {
      if (item.is_checked) {
        // Item was bought - ask for confirmation
        setConfirmDialog({ show: true, itemId, item });
      } else {
        // Item unchecked - ask for reason
        setNotBoughtDialog({ show: true, itemId, item });
      }
    }
  };

  const confirmPurchase = (actualPrice?: number, actualQuantity?: number, actualStore?: string) => {
    if (!confirmDialog || !confirmDialog.item) return;
    
    const { itemId, item } = confirmDialog;
    if (!selectedList) return;
    
    // Toggle item (uncheck it since it's now bought)
    toggleItem(selectedList.id, itemId);
    
    // Add to price history
    addPriceHistory({
      id: 'temp-' + Date.now(),
      item_name: item.name,
      store_name: actualStore || item.preferred_store || 'Unknown',
      unit_price: actualPrice !== undefined ? actualPrice : item.estimated_price || 0,
      purchased_at: new Date().toISOString(),
      session_id: '',
      bought_by: user?.id || '',
      quantity: actualQuantity || 1,
    } as PriceHistoryItem);

    // Add to purchase session
    const sessionData: any = {
      id: 'temp-' + Date.now(),
      list_id: selectedList.id,
      bought_by: user?.id || '',
      store_name: actualStore || item.preferred_store || 'Unknown',
      purchase_date: new Date().toISOString(),
      total_paid: (actualPrice !== undefined ? actualPrice : item.estimated_price || 0) * (actualQuantity !== undefined ? actualQuantity : 1),
      items: [],
      created_at: new Date().toISOString(),
    };
    addPurchaseSession(sessionData);

    // Add purchased item
    addPurchasedItem('temp-' + Date.now(), {
      list_item_id: itemId,
      name: item.name,
      quantity: actualQuantity !== undefined ? actualQuantity : item.quantity || 1,
      unit: item.unit,
      unit_price: actualPrice !== undefined ? actualPrice : item.estimated_price || 0,
      total_price: (actualPrice !== undefined ? actualPrice : item.estimated_price || 0) * (actualQuantity !== undefined ? actualQuantity : 1),
      is_on_list: true,
      session_id: 'temp-' + Date.now(),
      created_at: new Date().toISOString(),
    } as Omit<PurchasedItem, 'id'>);

    setConfirmDialog(null);
  };

  const handleNotBought = (reason: string) => {
    if (!notBoughtDialog || !notBoughtDialog.item || !selectedList) return;
    
    const { itemId, item } = notBoughtDialog;
    toggleItem(selectedList.id, itemId);
    setNotBoughtDialog(null);
  };

  const uncheckedItems = selectedList?.items.filter((i) => !i.is_checked) || [];
  const checkedItems = selectedList?.items.filter((i) => i.is_checked) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Shopping Mode</h1>
          
          {/* List Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select List</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={selectedListId || ''}
              onChange={(e) => setSelectedListId(e.target.value || null)}
            >
              <option value="">Choose a list...</option>
              {lists
                .filter((l) => l.status === 'active')
                .map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
            </select>
          </div>

          {selectedList && (
            <>
              {/* Summary */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">
                    {checkedItems.length} items bought, {uncheckedItems.length} remaining
                  </span>
                  <span className="text-sm text-green-700 font-medium">
                    {formatCurrency(checkedItems.reduce((sum, i) => sum + (i.actual_price || i.estimated_price || 0), 0))}
                  </span>
                </div>
              </div>

              {/* Checked Items - Completed */}
              {checkedItems.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">Completed</h2>
                  <div className="space-y-2">
                    {checkedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-green-100 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 line-through">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.actual_price !== undefined ? formatCurrency(item.actual_price) : formatCurrency(item.estimated_price)}
                              {item.actual_quantity !== undefined ? ` x${item.actual_quantity}` : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unchecked Items - To Buy */}
              {uncheckedItems.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">To Buy</h2>
                  <div className="space-y-3">
                    {uncheckedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center gap-4"
                      >
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex items-center justify-center min-w-[32px] min-h-[32px]"
                        >
                          {item.is_checked && (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit} • {formatCurrency(item.estimated_price || 0)}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirm Purchase Dialog */}
      {confirmDialog?.show && confirmDialog.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Item Bought</h3>
            <p className="text-gray-600 mb-4">{confirmDialog.item.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  defaultValue={confirmDialog.item.estimated_price || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  defaultValue={confirmDialog.item.quantity || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  defaultValue={confirmDialog.item.preferred_store || ''}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmPurchase()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not Bought Dialog */}
      {notBoughtDialog?.show && notBoughtDialog.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Item Not Bought</h3>
            <p className="text-gray-600 mb-4">{notBoughtDialog.item.name}</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => handleNotBought(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="out_of_stock">Out of stock</option>
                <option value="forgot">Forgot</option>
                <option value="too_expensive">Too expensive</option>
                <option value="already_have">Already have it</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setNotBoughtDialog(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedList && handleNotBought('other')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark as Not Bought
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shopping;