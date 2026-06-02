// =====================================================
// GroceryMind - Card Component
// =====================================================

import React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};