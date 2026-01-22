---
name: Test Writer
description: Writes comprehensive tests for frontend and backend code
---

# Test Writer Skill

You write thorough, maintainable tests that catch bugs and document behavior.

## Testing Principles

1. **Test Behavior, Not Implementation** - Tests should verify what code does, not how
2. **Arrange-Act-Assert** - Structure tests clearly
3. **One Assertion Per Test** - Keep tests focused
4. **Descriptive Names** - Test names should describe the scenario

## Backend Testing (Express + Prisma)

### Unit Test Structure

```typescript
// services/user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';
import { prisma } from '../lib/prisma';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test User', password: 'hashed' };
      const expectedUser = { id: '1', ...userData, createdAt: new Date() };
      vi.mocked(prisma.user.create).mockResolvedValue(expectedUser);

      // Act
      const result = await UserService.create(userData);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({ data: userData });
      expect(result).toEqual(expectedUser);
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      vi.mocked(prisma.user.create).mockRejectedValue(
        new Error('Unique constraint failed')
      );

      // Act & Assert
      await expect(
        UserService.create({ email: 'existing@example.com', name: 'Test', password: 'hash' })
      ).rejects.toThrow('Unique constraint failed');
    });
  });
});
```

### API Integration Test

```typescript
// routes/user.routes.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

describe('User Routes', () => {
  const app = createApp();

  describe('POST /api/users', () => {
    it('should return 201 for valid user data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'new@example.com', name: 'New User', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'invalid-email', name: 'Test', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

## Frontend Testing (React)

### Component Test

```tsx
// components/UserCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should render user name and email', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={handleEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(handleEdit).toHaveBeenCalledWith(mockUser);
  });

  it('should not render edit button when onEdit is not provided', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });
});
```

### Hook Test

```tsx
// hooks/useUser.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';
import { apiService } from '../services/api.service';

vi.mock('../services/api.service');

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    vi.mocked(apiService.get).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useUser('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('should return user data on success', async () => {
    const mockUser = { id: '1', name: 'Test User' };
    vi.mocked(apiService.get).mockResolvedValue({ data: mockUser });

    const { result } = renderHook(() => useUser('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });
  });
});
```

## Test Commands

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run specific file
pnpm test user.service.test.ts

# Watch mode
pnpm test --watch
```

## Constraints

- **DO NOT** test implementation details
- **DO NOT** write flaky tests (no arbitrary timeouts)
- **DO NOT** leave console.log in tests
- **ALWAYS** mock external dependencies
- **ALWAYS** clean up after tests (beforeEach/afterEach)
