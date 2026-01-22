---
name: Debugger
description: Diagnoses and fixes bugs using systematic debugging techniques
---

# Debugger Skill

You are an expert debugger. Systematically diagnose issues and implement targeted fixes.

## Debugging Process

### 1. Reproduce the Issue
```bash
# Gather information
- What is the expected behavior?
- What is the actual behavior?
- What are the exact steps to reproduce?
- When did it start happening?
```

### 2. Isolate the Problem

**For Runtime Errors:**
```typescript
// Add strategic console.log or debugger statements
console.log('[DEBUG] Input:', JSON.stringify(input, null, 2));
console.log('[DEBUG] State:', JSON.stringify(state, null, 2));
```

**For Type Errors:**
```bash
# Run typecheck to see full error context
pnpm typecheck
```

**For Build Errors:**
```bash
# Check build output
pnpm build 2>&1 | head -50
```

### 3. Analyze Root Cause

Common issues in this project:

| Symptom | Likely Cause |
|---------|--------------|
| `Cannot find module` | Missing dependency or wrong import path |
| `Type 'X' is not assignable` | Type mismatch, check shared types |
| `undefined is not an object` | Null/undefined access, add guards |
| `CORS error` | Backend CORS config doesn't include frontend origin |
| `Prisma error` | Schema out of sync, run `pnpm db:generate` |

### 4. Implement Fix

```typescript
// BAD: Band-aid fix
const value = data?.property ?? 'default'; // Why is it undefined?

// GOOD: Address root cause
if (!data) {
  throw new AppError('Data not found', 404);
}
const value = data.property;
```

### 5. Verify Fix

```bash
# Run full verification
pnpm typecheck
pnpm lint
pnpm build
pnpm test  # if tests exist
```

## Debug Commands

```bash
# TypeScript errors
pnpm typecheck

# Lint issues
pnpm lint --fix

# Prisma issues
pnpm --filter @repo/backend prisma generate
pnpm --filter @repo/backend prisma db push

# Clear caches
pnpm clean
rm -rf node_modules/.cache
pnpm install
```

## Common Fixes

### Import/Export Issues
```typescript
// Ensure consistent exports
export { MyComponent } from './MyComponent';  // Named
export default MyComponent;                    // Default

// Check tsconfig paths
// Check package.json "main" and "types" fields
```

### Async/Await Issues
```typescript
// Always handle promises
try {
  const result = await asyncOperation();
} catch (error) {
  // Handle error appropriately
  console.error('Operation failed:', error);
  throw error;
}
```

### React State Issues
```typescript
// Don't mutate state directly
// BAD
state.items.push(newItem);

// GOOD
setItems([...items, newItem]);
```

## Constraints

- **DO NOT** use `// @ts-ignore` or `// @ts-expect-error`
- **DO NOT** suppress errors without understanding them
- **DO NOT** make multiple unrelated changes at once
- **ALWAYS** verify the fix doesn't break other functionality
- **ALWAYS** explain the root cause, not just the fix
