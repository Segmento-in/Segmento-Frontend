import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../../../app/(auth)/login/page';
import { account } from '../../../../lib/appwrite';

vi.mock('../../../../lib/appwrite', () => ({
  account: {
    createEmailPasswordSession: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits credentials to Appwrite Auth', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitBtn = screen.getByRole('button', { name: /log in|sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(account.createEmailPasswordSession).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('renders Soft Structuralism UI elements', () => {
    const { container } = render(<Login />);
    // Testing for presence of high-fidelity aesthetic classes
    expect(container.querySelector('.backdrop-blur-2xl')).not.toBeNull();
  });
});
