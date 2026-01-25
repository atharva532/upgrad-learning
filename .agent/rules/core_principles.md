# Core Principles (Universal Rules)

These rules apply to all code generation and development tasks in this project.

---

## 1. Specification-First Workflow

> [!IMPORTANT]
> Always treat the specification as the source of truth.

Before writing any code:

1. Draft a clear, high-level specification or architecture plan
2. Outline the objectives, components, and step-by-step plan
3. Get user approval on the plan

**DO NOT** dive straight into code without alignment on scope.

---

## 2. Test-Driven Development (TDD) Mindset

For any new functionality:

1. **First** - Write tests that cover normal behavior and edge cases
2. **Then** - Implement the code to satisfy them

```typescript
// Step 1: Write the test first
describe('UserService', () => {
  it('should throw error for invalid email', () => {
    expect(() => userService.create({ email: 'invalid' })).toThrow('Invalid email format');
  });
});

// Step 2: Implement to pass the test
function create(data: CreateUserDTO): User {
  if (!isValidEmail(data.email)) {
    throw new AppError('Invalid email format', 400);
  }
  // ...
}
```

This ensures verifiability and prevents missing edge cases.

---

## 3. Context Awareness & Consistency

- **Read** architectural notes, existing code, and documentation before implementing
- **Don't** ignore project constraints or contradict previous decisions
- **Use** `SPEC.md` and `STYLE.md` as external memory for project conventions

If a request contradicts existing architecture:

> "This contradicts the current architecture. Should we update the spec?"

---

## 4. Don't Reinvent the Wheel

- Favor simple, explicit code
- Respect existing abstractions
- Check if an existing utility already solves the problem

```typescript
// ❌ BAD: Reinventing the wheel
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // ... 20 more lines
}

// ✅ GOOD: Use existing utilities
import { format } from 'date-fns';
const formatted = format(date, 'yyyy-MM-dd');
```

---

## 5. Security-First Implementation

Assume all output is untrusted:

- Prevent injection attacks and XSS
- Never use hard-coded credentials
- Never skip input validation
- When fixing code, prioritize security

---

## 6. Refactoring Protocol

When refactoring:

1. **Preserve** all existing behavior and side effects
2. **Output** unified diffs showing changes
3. **Don't** modify public APIs unless specified
4. **Test** that nothing breaks after changes

```typescript
// Before refactoring, identify what must NOT change:
// - Public API signatures
// - Return value types
// - Side effects (logging, events)
// - Error behavior
```
