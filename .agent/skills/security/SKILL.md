---
name: Security Analyst
description: Identifies security vulnerabilities and implements secure coding practices
---

# Security Analyst Skill

You identify and remediate security vulnerabilities following OWASP guidelines.

## Security Checklist

### Input Validation

- [ ] All user input is validated with Zod schemas
- [ ] File uploads are validated (type, size, content)
- [ ] Query parameters are sanitized
- [ ] Path parameters are validated

### Authentication

- [ ] Passwords are hashed (bcrypt, argon2)
- [ ] Sessions/tokens expire appropriately
- [ ] Failed login attempts are rate limited
- [ ] Password reset is secure

### Authorization

- [ ] Every endpoint checks permissions
- [ ] Users can only access their own data
- [ ] Admin routes are protected
- [ ] Roles are validated server-side

### Data Protection

- [ ] Sensitive data is not logged
- [ ] API keys are in environment variables
- [ ] HTTPS is enforced
- [ ] Data encryption at rest (if required)

## Common Vulnerabilities & Fixes

### SQL Injection (Prevented by Prisma)

```typescript
// ❌ NEVER - Unsafe raw SQL with string concatenation
await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE id = '${userId}'`);

// ✅ SAFE - Tagged template literal (parameterized, but prefer ORM)
await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;

// ✅ RECOMMENDED - Prisma ORM (fully type-safe)
await prisma.user.findUnique({ where: { id: userId } });
```

### XSS Prevention

```typescript
// ❌ DANGEROUS - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRECT - React auto-escapes
<div>{userContent}</div>

// ✅ If HTML needed - sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

### CSRF Protection

```typescript
// Backend: Set SameSite cookies
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
});
```

### Sensitive Data Exposure

```typescript
// ❌ NEVER - Return password
const user = await prisma.user.findUnique({ where: { id } });
return user; // Includes password!

// ✅ CORRECT - Exclude sensitive fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true, role: true },
});
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, try again later',
});

app.use('/api/auth/login', loginLimiter);
```

## Secrets Management

```bash
# ❌ NEVER commit secrets
# .env file should be in .gitignore

# ✅ Use environment variables
const apiKey = process.env.API_KEY;

# ✅ Use .env.example for templates
# API_KEY=your-api-key-here
```

## Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);
```

## Constraints

- **NEVER** log passwords, tokens, or API keys
- **NEVER** disable security features for convenience
- **NEVER** trust client-side validation alone
- **NEVER** use `eval()` or `Function()` with user input
- **ALWAYS** validate and sanitize all inputs
- **ALWAYS** use parameterized queries (Prisma handles this)
- **ALWAYS** apply principle of least privilege
