import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render label correctly', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeDefined();
  });

  it('should render input correctly', () => {
    render(<Input />);
    // Use getByRole with name if available, or just check if one exists
    expect(screen.getByRole('textbox')).toBeDefined();
  });

  it('should show error message when error is provided', () => {
    render(<Input error="Invalid input" />);
    const error = screen.getByRole('alert');
    expect(error.textContent).toBe('Invalid input');
  });

  it('should show helper text when helperText is provided', () => {
    render(<Input helperText="Enter your name" />);
    expect(screen.getByText('Enter your name')).toBeDefined();
  });

  it('should show required asterisk when required is true', () => {
    render(<Input label="Required field" required />);
    expect(screen.getByText('*')).toBeDefined();
  });
});
