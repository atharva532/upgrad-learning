import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from './Home';

describe('Home Component', () => {
  const mockOnLogout = vi.fn();
  const testUser = { id: '1', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should display welcome message for returning user', () => {
    render(<Home user={testUser} isNewUser={false} onLogout={mockOnLogout} />);

    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText(/Ready to continue your learning journey/)).toBeInTheDocument();
  });

  it('should display welcome message for new user', () => {
    render(<Home user={testUser} isNewUser={true} onLogout={mockOnLogout} />);

    expect(screen.getByText('Welcome to UpGrad Learning!')).toBeInTheDocument();
    expect(screen.getByText(/Your account has been created/)).toBeInTheDocument();
  });

  it('should display user email', () => {
    render(<Home user={testUser} isNewUser={false} onLogout={mockOnLogout} />);

    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it('should have a logout button', () => {
    render(<Home user={testUser} isNewUser={false} onLogout={mockOnLogout} />);

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should call logout endpoint and onLogout when logout clicked', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    render(<Home user={testUser} isNewUser={false} onLogout={mockOnLogout} />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      '/api/auth/logout',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('should still call onLogout even if API call fails', async () => {
    const user = userEvent.setup();

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    render(<Home user={testUser} isNewUser={false} onLogout={mockOnLogout} />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('should display emoji for welcome', () => {
    render(<Home user={testUser} isNewUser={false} onLogout={mockOnLogout} />);

    expect(screen.getByText('🎓')).toBeInTheDocument();
  });
});
