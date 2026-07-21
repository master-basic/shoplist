// =====================================================
// Checkbox Component
// =====================================================

import React, { forwardRef, useRef, useLayoutEffect, useImperativeHandle } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, indeterminate, id, checked, ...props }, ref) => {
    const checkboxId = id || props.name;
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    useLayoutEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            ref={innerRef}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className={`
              h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300
              checked:bg-green-600 checked:border-green-600
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              transition-colors duration-200
              ${className}
            `}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            {...props}
          />
          {indeterminate && (
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-sm"
              style={{ 
                display: checked ? 'block' : 'none' 
              }}
            />
          )}
          {checked && !indeterminate && (
            <svg 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white"
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              style={{ display: 'block' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        {label && (
          <label htmlFor={checkboxId} className="select-none cursor-pointer text-gray-700">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
