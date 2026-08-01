import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import ModelLabClient from './ModelLabClient';

// Mock dependencies
vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ isLoggedIn: true })
}));

vi.mock('@/components/model-lab/ModelLabHero', () => ({
  default: () => <div data-testid="hero-mock" />
}));

vi.mock('@/components/model-lab/ModelLabTabs', () => ({
  default: () => <div data-testid="tabs-mock" />
}));

describe('ModelLabClient Dark Mode', () => {
  it('should have dark mode classes applied to the main container', () => {
    const { container } = render(<ModelLabClient hideHero={true} />);
    const mainDiv = container.firstChild as HTMLElement;
    
    // Check for the required dark mode classes
    expect(mainDiv).toHaveClass('dark:bg-slate-800');
    expect(mainDiv).toHaveClass('dark:text-white');
  });
});
