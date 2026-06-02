// =====================================================
// GroceryMind - Shopping Mode Component
// =====================================================

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../hooks/useAuth';

interface ShoppingModeProps {
  listId: string;
  items: any[];
  onClose: () => void;
}

export const ShoppingMode: React.FC<ShoppingModeProps> = ({ listId, items, onClose }) => {
  const { user } = useAuth();
  const { addItemToList, deleteListItem, toggleItem, updateItem } = useStore();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [storeName, setStoreName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Group items by checked status
  const uncheckedItems = items.filter(i => !i.isChecked);
  const checkedItems = items.filter(i => i.isChecked);

  const handleItemToggle = (item: any) => {
    if (item.isChecked) {
      // If checking off, add to selected for purchase
      setSelectedItems([...selectedItems, item]);
    } else {
      // If unchecking, remove from selected
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    }
    toggleItem(listId, item.id);
  };

  const handleAddItem = (itemData: any) => {
    addItemToList(listId, itemData);
  };

  const handleConfirmPurchase = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    // Simulate purchase submission
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 1000);
  };

  const totalEstimated = selectedItems.reduce((sum, item) => {
    return sum + (item.estimatedPrice || 0) * (item.quantity || 1);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Shopping Mode</h2>
            <p className="text-sm text-slate-500">Check off items as you shop</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Unchecked Items */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              To Buy ({uncheckedItems.length})
            </h3>
            <div className="space-y-3">
              {uncheckedItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  All items checked off!
                </div>
              ) : (
                uncheckedItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleItemToggle(item)}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        {item.quantity} {item.unit} • {item.category}
                      </p>
                    </div>
                    {item.estimatedPrice && (
                      <span className="text-sm font-medium text-slate-700">
                        {formatCurrency(item.estimatedPrice)}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checked Items Summary */}
          {checkedItems.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Purchased ({checkedItems.length})
              </h3>
              <div className="space-y-2">
                {checkedItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 line-through opacity-70">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Estimated Total:</span>
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(totalEstimated)}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={selectedItems.length === 0 || isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};