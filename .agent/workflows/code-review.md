---
description: Workflow for thorough code review
---

# Code Review Workflow

## Steps

### 1. Understand the Change

- What problem does this change solve?
- What files are modified?
- Is this a feature, bug fix, or refactor?

### 2. Review Checklist

#### Correctness

- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

#### Code Quality

- [ ] Follows project patterns
- [ ] No code duplication
- [ ] Names are descriptive
- [ ] Functions are focused

#### TypeScript

- [ ] No `any` types
- [ ] Uses shared types from `@repo/types`
- [ ] Strict mode compliant

#### Security

- [ ] No sensitive data exposed
- [ ] Input validation present
- [ ] Auth checks where needed

### 3. Verify Build

// turbo

```bash
pnpm typecheck
```

// turbo

```bash
pnpm lint
```

// turbo

```bash
pnpm build
```

### 4. Provide Feedback

Format:

```markdown
## Code Review

### ✅ Approved / ⚠️ Changes Requested

### Summary

[What the code does]

### Issues

#### 🔴 Critical

- [Must fix before merge]

#### 🟡 Important

- [Should fix]

#### 🟢 Suggestions

- [Nice to have]
```

**✅ Review complete**
