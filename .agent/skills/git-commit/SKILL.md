---
name: Git Commit
description: Creates semantic, conventional commit messages following project standards
---

# Git Commit Skill

Create clear, semantic commit messages following Conventional Commits specification.

## Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type       | Description                  | Example                                    |
| ---------- | ---------------------------- | ------------------------------------------ |
| `feat`     | New feature                  | `feat(auth): add login endpoint`           |
| `fix`      | Bug fix                      | `fix(api): handle null user response`      |
| `docs`     | Documentation                | `docs(readme): update setup instructions`  |
| `style`    | Formatting (no code change)  | `style(lint): fix indentation`             |
| `refactor` | Code change (no feature/fix) | `refactor(user): extract validation logic` |
| `perf`     | Performance improvement      | `perf(query): add database index`          |
| `test`     | Adding tests                 | `test(auth): add login unit tests`         |
| `chore`    | Build/tooling                | `chore(deps): update typescript to 5.3`    |
| `ci`       | CI/CD changes                | `ci(github): add deploy workflow`          |

## Scopes

| Scope      | Description          |
| ---------- | -------------------- |
| `frontend` | Frontend app changes |
| `backend`  | Backend app changes  |
| `api`      | API endpoints        |
| `auth`     | Authentication       |
| `db`       | Database/Prisma      |
| `ui`       | UI components        |
| `types`    | Shared types package |
| `deps`     | Dependencies         |

## Examples

### Feature

```
feat(backend): add user registration endpoint

- Add POST /api/users route
- Add Zod validation for user input
- Add password hashing with bcrypt
- Create user in database with Prisma

Closes #123
```

### Bug Fix

```
fix(frontend): prevent form double submission

The submit button was not disabled during API call,
allowing users to click multiple times and create
duplicate entries.

- Add loading state to form
- Disable submit button while loading
- Show loading spinner

Fixes #456
```

### Breaking Change

```
feat(api)!: rename user endpoint to users

BREAKING CHANGE: The /api/user endpoint has been renamed
to /api/users to follow REST conventions.

Migration: Update all client code to use /api/users
```

### Multiple Files

```
refactor(types): consolidate user types

Move all user-related types to a single file for
better organization and discoverability.

- Merge user.ts and user-dto.ts into user.types.ts
- Update all imports across packages
- Add JSDoc comments for each type
```

## Rules

1. **Subject line max 72 characters**
2. **Use imperative mood** ("add" not "added" or "adds")
3. **Don't end subject with period**
4. **Separate subject from body with blank line**
5. **Wrap body at 72 characters**
6. **Use body to explain what and why, not how**

## Constraints

- **DO NOT** combine unrelated changes in one commit
- **DO NOT** use vague messages like "fix bug" or "update code"
- **DO NOT** commit broken code to main branch
- **ALWAYS** reference issue numbers when applicable
- **ALWAYS** use conventional commit format
