// =====================================================
// FormLabel Component
// =====================================================

import React from 'react';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, children, required, className = '', ...props }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};