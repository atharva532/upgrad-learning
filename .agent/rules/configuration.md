---
name: Configuration
description: Environment variables, configuration management, and secrets handling
---

# Configuration Rules

How to manage environment variables and configuration in the monorepo.

---

## Environment Files

```
upgradlearning/
├── .env                 # Local development (git-ignored)
├── .env.example         # Template with all required vars (committed)
├── apps/
│   ├── backend/
│   │   └── .env         # Backend-specific vars (git-ignored)
│   └── frontend/
│       └── .env         # Frontend-specific vars (git-ignored)
```

---

## Required Variables

### Root `.env`

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Authentication
JWT_SECRET="your-secure-secret-here"
JWT_EXPIRES_IN="7d"

# Environment
NODE_ENV="development"
```

### Frontend `.env`

```bash
# API
VITE_API_URL="http://localhost:3001/api"

# Features
VITE_ENABLE_ANALYTICS="false"
```

### Backend `.env`

```bash
# Server
PORT="3001"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

---

## Adding New Variables

### Step 1: Update `.env.example`

```bash
# .env.example
NEW_VARIABLE=""  # Description of what this is for
```

### Step 2: Update Config Module

```typescript
// apps/backend/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NEW_VARIABLE: z.string().optional(), // Add here
});

export const env = envSchema.parse(process.env);
```

### Step 3: Update Documentation

Add to README.md if the variable affects setup.

---

## Configuration Patterns

### DO

```typescript
// ✅ Use zod for validation
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

// ✅ Export typed config object
export const config = {
  port: env.PORT,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
};

// ✅ Use config object, not process.env directly
if (config.isDev) {
  // Enable debug logging
}

// ✅ Provide sensible defaults
const timeout = env.TIMEOUT ?? 5000;
```

### DON'T

```typescript
// ❌ Access process.env directly throughout codebase
if (process.env.NODE_ENV === 'development') {
}

// ❌ Hardcode values that should be configurable
const apiUrl = 'http://localhost:3001';

// ❌ Commit secrets to version control
const JWT_SECRET = 'my-super-secret-key';

// ❌ Skip validation
const port = parseInt(process.env.PORT); // Could be NaN!
```

---

## Frontend Configuration

```typescript
// apps/frontend/src/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

// Usage
import { config } from '@/config';
fetch(`${config.apiUrl}/users`);
```

> [!CAUTION]
> All `VITE_` prefixed variables are exposed to the browser. Never put secrets here!

---

## Secrets Management

### Development

- Use `.env` files (git-ignored)
- Never commit actual secrets
- Share secrets via secure channels (1Password, etc.)

### Production

- Use environment variables from hosting platform
- Or use secret managers (AWS Secrets Manager, Vault)
- Rotate secrets regularly

---

## Config Validation on Startup

```typescript
// apps/backend/src/index.ts
import { env } from './config/env';

// Validate at startup - fail fast if misconfigured
try {
  console.log(`Starting server on port ${env.PORT}`);
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}
```

---

## Constraints

- **DO NOT** commit `.env` files to version control
- **DO NOT** put secrets in frontend code (VITE\_ prefix)
- **DO NOT** use `process.env` directly - use config module
- **ALWAYS** update `.env.example` when adding new variables
- **ALWAYS** validate environment variables with zod
- **ALWAYS** provide sensible defaults where appropriate
