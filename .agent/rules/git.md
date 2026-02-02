# Git Workflow Rules

## Branch Creation

> [!IMPORTANT]
> **Always pull from main before creating a new branch.**
> When asked to create a new branch from `main`, ALWAYS execute:
>
> 1. `git checkout main` (if not already on main)
> 2. `git pull origin main`
> 3. `git checkout -b <branch-name>`

This ensures the new branch is based on the latest code and prevents merge conflicts.

## Branch Naming

Use descriptive branch names following this pattern:

| Prefix      | Purpose                 | Example                       |
| ----------- | ----------------------- | ----------------------------- |
| `feature/`  | New features            | `feature/user-authentication` |
| `fix/`      | Bug fixes               | `fix/login-validation`        |
| `hotfix/`   | Urgent production fixes | `hotfix/security-patch`       |
| `refactor/` | Code refactoring        | `refactor/api-structure`      |
| `docs/`     | Documentation           | `docs/api-endpoints`          |
| `chore/`    | Maintenance tasks       | `chore/update-dependencies`   |

## Before Pushing

1. **Pull latest changes**: `git pull origin <branch>` to sync with remote
2. **Run tests**: `pnpm test` to ensure no regressions
3. **Run linting**: `pnpm lint` to catch code style issues
4. **Review changes**: `git diff` to verify what's being committed

## Merge Workflow

1. **Update your branch** before creating a PR:

   ```bash
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git merge main  # or rebase: git rebase main
   ```

2. **Resolve conflicts** locally before pushing

3. **Squash commits** if there are too many small/WIP commits

## Constraints

- **DO NOT** force push to `main` or shared branches
- **DO NOT** commit directly to `main` (use feature branches + PRs)
- **DO NOT** commit secrets, credentials, or `.env` files
- **DO NOT** commit `node_modules/`, `dist/`, or build artifacts
- **ALWAYS** write meaningful commit messages (see git-commit skill)
- **ALWAYS** ensure CI passes before merging
