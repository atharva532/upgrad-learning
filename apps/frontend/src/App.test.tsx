import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component - Routing and Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should show landing page at root URL', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to LearnSphere')).toBeInTheDocument();
    });
  });

  it('should have Get Started button on landing page', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });
  });

  it('should navigate to login page when Get Started is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /get started/i }));

    await waitFor(() => {
      expect(screen.getByText('Login or Sign Up')).toBeInTheDocument();
    });
  });

  it('should redirect authenticated users from login to home', async () => {
    localStorage.setItem('accessToken', 'valid-token');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              user: { id: '1', email: 'test@example.com' },
            },
          }),
      })
    );

    window.history.pushState({}, '', '/login');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, Learner!')).toBeInTheDocument();
    });
  });

  it('should show home page when authenticated and accessing /home', async () => {
    localStorage.setItem('accessToken', 'valid-token');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              user: { id: '1', email: 'test@example.com' },
            },
          }),
      })
    );

    window.history.pushState({}, '', '/home');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, Learner!')).toBeInTheDocument();
      expect(screen.getByText('Continue Learning')).toBeInTheDocument();
    });
  });

  it('should redirect to login when accessing /home without authentication', async () => {
    window.history.pushState({}, '', '/home');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Login or Sign Up')).toBeInTheDocument();
    });
  });

  it('should show loading state while checking session', async () => {
    localStorage.setItem('accessToken', 'valid-token');

    // Create a promise that doesn't resolve immediately
    let resolvePromise: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingPromise));

    window.history.pushState({}, '', '/home');
    render(<App />);

    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { user: { id: '1', email: 'test@example.com' } },
        }),
    });

    await waitFor(() => {
      expect(screen.getByText('Welcome back, Learner!')).toBeInTheDocument();
    });
  });
});
