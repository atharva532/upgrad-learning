import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OtpForm } from './OtpForm';

describe('OtpForm Component', () => {
  const mockOnSuccess = vi.fn();
  const mockOnBack = vi.fn();
  const testEmail = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render the OTP verification form', () => {
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    expect(screen.getByText('Enter Verification Code')).toBeInTheDocument();
    expect(screen.getByText(testEmail)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
  });

  it('should display the email address in subtitle', () => {
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    expect(screen.getByText(/We sent a 6-digit code to/)).toBeInTheDocument();
    expect(screen.getByText(testEmail)).toBeInTheDocument();
  });

  it('should have 6 OTP input fields', () => {
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('should focus first input on mount', () => {
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveFocus();
  });

  it('should auto-focus next input when digit is entered', async () => {
    const user = userEvent.setup();
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], '1');

    expect(inputs[1]).toHaveFocus();
  });

  it('should only allow numeric input', async () => {
    const user = userEvent.setup();
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'a');

    expect(inputs[0]).toHaveValue('');
  });

  it('should show resend cooldown timer', () => {
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    expect(screen.getByText(/Resend in \d+s/)).toBeInTheDocument();
  });

  it('should show Change Email link', () => {
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    expect(screen.getByText('Change Email')).toBeInTheDocument();
  });

  it('should call onBack when Change Email is clicked', async () => {
    const user = userEvent.setup();
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    await user.click(screen.getByText('Change Email'));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should disable resend button during cooldown', () => {
    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    const resendButton = screen.getByText(/Resend in/);
    expect(resendButton).toBeDisabled();
  });

  it('should submit OTP when all 6 digits are entered', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              user: { id: '1', email: testEmail },
              accessToken: 'token',
              isNewUser: false,
            },
          }),
      })
    );

    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    const inputs = screen.getAllByRole('textbox');

    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1));
    }

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        user: { id: '1', email: testEmail },
        accessToken: 'token',
        isNewUser: false,
      });
    });
  });

  it('should display error on verification failure', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Invalid verification code',
          }),
      })
    );

    render(<OtpForm email={testEmail} onSuccess={mockOnSuccess} onBack={mockOnBack} />);

    const inputs = screen.getAllByRole('textbox');

    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1));
    }

    await waitFor(() => {
      expect(screen.getByText('Invalid verification code')).toBeInTheDocument();
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
