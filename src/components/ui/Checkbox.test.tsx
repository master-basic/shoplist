import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render label correctly', () => {
    render(<Checkbox label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeDefined();
  });

  it('should render checkbox correctly', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeDefined();
  });

  it('should show checkmark when checked is true', () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(true);
  });

  it('should show indeterminate state when indeterminate is true', () => {
    render(<Checkbox indeterminate />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.indeterminate).toBe(true);
  });
});
