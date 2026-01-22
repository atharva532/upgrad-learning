import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the fetch API
const mockHealthResponse = {
  success: true,
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: 100,
  environment: 'test',
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header with UpGrad Learning title', () => {
    // Mock fetch to return health data
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockHealthResponse),
      })
    );

    render(<App />);

    // Check for the main heading
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('🎓 UpGrad Learning');

    // Check for subtitle
    expect(screen.getByText('Fullstack Monorepo')).toBeInTheDocument();
  });

  it('should display tech stack information', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockHealthResponse),
      })
    );

    render(<App />);

    // Verify tech stack items are displayed
    expect(screen.getByText(/React 18/)).toBeInTheDocument();
    expect(screen.getByText(/Vite/)).toBeInTheDocument();
    expect(screen.getByText(/Express.js/)).toBeInTheDocument();
    expect(screen.getByText(/Prisma/)).toBeInTheDocument();
    expect(screen.getByText(/Turborepo/)).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    // Mock fetch to be a pending promise
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise(() => {}))
    );

    render(<App />);

    expect(screen.getByText('⏳ Connecting...')).toBeInTheDocument();
  });
});
