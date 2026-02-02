import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthForm } from './AuthForm';

describe('AuthForm Component', () => {
  const mockOnOtpSent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render the login form with email input', () => {
    render(<AuthForm onOtpSent={mockOnOtpSent} />);

    expect(screen.getByText('Login or Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Enter your email to receive a login code.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
  });

  it('should allow typing in the email input', async () => {
    const user = userEvent.setup();
    render(<AuthForm onOtpSent={mockOnOtpSent} />);

    const emailInput = screen.getByLabelText('Email Address');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should call onOtpSent with email on successful submission', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { email: 'test@example.com' } }),
      })
    );

    render(<AuthForm onOtpSent={mockOnOtpSent} />);

    const emailInput = screen.getByLabelText('Email Address');
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /send otp/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnOtpSent).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should show Sending text when clicking submit button', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise(() => {}))
    );

    render(<AuthForm onOtpSent={mockOnOtpSent} />);

    const emailInput = screen.getByLabelText('Email Address');
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /send otp/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Sending...')).toBeInTheDocument();
    });
  });
});
