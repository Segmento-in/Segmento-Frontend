import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import FormatScanTab from '../../FormatScanTab';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    apiClient: {
      evaluatorParse: vi.fn(),
      evaluatorScan: vi.fn(),
      videoUpload: vi.fn(),
      videoStatus: vi.fn(),
      videoCancel: vi.fn()
    }
  };
});

beforeEach(() => {
  vi.mocked(apiClient.evaluatorParse).mockResolvedValue({ char_count: 100, text: 'fake text' } as any);
  vi.mocked(apiClient.evaluatorScan).mockResolvedValue({ results: [] } as any);
});

afterEach(() => {
  vi.useRealTimers();
});

// Mock the Auth context
vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ isLoggedIn: true, token: 'mock-token', user: {} })
}));

// Mock Next router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

// Mock ModelShowdown
vi.mock('@/components/model-lab/ModelShowdown', () => ({
  default: () => <div data-testid="model-showdown-mock" />,
  getPiiColor: vi.fn().mockReturnValue('text-red-500')
}));

describe('FormatScanTab - Scan Estimate UI', () => {
  const setupAndClickScan = async (fileSize: number) => {
    const { container, unmount } = render(<FormatScanTab modelCatalogue={[]} />);
    
    // Select the category/type implicitly by using the default (SQLite)
    // Create a fake file with the exact size
    const file = new File(['x'.repeat(fileSize)], 'test.sqlite', { type: 'application/x-sqlite3' });
    Object.defineProperty(file, 'size', { value: fileSize });
    
    // Find the file input and trigger change
    // Note: It's the only input[type="file"] in the component (for standard non-video modes at least)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => expect(screen.getByText('test.sqlite')).toBeInTheDocument());
    
    // Click the run button
    const runBtn = screen.getByRole('button', { name: /Run Model Showdown/i });
    fireEvent.click(runBtn);
    
    return { container, unmount };
  };

  it('File list renders correctly and selection works', async () => {
    const { container, unmount } = render(<FormatScanTab modelCatalogue={[]} />);
    
    const file = new File(['hello'], 'hello.sqlite', { type: 'application/x-sqlite3' });
    Object.defineProperty(file, 'size', { value: 1024 });
    
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => expect(screen.getByText('hello.sqlite')).toBeInTheDocument());
    expect(screen.getByText(/1.0 KB/)).toBeInTheDocument();
    
    unmount();
  });

  it('Countdown is absent before scan starts, present once scanning starts (small total)', async () => {
    let resolveParse: any;
    vi.mocked(apiClient.evaluatorParse).mockImplementationOnce(() => new Promise(res => { resolveParse = res; }));
    
    const { unmount } = await setupAndClickScan(1024); // 1KB
    
    await waitFor(() => expect(screen.getByText('1:00')).toBeInTheDocument());
    
    await act(async () => { resolveParse({ char_count: 100, text: 'done' }); });
    unmount();
  });

  it('Selecting different combinations of files (large total) lands in the correct bucket', async () => {
    let resolveParse: any;
    vi.mocked(apiClient.evaluatorParse).mockImplementationOnce(() => new Promise(res => { resolveParse = res; }));
    
    const { unmount } = await setupAndClickScan(150 * 1024 * 1024); // 150MB
    
    await waitFor(() => expect(screen.getByText('10:00')).toBeInTheDocument());
    
    await act(async () => { resolveParse({ char_count: 100, text: 'done' }); });
    unmount();
  });

  it('The "Taking a bit longer than usual..." note appears only after hook reports isFirstExtension: true', async () => {
    let resolveParse: any;
    vi.mocked(apiClient.evaluatorParse).mockImplementationOnce(() => new Promise(res => { resolveParse = res; }));
    
    const { container, unmount } = render(<FormatScanTab modelCatalogue={[]} />);
    
    const file = new File(['hello'], 'hello.sqlite', { type: 'application/x-sqlite3' });
    Object.defineProperty(file, 'size', { value: 1024 });
    
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await screen.findByText('hello.sqlite');
    
    vi.useFakeTimers();
    
    const runBtn = screen.getByRole('button', { name: /Run Model Showdown/i });
    fireEvent.click(runBtn);
    
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    expect(screen.queryByText(/Taking a bit longer than usual/i)).not.toBeInTheDocument();
    
    await act(async () => {
      vi.advanceTimersByTime(65000);
    });
    
    expect(screen.getByText(/Taking a bit longer than usual/i)).toBeInTheDocument();
    
    await act(async () => { resolveParse({ char_count: 100, text: 'done' }); });
    unmount();
  });

  it('Countdown disappears when scanning ends', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.evaluatorScan).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    
    const { unmount } = await setupAndClickScan(1024);
    
    // Wait until evaluatorParse is done and it moves to the next loading stage
    await waitFor(() => expect(screen.getByText(/Running 3 models/i)).toBeInTheDocument());
    
    await waitFor(() => expect(screen.getByText('1:00')).toBeInTheDocument());
    
    // Resolve evaluatorScan
    await act(async () => { resolveScan({ results: [] }); });
    
    await waitFor(() => {
      expect(screen.queryByText('1:00')).not.toBeInTheDocument();
    });
    
    unmount();
  });
});
