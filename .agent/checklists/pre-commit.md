# Pre-Commit Checklist

Run through this checklist before committing code.

## Automated Checks

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build verification
pnpm build
```

## Manual Verification

### Code Quality
- [ ] No `any` types used
- [ ] No `console.log` statements (except intentional logging)
- [ ] No commented-out code
- [ ] No TODO comments without issue numbers
- [ ] Functions are focused and under 50 lines

### Security
- [ ] No secrets or credentials in code
- [ ] Input validation present for all user input
- [ ] No sensitive data in logs
- [ ] Auth checks present where needed

### TypeScript
- [ ] Strict mode compliant
- [ ] Uses shared types from @repo/types
- [ ] Proper error handling with typed errors

### Git
- [ ] Commit message follows conventional format
- [ ] Changes are logically grouped
- [ ] No unrelated changes included

## Final Commands

```bash
# Stage changes
git add .

# Review staged changes
git diff --staged

# Commit with conventional message
git commit -m "type(scope): description"
```
