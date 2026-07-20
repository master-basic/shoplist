// =====================================================
// Select Component
// =====================================================

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'multiple'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, helperText, options, placeholder = 'Select an option', id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}{props.required && <span className="text-red-500 ml-1">*</span>}
        </label>}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full px-3 py-2 pr-10
              bg-white border border-gray-300 rounded-lg
              text-gray-900
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              disabled:bg-gray-100 disabled:text-gray-500
              appearance-none cursor-pointer
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon && (
                  <span className="flex items-center">
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </span>
                )}
                {!option.icon && option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

Select.displayName = 'Select';