// =====================================================
// GroceryMind - List Detail Page
// =====================================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { CategoryGroup } from '../components/CategoryGroup';
import { AddItemModal } from '../components/AddItemModal';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/formatCurrency';
import { ShoppingMode } from '../components/ShoppingMode';
import { ListItem } from '../types';

export default function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lists, addItemToList, deleteListItem, toggleItem, updateItem } = useStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShoppingMode, setShowShoppingMode] = useState(false);
  
  // Callbacks for CategoryGroup
  const handleItemToggle = (itemId: string) => {
    toggleItem(id!, itemId);
  };
  
  const handleItemUpdate = (item: ListItem) => {
    updateItem(id!, item.id, { ...item, checked_by: undefined });
  };
  
  const handleItemRemove = (itemId: string) => {
    deleteListItem(id!, itemId);
  };
  
  const handleAddItem = (itemData: Omit<ListItem, 'id' | 'list_id' | 'created_at' | 'updated_at'>) => {
    addItemToList(id!, { ...itemData, checked_by: undefined, list_id: id!, sort_order: items.length });
  };
  
  const list = lists.find((l) => l.id === id);
  const items = list?.items || [];
  
  // Sort items by category
  const groupedItems: { [key: string]: ListItem[] } = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as { [key: string]: ListItem[] });
  
  // Calculate stats
  const totalItems = items.length;
  const checkedItems = items.filter((i) => i.checked_by).length;
  const estimatedTotal = items.reduce((sum, item) => {
    return sum + (item.estimated_price || 0) * (item.quantity || 1);
  }, 0);
  
  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="List not found"
          description="The list you're looking for doesn't exist."
          actionLabel="Go Home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{list.name}</h1>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  list.status === 'active' ? 'bg-green-100 text-green-700' :
                  list.status === 'completed' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {list.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {checkedItems} / {totalItems} items • {formatCurrency(estimatedTotal)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowShoppingMode(true)}
                className="hidden sm:flex"
              >
                Shopping Mode
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                + Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <EmptyState
            title="No items yet"
            description="Add your first grocery item to get started"
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>}
            actionLabel="Add Item"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <>
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <CategoryGroup
                key={category}
                category={category}
                items={categoryItems}
                onToggle={handleItemToggle}
                onUpdate={handleItemUpdate}
                onRemove={handleItemRemove}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddItem}
          existingItems={items}
        />
      )}
      
      {/* Shopping Mode Modal */}
      {showShoppingMode && (
        <ShoppingMode
          listId={id!}
          items={items}
          onClose={() => setShowShoppingMode(false)}
        />
      )}
    </div>
  );
}