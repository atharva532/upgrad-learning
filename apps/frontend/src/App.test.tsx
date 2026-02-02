/* eslint-env browser */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App Component - Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should show email form when no token in localStorage', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Login or Sign Up')).toBeInTheDocument();
    });
  });

  it('should show authenticated state when session is valid', async () => {
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

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    });
  });

  it('should show email form if session check fails', async () => {
    localStorage.setItem('accessToken', 'expired-token');

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ success: false }) })
        .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ success: false }) })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Login or Sign Up')).toBeInTheDocument();
    });
  });
});
