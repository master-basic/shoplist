// =====================================================
// GroceryMind - Add Item Modal Component
// =====================================================

import { useState, useEffect } from 'react';
import type { ListItem } from '@/types';

interface HouseholdMember {
  id: string;
  name: string;
  email?: string;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ListItem, 'id' | 'list_id' | 'created_at' | 'updated_at'>) => void;
  existingItems?: ListItem[];
  assignees?: HouseholdMember[];
}

export function AddItemModal({ isOpen, onClose, onSubmit, existingItems = [], assignees = [] }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState('produce');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredStore, setPreferredStore] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested items from history
  const suggestedItems = existingItems.slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate
    if (!name.trim()) {
      alert('Please enter an item name');
      setIsSubmitting(false);
      return;
    }

    const item: Omit<ListItem, 'id' | 'list_id' | 'created_at' | 'updated_at'> = {
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      unit: unit.trim(),
      category,
      estimated_price: estimatedPrice ? parseFloat(estimatedPrice) : 0,
      notes: notes.trim() || undefined,
      preferred_store: preferredStore.trim() || undefined,
      sort_order: 0,
      is_recurring: false,
      checked_by: undefined,
      checked_at: undefined,
      is_checked: false,
      actual_price: undefined,
      actual_quantity: undefined,
      assigned_to: assignedTo ? [assignedTo] : [],
      price_history: [],
    };

    onSubmit(item);
    resetForm();
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setName('');
    setQuantity('1');
    setUnit('pcs');
    setCategory('produce');
    setEstimatedPrice('');
    setNotes('');
    setPreferredStore('');
  };

  const handleSuggestionClick = (item: ListItem) => {
    setName(item.name);
    setQuantity(item.quantity.toString());
    setUnit(item.unit);
    setCategory(item.category);
    if (item.estimated_price) {
      setEstimatedPrice(item.estimated_price.toString());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Add New Item</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Milk, Eggs, Bread"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Quantity and Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg, pcs, L, ml"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Category and Price */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estimated Price (AZN)
              </label>
              <input
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Preferred Store */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Preferred Store
            </label>
            <input
              type="text"
              value={preferredStore}
              onChange={(e) => setPreferredStore(e.target.value)}
              placeholder="e.g., Bravo, Lala, G12"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Assignee */}
          {assignees.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Unassigned</option>
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Organic, low-fat, gluten-free"
              rows={2}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Suggested items */}
          {suggestedItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Suggested from your history
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {suggestedItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} {item.unit} • {item.category}
                      </p>
                    </div>
                    {item.estimated_price && (
                      <span className="text-sm text-slate-600">
                        {new Intl.NumberFormat('en-AZ', { style: 'currency', currency: 'AZN' }).format(item.estimated_price)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}