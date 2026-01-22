---
name: Error Handling
description: Patterns for handling errors, logging, and recovery across the stack
---

# Error Handling Rules

Consistent error handling across frontend and backend.

---

## Error Class Hierarchy

### Backend Errors

```typescript
// Base application error
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Specific error types
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      404,
      'NOT_FOUND'
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
```

---

## Error Response Format

```typescript
// Consistent error response
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

// Example
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND",
    "details": { "userId": "123" }
  }
}
```

---

## Error Handling Patterns

### DO

```typescript
// ✅ Use specific error types
throw new NotFoundError('User', userId);

// ✅ Add context to errors
throw new AppError('Failed to process payment', 500, 'PAYMENT_FAILED', {
  orderId,
  amount,
});

// ✅ Log before rethrowing
catch (error) {
  logger.error('Database operation failed', { error, userId });
  throw new AppError('Failed to save user', 500);
}

// ✅ Handle expected vs unexpected errors
if (!user) {
  throw new NotFoundError('User', id);  // Expected, operational
}
// Unexpected errors bubble up to global handler
```

### DON'T

```typescript
// ❌ Generic error with no context
throw new Error('Something went wrong');

// ❌ Swallow errors silently
catch (error) {
  // Do nothing
}

// ❌ Expose internal details to client
catch (error) {
  res.json({ error: error.stack });  // Never expose stack traces!
}

// ❌ Use string error codes inconsistently
throw { code: 'error', type: 'NOT_FOUND', kind: '404' };
```

---

## Error Middleware

```typescript
// Global error handler
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log all errors
  logger.error('Request failed', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV !== 'production' && { details: error.details }),
      },
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}
```

---

## Frontend Error Handling

```typescript
// API service with error handling
export async function apiCall<T>(
  request: () => Promise<T>
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await request();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred' };
  }
}

// Component error handling
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useUser(userId);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <NotFound resource="User" />;

  return <Profile user={data} />;
}
```

---

## Error Logging Levels

| Level | When to Use |
|-------|-------------|
| `error` | Unexpected failures, exceptions, crashes |
| `warn` | Expected issues (validation, not found) |
| `info` | Important events (login, payment) |
| `debug` | Development debugging |

---

## Constraints

- **DO NOT** expose stack traces to clients in production
- **DO NOT** log sensitive data (passwords, tokens)
- **DO NOT** swallow errors without logging
- **ALWAYS** use specific error types
- **ALWAYS** include context in error messages
- **ALWAYS** log errors before transforming them
