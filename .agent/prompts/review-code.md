# Review Code Prompt

Use this prompt template when asking the agent to review code.

## Template

```
Review the following code:

**File(s) to review:**
- [File path 1]
- [File path 2]

**Change summary:**
[Brief description of what the code does]

**Focus areas:**
[ ] Correctness
[ ] Security
[ ] Performance
[ ] Code quality
[ ] TypeScript types
[ ] All of the above

**Specific concerns (if any):**
- [Concern 1]
- [Concern 2]
```

## Example

```
Review the following code:

**File(s) to review:**
- apps/backend/src/controllers/auth.controller.ts
- apps/backend/src/services/auth.service.ts

**Change summary:**
New JWT authentication implementation

**Focus areas:**
[x] Security
[x] Correctness
[ ] Performance
[x] TypeScript types

**Specific concerns (if any):**
- Token expiration handling
- Password comparison timing attacks
- Proper error messages (don't leak info)
```
