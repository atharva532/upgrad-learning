---
name: TypeScript Rules
description: Strict types, type safety, and TypeScript best practices
---

# TypeScript Rules

## Strict Mode

All TypeScript must compile with strict mode enabled.

## Type Guidelines

### DO

- Use explicit types for function parameters and return values
- Use shared types from `@repo/types` for DTOs
- Use `unknown` instead of `any` when type is truly unknown
- Use type guards for runtime type checking
- Use discriminated unions for complex state

### DON'T

- Use `any` type
- Use `// @ts-ignore` or `// @ts-expect-error`
- Use non-null assertion `!` without good reason
- Export types from barrel files that aren't meant to be public

## Code Examples

### Good Type Definitions

```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string;
}

// Use type for unions and intersections
type UserRole = 'admin' | 'user' | 'guest';

// Use generics for reusable types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Type Guards

```typescript
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value && 'email' in value;
}
```

### Function Types

```typescript
// Always type parameters and return values
function createUser(data: CreateUserDTO): Promise<User> {
  // implementation
}

// Use arrow functions consistently
const formatDate = (date: Date): string => {
  return date.toISOString();
};
```
