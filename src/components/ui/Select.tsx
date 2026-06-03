// =====================================================
// Select Component
// =====================================================

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, label, error, helperText, id, ...props }, ref) => {
    const selectId = id || props.name;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full rounded-lg border px-3 py-2 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              transition-colors duration-200
              bg-white
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>Select an option</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';