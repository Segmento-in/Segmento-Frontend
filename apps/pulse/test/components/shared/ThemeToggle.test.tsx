import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../../../components/shared/ThemeToggle';
import { useTheme } from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in light mode with main-site visual classes', () => {
    // 1. Setup mock for light mode
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    // 2. Render component
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();

    // 3. Verify main-site structural classes
    expect(button).toHaveClass('w-14', 'h-7', 'rounded-full', 'p-1', 'bg-slate-300');
  });

  it('renders correctly in dark mode with main-site visual classes', () => {
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
    
    // Verify dark mode background
    expect(button).toHaveClass('bg-cyan-500');
  });

  it('toggles the theme when clicked', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
