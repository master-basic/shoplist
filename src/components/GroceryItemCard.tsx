// =====================================================
// GroceryMind - Grocery Item Card Component
// =====================================================

import { useState } from 'react';
import type { ListItem } from '@/types';

interface HouseholdMember {
  id: string;
  name: string;
}

interface GroceryItemCardProps {
  item: ListItem;
  onToggle: (itemId: string) => void;
  onUpdate: (item: ListItem) => void;
  onRemove: (itemId: string) => void;
  onNotBought?: (itemId: string, reason: string) => void;
  members?: HouseholdMember[];
  readOnly?: boolean;
}

export function GroceryItemCard({ 
  item, 
  onToggle, 
  onUpdate, 
  onRemove,
  onNotBought,
  members = [],
  readOnly = false 
}: GroceryItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ListItem>(item);
  const [showNotBoughtInput, setShowNotBoughtInput] = useState(false);
  const [notBoughtReason, setNotBoughtReason] = useState('');

  const assigneeName = item.assigned_to?.length > 0
    ? members.find(m => m.id === item.assigned_to[0])?.name || 'Unknown'
    : null;

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(item);
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AZ', {
      style: 'currency',
      currency: 'AZN',
    }).format(price);
  };

  if (readOnly) {
    return (
      <div
        className={`
          bg-white rounded-xl p-4 shadow-sm border transition-all duration-200
          ${item.checked_by 
            ? 'border-green-200 bg-green-50/50' 
            : 'border-slate-200 hover:border-green-300 hover:shadow-md'
          }
        `}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(item.id)}
            className={`
              w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0
              transition-all duration-200
              ${item.checked_by
                ? 'bg-green-500 border-green-500'
                : 'border-slate-300 hover:border-green-500'
              }
            `}
          >
            {item.checked_by && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Item content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={`font-medium text-slate-900 ${item.checked_by ? 'line-through text-slate-400' : ''}`}>
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {item.quantity} {item.unit} • {item.category}
                </p>
                {item.estimated_price > 0 && (
                  <p className="text-sm text-slate-500">
                    {formatPrice(item.estimated_price)}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-slate-400 mt-1">{item.notes}</p>
                )}
                {assigneeName && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                    {assigneeName}
                  </span>
                )}
                {item.not_bought_reason && (
                  <span className="inline-block mt-1 ml-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                    Not bought: {item.not_bought_reason}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white rounded-xl p-4 shadow-sm border transition-all duration-200
        ${item.checked_by
          ? 'border-green-200 bg-green-50/50'
          : 'border-slate-200 hover:border-green-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id)}
          className={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0
            transition-all duration-200
            ${item.checked_by
              ? 'bg-green-500 border-green-500'
              : 'border-slate-300 hover:border-green-500'
            }
          `}
        >
          {item.checked_by && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Item content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Item name"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Qty"
                />
                <input
                  type="text"
                  value={editForm.unit}
                  onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Unit (kg, pcs, etc.)"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={editForm.estimated_price || ''}
                  onChange={(e) => setEditForm({ ...editForm, estimated_price: parseFloat(e.target.value) || 0 })}
                  className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Price"
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="produce">Produce</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="bakery">Bakery</option>
                  <option value="frozen">Frozen</option>
                  <option value="household">Household</option>
                  <option value="beverages">Beverages</option>
                  <option value="snacks">Snacks</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className={`font-medium text-slate-900 ${item.checked_by ? 'line-through text-slate-400' : ''}`}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {item.quantity} {item.unit} • {item.category}
                  </p>
                  {item.estimated_price > 0 && (
                    <p className="text-sm text-slate-500">
                      {formatPrice(item.estimated_price)}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-xs text-slate-400 mt-1">{item.notes}</p>
                  )}
                  {assigneeName && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {assigneeName}
                    </span>
                  )}
                  {item.not_bought_reason && (
                    <span className="inline-block mt-1 ml-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                      Not bought: {item.not_bought_reason}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit item"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {!item.checked_by && onNotBought && (
            <button
              onClick={() => setShowNotBoughtInput(true)}
              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              title="Mark as not bought"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </button>
          )}
          {!item.checked_by && (
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove item"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {showNotBoughtInput && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={notBoughtReason}
            onChange={(e) => setNotBoughtReason(e.target.value)}
            placeholder="Why wasn't this bought?"
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
          <button
            onClick={() => { onNotBought?.(item.id, notBoughtReason); setShowNotBoughtInput(false); setNotBoughtReason(''); }}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600"
          >
            Save
          </button>
          <button
            onClick={() => { setShowNotBoughtInput(false); setNotBoughtReason(''); }}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
