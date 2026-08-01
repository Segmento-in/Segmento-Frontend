import { describe, it, expect, vi, beforeAll } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import LocalUploadView from './LocalUploadView';

// Mock the Auth context to prevent "useAuth must be used inside <AuthProvider>"
vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ isLoggedIn: true, token: 'mock-token', user: {} })
}));

// Mock the next/navigation router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

// Mock child components that might complain
vi.mock('@/components/OutOfCreditsModal', () => ({
  default: () => <div data-testid="out-of-credits-mock" />
}));
vi.mock('@/components/model-lab/ConnectorPreviewUI', () => ({
  default: () => <div data-testid="connector-preview-ui-mock" />
}));
vi.mock('@/components/model-lab/DocumentViewerModal', () => ({
  default: () => <div data-testid="document-viewer-modal-mock" />
}));

describe('LocalUploadView Dark Mode Classes', () => {
  it('should have dark mode classes applied to the main container', () => {
    const { container } = render(<LocalUploadView />);
    const rootDiv = container.firstChild as HTMLElement;
    
    // Check root container
    expect(rootDiv).toHaveClass('dark:bg-slate-800');
    
    // Check the hero header (first child of the step-1 container)
    const step1Container = rootDiv.querySelector('.flex-col.flex-1');
    const heroHeader = step1Container?.firstElementChild as HTMLElement;
    expect(heroHeader).toHaveClass('dark:bg-slate-900');
    expect(heroHeader).toHaveClass('dark:border-slate-800');
    
    // Check the h1 and p tags in the hero header
    const h1 = heroHeader?.querySelector('h1');
    expect(h1).toHaveClass('dark:text-white');
    
    const p = heroHeader?.querySelector('p');
    expect(p).toHaveClass('dark:text-slate-400');
  });
});
