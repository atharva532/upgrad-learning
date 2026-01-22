# Security Review Checklist

Complete this checklist for security-sensitive changes.

## Authentication

- [ ] Passwords are hashed (bcrypt/argon2)
- [ ] Tokens have appropriate expiration
- [ ] Failed login attempts are rate limited
- [ ] Session invalidation on logout
- [ ] Password reset flow is secure

## Authorization

- [ ] Every endpoint checks permissions
- [ ] Users can only access their own data
- [ ] Admin routes are properly protected
- [ ] Role checks are server-side

## Input Validation

- [ ] All user input validated with Zod
- [ ] File uploads validated (type, size)
- [ ] Query parameters sanitized
- [ ] Path parameters validated
- [ ] No SQL/NoSQL injection possible

## Data Protection

- [ ] Sensitive data not logged
- [ ] Passwords/tokens never in responses
- [ ] API keys in environment variables
- [ ] HTTPS enforced (production)
- [ ] CORS configured correctly

## Output Security

- [ ] No sensitive error details to client
- [ ] XSS prevention in place
- [ ] Content Security Policy set
- [ ] Secure cookie flags set

## Dependencies

- [ ] No known vulnerabilities (run `pnpm audit`)
- [ ] Dependencies from trusted sources
- [ ] Versions pinned appropriately

## OWASP Top 10 Quick Check

> [!CAUTION]
> AI-generated code has **3x more security flaws** than human code. Apply extra scrutiny.

| Risk | Verification Question |
|------|----------------------|
| **A01** Broken Access Control | Are permissions checked on every endpoint? |
| **A02** Cryptographic Failures | Is sensitive data encrypted in transit (HTTPS) and at rest? |
| **A03** Injection | Are all queries parameterized? (Prisma handles this) |
| **A04** Insecure Design | Was security considered in the design phase? |
| **A05** Security Misconfiguration | Are defaults secure? No debug mode in production? |
| **A06** Vulnerable Components | Are dependencies up to date? (`pnpm audit`) |
| **A07** Authentication Failures | Is authentication robust? Rate limiting in place? |
| **A08** Data Integrity Failures | Are updates verified? CSRF protection enabled? |
| **A09** Logging Failures | Are security events logged (login attempts, access denied)? |
| **A10** SSRF | Are outbound requests to user-provided URLs validated? |

---

## Sign-off

- [ ] Security review completed by: ___________
- [ ] Date: ___________
