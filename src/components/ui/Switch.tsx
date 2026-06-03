// =====================================================
// Switch Component
// =====================================================

import React, { forwardRef } from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onChange, label, id }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          />
          <div
            className={`
              w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer
              ${checked ? 'bg-green-600' : 'bg-gray-300'}
            `}
            onClick={() => onChange(!checked)}
            role="switch"
            aria-checked={checked}
            aria-label={label || 'Switch'}
          >
            <div
              className={`
                absolute top-1 left-1 w-4 h-4 bg-white rounded-full
                transition-transform duration-200
                ${checked ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </div>
        </div>
        {label && (
          <label htmlFor={switchId} className="select-none cursor-pointer text-gray-700">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';