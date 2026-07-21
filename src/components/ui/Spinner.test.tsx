import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render correctly', () => {
    render(<Spinner />);
    const svg = document.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('should render text if provided', () => {
    render(<Spinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('should apply correct size class', () => {
    render(<Spinner size="lg" />);
    const svg = document.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('h-12 w-12');
  });
});
