---
name: Security Rules
description: Security best practices, input validation, and secret management
---

# Security Rules

## Forbidden Actions

These actions are NEVER allowed:

1. **Exposing Secrets**
   - Never log passwords, tokens, or API keys
   - Never commit secrets to version control
   - Never return sensitive data in API responses

2. **Disabling Security**
   - Never disable CORS for convenience
   - Never skip authentication checks
   - Never use HTTP instead of HTTPS (in production)

3. **Unsafe Code**
   - Never use `eval()` or `new Function()` with user input
   - Never use `dangerouslySetInnerHTML` with unsanitized content
   - Never execute raw SQL queries with user input

## Required Practices

### Input Validation

All user input MUST be validated:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// In middleware
const validated = userSchema.parse(req.body);
```

### Password Handling

```typescript
// NEVER store plain text passwords
import bcrypt from 'bcrypt';

const hash = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hash);
```

### Secret Detection Patterns

Block commits/logs containing:

- `password`, `secret`, `token`, `api_key`
- Base64 strings > 40 characters
- AWS/GCP credential patterns
- Private key headers

### Environment Variables

Required `.env` entries (never commit actual values):

```
DATABASE_URL=
JWT_SECRET=
```

## Rate Limiting

Apply rate limiting to sensitive endpoints:

- Login: 5 attempts per 15 minutes
- Register: 10 per hour per IP
- API: 100 requests per minute per user
