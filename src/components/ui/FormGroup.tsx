// =====================================================
// FormGroup Component
// =====================================================

import React from 'react';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

export interface FormGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  required,
  error,
  children,
  className = '',
  htmlFor,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <FormLabel htmlFor={htmlFor} required={required}>
        {label}
      </FormLabel>
      {children}
      {error && <FormError message={error} />}
    </div>
  );
};