import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../../../../app/(auth)/register/page';
import { account } from '../../../../lib/appwrite';
import { ID } from 'appwrite';

vi.mock('../../../../lib/appwrite', () => ({
  account: {
    create: vi.fn(),
    createEmailPasswordSession: vi.fn(),
  },
}));

vi.mock('appwrite', async (importOriginal) => {
  const actual = await importOriginal<typeof import('appwrite')>();
  return {
    ...actual,
    ID: {
      unique: vi.fn(() => 'unique-id'),
    },
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock global fetch for the subscription API call
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as any;

describe('Signup Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits credentials to Appwrite Auth and hits subscription API', async () => {
    render(<Register />);
    
    const nameInput = screen.getByPlaceholderText(/John Doe/i);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitBtn = screen.getByRole('button', { name: /create account|sign up/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Check Appwrite Account creation
      expect(account.create).toHaveBeenCalledWith('unique-id', 'test@example.com', 'password123', 'Test User');
      
      // Check Appwrite Session creation (auto-login after signup)
      expect(account.createEmailPasswordSession).toHaveBeenCalledWith('test@example.com', 'password123');

      // Check subscription API call
      expect(global.fetch).toHaveBeenCalledWith('/api/subscription/subscribe', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"email":"test@example.com"'),
      }));
    });
  });

  it('renders Soft Structuralism UI elements', () => {
    const { container } = render(<Register />);
    expect(container.querySelector('.backdrop-blur-2xl')).not.toBeNull();
  });
});
