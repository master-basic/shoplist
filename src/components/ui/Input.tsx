// =====================================================
// Input Component
// =====================================================

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}{props.required && <span className="text-red-500 ml-1">*</span>}
        </label>}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2
              border rounded-lg
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              disabled:bg-gray-100 disabled:text-gray-500
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${className}
            `}
            {...props}
          />
        </div>
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';