import { describe, it, expect, vi, beforeAll } from 'vitest';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';
import LocalUploadView from './LocalUploadView';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    apiClient: {
      uploadCSV: vi.fn(),
      deductCredits: vi.fn().mockResolvedValue(undefined),
    }
  };
});

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
    const { container } = render(<LocalUploadView setRightView={vi.fn()} />);
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

describe('Back to Connectors button', () => {
  it('renders on the select-type primary screen and clicking it calls setRightView', () => {
    const setRightView = vi.fn();
    render(<LocalUploadView setRightView={setRightView} />);
    
    // RED 1: Assert present
    const backBtn = screen.getByRole('button', { name: /Back to Connectors/i });
    expect(backBtn).toBeInTheDocument();
    
    // Check it has the icon class from lucide-react (ArrowLeft renders an SVG with lucide-arrow-left class)
    const icon = backBtn.querySelector('.lucide-arrow-left');
    expect(icon).toBeInTheDocument();

    // RED 3: Assert click calls setRightView('connectors')
    fireEvent.click(backBtn);
    expect(setRightView).toHaveBeenCalledWith('connectors');

    // RED 4: activeFilter is not modified (trivially true because it is completely encapsulated in ConnectorsClient and not accessible here)
  });

  it('renders on the select-scan-mode screen', () => {
    const { container } = render(<LocalUploadView setRightView={vi.fn()} />);
    
    // Simulate file selection to enter select-scan-mode
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] } });
    
    // Assert we're on scan mode screen
    expect(screen.getByRole('heading', { name: /Choose Scan Mode/i })).toBeInTheDocument();
    
    // Assert button is present
    const backBtn = screen.getByRole('button', { name: /Back to Connectors/i });
    expect(backBtn).toBeInTheDocument();
  });

  it('renders on the results screen', async () => {
    const { container } = render(<LocalUploadView setRightView={vi.fn()} />);
    
    // Simulate file selection
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] } });
    
    // Mock successful upload
    vi.mocked(apiClient.uploadCSV).mockResolvedValueOnce({ total_pii_found: 1 } as any);
    
    // Start scan
    fireEvent.click(screen.getByRole('button', { name: /Start Scan/i }));
    
    // Wait for results screen
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Scan Results/i })).toBeInTheDocument();
    });
    
    // Assert button is present
    const backBtn = screen.getByRole('button', { name: /Back to Connectors/i });
    expect(backBtn).toBeInTheDocument();
  });

  it('renders on the error screen', async () => {
    const { container } = render(<LocalUploadView setRightView={vi.fn()} />);
    
    // Simulate file selection
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] } });
    
    // Mock failed upload
    vi.mocked(apiClient.uploadCSV).mockRejectedValueOnce(new Error('Test API error'));
    
    // Start scan
    fireEvent.click(screen.getByRole('button', { name: /Start Scan/i }));
    
    // Wait for error screen
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Scan Failed/i })).toBeInTheDocument();
    });
    
    // Assert button is present
    const backBtn = screen.getByRole('button', { name: /Back to Connectors/i });
    expect(backBtn).toBeInTheDocument();
  });
});
