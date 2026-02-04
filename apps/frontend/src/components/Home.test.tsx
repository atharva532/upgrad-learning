import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';

// Mock the AuthContext
const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    isNewUser: false,
    logout: mockLogout,
  }),
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('should display welcome message for returning user', () => {
    renderHome();

    expect(screen.getByText('Welcome back, Learner!')).toBeInTheDocument();
  });

  it('should display user email', () => {
    renderHome();

    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it('should have a logout button', () => {
    renderHome();

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should display LearnSphere brand', () => {
    renderHome();

    expect(screen.getByText('LearnSphere')).toBeInTheDocument();
  });

  it('should display Continue Learning section', () => {
    renderHome();

    expect(screen.getByText('Continue Learning')).toBeInTheDocument();
  });

  it('should display course cards', () => {
    renderHome();

    expect(screen.getByText('Introduction to Web Development')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Essentials')).toBeInTheDocument();
  });

  it('should call logout and navigate when logout clicked', async () => {
    const user = userEvent.setup();

    renderHome();

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
