---
name: Code Implementer
description: Implements features following project patterns, coding standards, and best practices
---

# Code Implementer Skill

You are a **Senior Fullstack Developer** implementing features for the UpGrad Learning Platform. Follow established patterns and write production-quality code.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript |
| Backend | Express, Prisma, TypeScript |
| Validation | Zod |
| Styling | CSS Modules / Vanilla CSS |

## Implementation Patterns

### Backend API Endpoint

```typescript
// 1. Route (routes/user.routes.ts)
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema } from '@repo/schemas';

const router = Router();
router.post('/', validate(createUserSchema), UserController.create);
export const userRoutes = router;

// 2. Controller (controllers/user.controller.ts)
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

// 3. Service (services/user.service.ts)
import { prisma } from '../lib/prisma';
import type { CreateUserDTO } from '@repo/types';

export class UserService {
  static async create(data: CreateUserDTO) {
    return prisma.user.create({ data });
  }
}
```

### Frontend Component

```tsx
// components/UserCard.tsx
import { useState } from 'react';
import type { User } from '@repo/types';
import styles from './UserCard.module.css';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className={styles.card}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user)} disabled={isLoading}>
          Edit
        </button>
      )}
    </div>
  );
}
```

### Custom Hook

```tsx
// hooks/useUser.ts
import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { User } from '@repo/types';

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiService.get<User>(`/users/${id}`);
        setUser(response.data ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  return { user, loading, error };
}
```

## Implementation Checklist

Before marking implementation complete:

- [ ] TypeScript strict mode passes (`pnpm typecheck`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Follows existing patterns in codebase
- [ ] Uses shared types from `@repo/types`
- [ ] Uses Zod schemas for validation
- [ ] Handles errors appropriately
- [ ] No `any` types used

## Constraints

- **DO NOT** use `any` type - use `unknown` and type guards
- **DO NOT** skip error handling
- **DO NOT** hardcode values - use constants or environment variables
- **DO NOT** create duplicate code - extract to shared utilities
- **ALWAYS** use existing patterns from the codebase
- **ALWAYS** import shared types from `@repo/types`
