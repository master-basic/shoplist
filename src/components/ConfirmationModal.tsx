// =====================================================
// GroceryMind - Confirmation Modal Component
// =====================================================

import React from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ConfirmationModalProps {
  title: string;
  message: string;
  items?: Array<{ id: string; name: string; quantity?: number }>;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'info' | 'warning' | 'danger' | 'success';
}

export function ConfirmationModal({
  title,
  message,
  items = [],
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'info',
}: ConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🗑️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className={`p-4 rounded-lg mb-4 ${getVariantStyles()}`}>
          <div className="text-3xl mb-2">{getIcon()}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">{message}</p>

          {items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {items.length} {items.length === 1 ? 'item' : 'items'}:
              </p>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-800">{item.name}</span>
                    {item.quantity && (
                      <span className="text-gray-500">{item.quantity} {item.quantity === 1 ? 'pcs' : 'units'}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {confirmText}...
              </span>
            ) : confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
