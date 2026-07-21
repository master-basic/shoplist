import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Select } from './Select';

describe('Select', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  afterEach(() => {
    cleanup();
  });

  it('should render label correctly', () => {
    render(<Select label="Test Label" options={options} />);
    expect(screen.getByText('Test Label')).toBeDefined();
  });

  it('should render select correctly', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('should show error message when error is provided', () => {
    render(<Select options={options} error="Error message" />);
    const error = screen.getByRole('alert');
    expect(error.textContent).toBe('Error message');
  });

  it('should show helper text when helperText is provided', () => {
    render(<Select options={options} helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeDefined();
  });

  it('should render options correctly', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeDefined();
  });

  it('should show placeholder correctly', () => {
    render(<Select options={options} placeholder="Placeholder text" />);
    expect(screen.getByRole('option', { name: 'Placeholder text' })).toBeDefined();
  });
});
