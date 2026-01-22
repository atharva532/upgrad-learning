---
description: Systematic workflow for diagnosing and fixing bugs
---

# Bug Fix Workflow

## Prerequisites
- Bug is reported with reproduction steps
- Expected vs actual behavior is clear

## Steps

### 1. Reproduce the Issue

// turbo
```bash
pnpm dev
```

Verify you can reproduce the bug following the reported steps.

### 2. Identify the Root Cause

Check for errors:
// turbo
```bash
pnpm typecheck
```

// turbo
```bash
pnpm lint
```

Analyze relevant files based on the bug location.

### 3. Implement the Fix

- Make targeted changes to fix the root cause
- Avoid side effects
- Don't fix multiple unrelated issues at once

### 4. Verify the Fix

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

### 5. Test the Fix

Manually verify the bug is fixed and no regressions introduced.

If tests exist:
// turbo
```bash
pnpm test
```

### 6. Commit the Fix

```
fix(<scope>): <description of what was fixed>

<optional: explanation of root cause>

Fixes #<issue-number>
```

**✅ Bug fixed**
