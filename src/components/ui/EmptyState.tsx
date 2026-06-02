// =====================================================
// GroceryMind - Empty State Component
// =====================================================

import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  [key: string]: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description = '', 
  icon, 
  actionLabel, 
  onAction,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`} {...props}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};