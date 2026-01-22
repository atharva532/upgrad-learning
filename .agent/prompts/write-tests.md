# Write Tests Prompt

Use this prompt template when asking the agent to write tests.

## Template

```
Write tests for [COMPONENT/FUNCTION/MODULE]:

**File to test:**
[Path to the file]

**Test type:**
[ ] Unit tests
[ ] Integration tests
[ ] E2E tests

**Coverage requirements:**
- [ ] Happy path
- [ ] Error cases
- [ ] Edge cases
- [ ] [Specific scenario]

**Mock requirements:**
- [What needs to be mocked]
```

## Example

```
Write tests for UserService:

**File to test:**
apps/backend/src/services/user.service.ts

**Test type:**
[x] Unit tests
[ ] Integration tests
[ ] E2E tests

**Coverage requirements:**
- [x] Happy path (create, findById, update, delete)
- [x] Error cases (not found, validation errors)
- [x] Edge cases (duplicate email)

**Mock requirements:**
- Prisma client
- bcrypt for password hashing
```
