import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import AIEnginePage from './page';

// Mocking the heavily involved client component
vi.mock('@/app/model-lab/ModelLabClient', () => ({
  default: () => <div data-testid="model-lab-client-mock" />
}));

beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
});

describe('AIEnginePage Dark Mode Wrapper', () => {
  it('should have a dark mode background class on the main wrapper', () => {
    const { container } = render(<AIEnginePage />);
    const mainElement = container.firstChild as HTMLElement;
    
    expect(mainElement.tagName.toLowerCase()).toBe('main');
    // We expect dark:bg-slate-900 or dark:bg-[#0B0F1A] as per design. Using slate-900 as standard fallback.
    // The visual check showed it's meant to be dark.
    expect(mainElement).toHaveClass('dark:bg-slate-900');
  });
});
