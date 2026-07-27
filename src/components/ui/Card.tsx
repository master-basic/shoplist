// =====================================================
// Card Component
// =====================================================

import React from 'react';

export interface CardProps {
  className?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  className = '', 
  title, 
  subtitle,
  children,
  actionButton,
  onClick
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
      {...(onClick ? { role: 'button', tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } } : {})}
    >
      {(title || actionButton) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actionButton && <div>{actionButton}</div>}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};