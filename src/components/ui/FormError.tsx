// =====================================================
// FormError Component
// =====================================================

import React from 'react';

export interface FormErrorProps {
  message: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className = '' }) => {
  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`} role="alert">
      {message}
    </p>
  );
};