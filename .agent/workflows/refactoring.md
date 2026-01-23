---
description: Safe workflow for refactoring and code cleanup
---

# Refactoring Workflow

When improving code structure without changing behavior.

## Prerequisites

- [ ] All tests pass before starting
- [ ] Clear understanding of what to refactor and why
- [ ] No functional changes mixed in

## Steps

### 1. Baseline Verification

// turbo

```bash
pnpm test
pnpm typecheck
```

Confirm all tests pass BEFORE making any changes.

### 2. Define Scope

Document exactly what will change:

- Files affected
- Functions/classes to modify
- What behavior MUST be preserved

> [!WARNING]
> Do NOT mix refactoring with new features. Separate concerns.

### 3. Preserve Behavior Contract

Before refactoring, identify what must NOT change:

```typescript
// ✅ These must remain unchanged:
// - Public API signatures
// - Return value types and shapes
// - Side effects (events, logging, external calls)
// - Error behavior and messages
```

### 4. Make Changes

Apply refactoring with minimal diffs:

```diff
- // OLD: Hard to read
- const x = arr.filter(i => i > 0).map(i => i * 2).reduce((a,b) => a + b, 0);

+ // NEW: Readable with intention
+ const positiveNumbers = arr.filter(isPositive);
+ const doubled = positiveNumbers.map(double);
+ const sum = doubled.reduce(add, 0);
```

> [!CAUTION]
> Avoid refactoring unrelated code. Stay focused on the defined scope.

### 5. Verification

// turbo

```bash
pnpm test
```

// turbo

```bash
pnpm typecheck
```

// turbo

```bash
pnpm lint
```

All tests must still pass with identical behavior.

### 6. Review Diff

Before committing, review the complete diff:

// turbo

```bash
git diff --stat
```

Verify:

- [ ] Only intended files changed
- [ ] No accidental behavior changes
- [ ] No new dependencies added
- [ ] Public APIs unchanged

### 7. Commit

Use refactor commit type:

```
refactor(scope): description of what was improved

- Extracted X into separate function
- Renamed Y for clarity
- Simplified Z logic
```

**✅ Refactoring complete - behavior preserved**
