# Master Validation Checklist (Definition of Done)

This checklist catches defects and vulnerabilities commonly found in AI-generated code.

> [!IMPORTANT]
> **Before finalizing any code**, verify it against this checklist. If any item fails, correct the code immediately.

---

## Code Quality

### 1. Specification Compliance

- [ ] Does the code implement exactly what was requested?
- [ ] Are all acceptance criteria met?
- [ ] Does it match the agreed architecture in SPEC.md?

### 2. Architecture Fit

- [ ] Is the code in the correct package/layer?
- [ ] Is business logic kept in services, NOT in controllers?
- [ ] Are dependencies flowing in the correct direction?

```
┌─────────────────────────────────────┐
│       Frameworks & Drivers          │  ← Outer (Express, Prisma, React)
├─────────────────────────────────────┤
│       Interface Adapters            │  ← Controllers, Gateways
├─────────────────────────────────────┤
│       Application Layer             │  ← Use Cases / Services
├─────────────────────────────────────┤
│       Domain / Entities             │  ← Inner (Pure Business Logic)
└─────────────────────────────────────┘
          Dependencies point INWARD →
```

### 3. Duplication Check

- [ ] Does an existing utility already solve this?
- [ ] Have you checked `packages/shared` for reusable code?
- [ ] Are you NOT duplicating code?

---

## AI-Specific Checks

### 4. Import Integrity (Hallucination Check)

- [ ] Are **ALL imports real**?
- [ ] Are package names spelled correctly?
- [ ] Is the imported module actually exported from the source?
- [ ] Verify NO hallucinated libraries or 'dependency squatting'

```typescript
// ❌ VERIFY: Is this import real?
import { someFunction } from 'non-existent-package';

// ✅ VERIFY: Check that the export exists
import { UserDTO } from '@repo/shared'; // Exists in packages/shared?
```

### 5. API Consistency

- [ ] Do function signatures match existing patterns?
- [ ] Are error types consistent with the codebase?
- [ ] Are return types explicit (no implicit `any`)?

---

## Naming & Style

### 6. Conventions

- [ ] Do class/component names follow PascalCase?
- [ ] Do variables/functions follow camelCase?
- [ ] Are files named consistently with the project?
- [ ] Do enum values follow SCREAMING_SNAKE_CASE?

---

## Error Handling

### 7. Exception Management

- [ ] Are specific, meaningful errors used (not generic `Error`)?
- [ ] Are low-level errors wrapped with context?
- [ ] Are errors logged before being rethrown?

```typescript
// ✅ GOOD: Specific error with context
throw new AppError('User not found', 404, { userId });

// ❌ BAD: Generic error
throw new Error('Something went wrong');
```

---

## Security

### 8. Security Sanity

- [ ] **Injection**: Are all queries parameterized (Prisma handles this)?
- [ ] **XSS**: Is output properly encoded/escaped?
- [ ] **Secrets**: Are there ZERO hard-coded credentials?
- [ ] **Validation**: Is user input validated with Zod schemas?

---

## Observability

### 9. Logging & Monitoring

- [ ] Are structured logs added for critical paths?
- [ ] Are errors logged with stack traces?
- [ ] Can the operation be traced end-to-end?

---

## Verification

### 10. Tests

- [ ] Do tests exist for the new functionality?
- [ ] Are edge cases covered?
- [ ] Do all tests pass? (`pnpm test`)

### 11. Build & Lint

- [ ] `pnpm typecheck` passes?
- [ ] `pnpm lint` passes?
- [ ] `pnpm build` succeeds?

---

## Documentation

### 12. Code Documentation

- [ ] Are complex functions documented with JSDoc?
- [ ] Are non-obvious decisions explained in comments?
- [ ] Is README updated if adding new features?
