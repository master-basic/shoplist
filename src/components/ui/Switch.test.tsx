import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render label correctly', () => {
    render(<Switch checked={false} onChange={() => {}} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeDefined();
  });

  it('should render the switch element', () => {
    render(<Switch checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeDefined();
  });

  it('should call onChange when clicked', () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} />);
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should update appearance when checked', () => {
    render(<Switch checked={true} onChange={() => {}} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement.getAttribute('aria-checked')).toBe('true');
  });
});
