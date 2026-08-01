import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import ConnectorsPage from './page';

vi.mock('./ConnectorsClient', () => ({
  default: () => <div data-testid="connectors-client-mock" />
}));

describe('ConnectorsPage Dark Mode Wrapper', () => {
  it('should have dark mode background and text classes on the main wrapper', () => {
    const { container } = render(<ConnectorsPage />);
    const mainElement = container.firstChild as HTMLElement;
    
    expect(mainElement.tagName.toLowerCase()).toBe('main');
    expect(mainElement).toHaveClass('dark:bg-slate-900');
    expect(mainElement).toHaveClass('dark:text-white');
  });
});
