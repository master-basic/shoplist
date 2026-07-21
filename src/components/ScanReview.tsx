import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Checkbox } from './ui/Checkbox';

export interface OCRItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface EditableItem extends OCRItem {
  checked: boolean;
  id: number;
}

interface ScanReviewProps {
  items: OCRItem[];
  storeName: string;
  onSave: (items: OCRItem[]) => void;
  onDiscard: () => void;
  isLoading?: boolean;
}

export const ScanReview: React.FC<ScanReviewProps> = ({
  items,
  storeName,
  onSave,
  onDiscard,
  isLoading,
}) => {
  const [editableItems, setEditableItems] = useState<EditableItem[]>(
    items.map((item, idx) => ({ ...item, checked: true, id: idx }))
  );

  const handleToggle = (id: number) => {
    setEditableItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleEdit = (id: number, field: keyof OCRItem, value: string) => {
    setEditableItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [field]: field === 'name' ? value : Number(value) || 0 }
          : item
      )
    );
  };

  const handleSave = () => {
    const filtered = editableItems
      .filter(item => item.checked)
      .map(({ checked, id, ...rest }) => rest);
    onSave(filtered);
  };

  const checkedCount = editableItems.filter(i => i.checked).length;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{storeName}</h3>
            <p className="text-sm text-gray-500">{checkedCount} of {items.length} items selected</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {editableItems.map(item => (
          <Card key={item.id}>
            <div className="flex items-start gap-3">
              <Checkbox
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
                className="mt-2"
              />
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  value={item.name}
                  onChange={e => handleEdit(item.id, 'name', e.target.value)}
                  disabled={!item.checked}
                  placeholder="Item name"
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleEdit(item.id, 'quantity', e.target.value)}
                  disabled={!item.checked}
                  placeholder="Qty"
                  min="0"
                  step="1"
                />
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={e => handleEdit(item.id, 'unitPrice', e.target.value)}
                  disabled={!item.checked}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} isLoading={isLoading} className="flex-1">
          Save All ({checkedCount})
        </Button>
        <Button onClick={onDiscard} variant="outline" disabled={isLoading} className="flex-1">
          Discard
        </Button>
      </div>
    </div>
  );
};
