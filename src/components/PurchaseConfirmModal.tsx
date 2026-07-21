import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Skeleton } from './ui';

interface PurchaseItem {
  listItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface PurchaseConfirmModalProps {
  isOpen: boolean;
  items: PurchaseItem[];
  storeName: string;
  onConfirm: (updatedItems: PurchaseItem[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const PurchaseConfirmModal: React.FC<PurchaseConfirmModalProps> = ({
  isOpen,
  items,
  storeName,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const [editedItems, setEditedItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEditedItems([...items]);
    }
  }, [isOpen, items]);

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, quantity: number) => {
    setEditedItems((prev) =>
      prev.map((item) => (item.listItemId === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const handlePriceChange = (id: string, price: number) => {
    setEditedItems((prev) =>
      prev.map((item) => (item.listItemId === id ? { ...item, unitPrice: Math.max(0, price) } : item))
    );
  };

  const totalAmount = editedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🛍️</div>
          <h3 className="text-lg font-semibold text-gray-800">Complete Purchase</h3>
          <p className="text-sm text-gray-600">
            Review items for <strong className="text-gray-800">{storeName || 'Unknown Store'}</strong>
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {editedItems.map((item) => (
            <div key={item.listItemId} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="font-medium text-gray-800 mb-2 truncate">{item.name}</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-gray-500 font-bold">Qty</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.listItemId, parseInt(e.target.value) || 1)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 font-bold">Price (AZN)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handlePriceChange(item.listItemId, parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 mb-6">
          <div className="flex justify-between items-center text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>{totalAmount.toFixed(2)} AZN</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(editedItems)}
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? <Skeleton className="h-4 w-16" /> : 'Confirm'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
