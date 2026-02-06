import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';

// Mock the AuthContext
const mockLogout = vi.fn().mockResolvedValue(undefined);
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

// Mock the content service
vi.mock('../services/contentService', () => ({
  getContinueWatching: vi.fn().mockResolvedValue(null),
  getRecommendations: vi.fn().mockResolvedValue([
    {
      id: '1',
      title: 'Test Video 1',
      thumbnail: 'thumb1.jpg',
      duration: 1200,
      category: 'Web Dev',
    },
    {
      id: '2',
      title: 'Test Video 2',
      thumbnail: 'thumb2.jpg',
      duration: 1800,
      category: 'Data Science',
    },
  ]),
  getExplorationContent: vi
    .fn()
    .mockResolvedValue([
      {
        id: '3',
        title: 'Explore Video',
        thumbnail: 'thumb3.jpg',
        duration: 2400,
        category: 'Exploration',
      },
    ]),
  saveWatchProgress: vi.fn(),
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

  it('should display Recommended for You section', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Recommended for You')).toBeInTheDocument();
    });
  });

  it('should display Explore Something New section', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Explore Something New')).toBeInTheDocument();
    });
  });

  it('should call logout and navigate when logout clicked', async () => {
    const user = userEvent.setup();

    renderHome();

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
