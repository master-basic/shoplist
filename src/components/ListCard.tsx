// =====================================================
// GroceryMind - List Card Component
// =====================================================

import { useState } from 'react';
import { GroceryList, ListItem } from '@store/useStore';

interface ListCardProps {
  list: GroceryList;
  items: ListItem[];
  onOpen: (list: GroceryList) => void;
  onArchive: (listId: string) => void;
}

export function ListCard({ list, items, onOpen, onArchive }: ListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const itemCount = items.length;
  const checkedCount = items.filter(i => i.checked_by).length;
  const progress = itemCount > 0 ? Math.round((checkedCount / itemCount) * 100) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AZ', {
      style: 'currency',
      currency: 'AZN',
    }).format(price);
  };

  const totalEstimated = items.reduce((sum, item) => sum + (item.estimated_price || 0), 0);

  const getStatusBadge = () => {
    switch (list.status) {
      case 'active':
        return {
          text: 'Active',
          bg: 'bg-green-100',
          textColor: 'text-green-700',
          dot: 'bg-green-500'
        };
      case 'completed':
        return {
          text: 'Completed',
          bg: 'bg-blue-100',
          textColor: 'text-blue-700',
          dot: 'bg-blue-500'
        };
      case 'archived':
        return {
          text: 'Archived',
          bg: 'bg-slate-100',
          textColor: 'text-slate-600',
          dot: 'bg-slate-400'
        };
      default:
        return {
          text: 'Active',
          bg: 'bg-green-100',
          textColor: 'text-green-700',
          dot: 'bg-green-500'
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div
      onClick={() => onOpen(list)}
      className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-slate-900">{list.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bg} ${status.textColor}`}>
              {status.text}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Created by {list.created_by} • {new Date(list.created_at).toLocaleDateString('en-AZ')}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (list.status === 'archived') {
              onOpen(list);
            } else {
              setIsDeleting(!isDeleting);
            }
          }}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          title={list.status === 'archived' ? 'View list' : 'Archive list'}
        >
          {isDeleting ? (
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">
            {checkedCount}/{itemCount} items
          </span>
          <span className="text-sm font-medium text-slate-700">
            {formatPrice(totalEstimated)}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Budget indicator */}
      {list.budget && totalEstimated >= list.budget && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ Budget exceeded by {formatPrice(totalEstimated - list.budget)}
          </p>
        </div>
      )}

      {/* Archive confirmation */}
      {isDeleting && list.status !== 'archived' && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">
            Archive this list? It will be moved to archived lists.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onArchive(list.id)}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Archive
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
