// =====================================================
// GroceryMind - Category Group Component
// =====================================================

import { useState } from 'react';
import { ListItem } from '@/types';
import { GroceryItemCard } from './GroceryItemCard';

interface CategoryGroupProps {
  category: string;
  items: ListItem[];
  onToggle: (itemId: string) => void;
  onUpdate: (item: ListItem) => void;
  onRemove: (itemId: string) => void;
  readOnly?: boolean;
}

export function CategoryGroup({ 
  category, 
  items, 
  onToggle, 
  onUpdate, 
  onRemove,
  readOnly = false 
}: CategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const categoryColors: Record<string, string> = {
    produce: 'bg-green-100 text-green-700',
    dairy: 'bg-blue-100 text-blue-700',
    meat: 'bg-red-100 text-red-700',
    bakery: 'bg-amber-100 text-amber-700',
    frozen: 'bg-indigo-100 text-indigo-700',
    household: 'bg-slate-100 text-slate-700',
    beverages: 'bg-cyan-100 text-cyan-700',
    snacks: 'bg-orange-100 text-orange-700',
    other: 'bg-purple-100 text-purple-700',
  };

  const categoryColor = categoryColors[category] || categoryColors.other;

  const totalItems = items.length;
  const checkedItems = items.filter(i => i.checked_by).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-2">
      {/* Category header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${categoryColor}`}></div>
          <span className="font-medium text-slate-700">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{checkedItems}/{totalItems}</span>
            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <svg 
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Items list */}
      {isExpanded && items.length > 0 && (
        <div className="space-y-2 pl-3 border-l-2 border-slate-100 ml-3">
          {items.map(item => (
            <GroceryItemCard
              key={item.id}
              item={item}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onRemove={onRemove}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}
