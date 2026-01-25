---
name: Express Rules
description: API patterns, error handling, routing, and logging for Express backend
---

# Express API Rules

## Route Structure

```
apps/backend/src/
├── routes/           # Route definitions
├── controllers/      # Request handlers
├── services/         # Business logic
├── middlewares/      # Express middleware
└── config/           # Configuration
```

## Endpoint Guidelines

### DO

- Use REST conventions (GET, POST, PUT, DELETE)
- Validate all input with Zod schemas
- Use consistent response format
- Handle errors with try/catch
- Use typed request/response

### DON'T

- Put business logic in controllers
- Return raw Prisma errors to client
- Log sensitive data
- Skip input validation

## Code Patterns

### Route Definition

```typescript
import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { createUserSchema } from '@repo/schemas';
import { UserController } from '../controllers/user.controller';

const router: Router = Router();

router.post('/', validate(createUserSchema), UserController.create);
router.get('/:id', UserController.getById);

export const userRoutes: Router = router;
```

### Controller

```typescript
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
```

### Response Format

```typescript
// Success
{ success: true, data: { ... } }

// Error (standardized shape - see error-handling.md)
{
  success: false,
  error: {
    message: "User not found",
    code: "NOT_FOUND",
    details: { userId: "123" }  // optional, omit in production
  }
}

// Paginated
{
  success: true,
  data: [...],
  pagination: { page: 1, limit: 10, total: 100 }
}

// Paginated with error
{
  success: false,
  error: {
    message: "Invalid page number",
    code: "VALIDATION_ERROR",
    details: { page: -1, min: 1 }
  }
}
```

## Error Handling

```typescript
// Custom error class
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

// Use in services
throw new AppError('User not found', 404);
```

---

## Logging

### Logger Setup

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
});
```

### Log Levels

| Level   | When to Use                          |
| ------- | ------------------------------------ |
| `fatal` | Application crash, unrecoverable     |
| `error` | Errors that need attention           |
| `warn`  | Potential issues, deprecations       |
| `info`  | Important events (startup, requests) |
| `debug` | Detailed debugging info              |
| `trace` | Very detailed tracing                |

### Request Logging

```typescript
// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info(
      {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: Date.now() - start,
      },
      'Request completed'
    );
  });

  next();
});
```

### Structured Logging

```typescript
// ✅ Use structured logging with context
logger.info({ userId, action: 'login' }, 'User logged in');

// ✅ Log errors with stack traces
logger.error({ err: error, userId }, 'Failed to process payment');

// ❌ Don't use string concatenation
logger.info('User ' + userId + ' logged in');

// ❌ Never log sensitive data
logger.info({ password }); // NEVER!
```

### What to Log

| Log                          | Don't Log                                 |
| ---------------------------- | ----------------------------------------- |
| Request method, path, status | Request/response bodies (may contain PII) |
| Response times               | Passwords, tokens, secrets                |
| Error messages and stacks    | Credit card numbers                       |
| User IDs (for tracing)       | Personal identifying information          |
| Business events              | Sensitive query parameters                |

---

## Constraints

- **DO NOT** log passwords, tokens, or secrets
- **DO NOT** use `console.log` in production (use logger)
- **DO NOT** log request/response bodies by default
- **ALWAYS** use structured logging with context
- **ALWAYS** include correlation IDs for tracing
- **ALWAYS** log errors with stack traces
