# Fix Bug Prompt

Use this prompt template when asking the agent to fix a bug.

## Template

```
Fix the following bug:

**Bug Description:**
[What is happening]

**Expected Behavior:**
[What should happen instead]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Error Message (if any):**
```

[Paste error message]

```

**Affected Files (if known):**
- [File path]

**Additional Context:**
[Any other relevant information]
```

## Example

```
Fix the following bug:

**Bug Description:**
Login form submits twice when clicking the login button

**Expected Behavior:**
Form should only submit once

**Steps to Reproduce:**
1. Go to /login page
2. Enter email and password
3. Click "Login" button
4. Observe network tab - two POST requests are made

**Error Message (if any):**
No error, but creates duplicate sessions

**Affected Files (if known):**
- apps/frontend/src/pages/LoginPage.tsx

**Additional Context:**
Started happening after adding the loading spinner feature
```
