import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InterestSelection } from './InterestSelection';
import * as interestService from '../services/interestService';

// Mock the interest service
vi.mock('../services/interestService', () => ({
  getInterests: vi.fn(),
  saveUserInterests: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock setOnboardingComplete function
const mockSetOnboardingComplete = vi.fn();

// Mock the AuthContext to avoid triggering real fetch calls
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    isAuthenticated: true,
    isLoading: false,
    isNewUser: true,
    hasCompletedOnboarding: false,
    login: vi.fn(),
    logout: vi.fn(),
    setOnboardingComplete: mockSetOnboardingComplete,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockInterests = [
  { id: 'web-dev', name: 'Web Development' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'ai-ml', name: 'Artificial Intelligence' },
];

function renderWithProviders(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('InterestSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (interestService.getInterests as ReturnType<typeof vi.fn>).mockResolvedValue(mockInterests);
    (interestService.saveUserInterests as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  it('renders loading state initially', () => {
    renderWithProviders(<InterestSelection />);
    expect(screen.getByText('Loading interests...')).toBeInTheDocument();
  });

  it('renders interests after loading', async () => {
    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    expect(screen.getByText('Data Science')).toBeInTheDocument();
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
  });

  it('renders page title and subtitle', async () => {
    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('What do you want to learn?')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Select one or more topics to personalize your home feed.')
    ).toBeInTheDocument();
  });

  it('disables Continue button when no interests selected', async () => {
    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it('enables Continue button when at least one interest is selected', async () => {
    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    // Click on an interest
    fireEvent.click(screen.getByText('Web Development'));

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).not.toBeDisabled();
  });

  it('toggles interest selection', async () => {
    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    const webDevButton = screen.getByRole('button', { name: /web development/i });

    // Select
    fireEvent.click(webDevButton);
    expect(webDevButton).toHaveAttribute('aria-pressed', 'true');

    // Deselect
    fireEvent.click(webDevButton);
    expect(webDevButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('allows selecting multiple interests', async () => {
    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Web Development'));
    fireEvent.click(screen.getByText('Data Science'));

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).not.toBeDisabled();
  });

  it('shows error state when loading fails', async () => {
    (interestService.getInterests as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );

    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('calls saveUserInterests and navigates on submit', async () => {
    renderWithProviders(<InterestSelection />);

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Web Development'));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(interestService.saveUserInterests).toHaveBeenCalledWith(['web-dev']);
    });

    await waitFor(() => {
      expect(mockSetOnboardingComplete).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });
  });
});
