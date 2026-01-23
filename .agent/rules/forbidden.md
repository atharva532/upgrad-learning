---
name: Forbidden Actions
description: Actions the AI agent must NEVER perform without explicit approval
---

# Forbidden Actions

Actions the agent must NEVER perform without explicit user approval.

## File Operations

### Never Modify

- `.env` files (contains secrets)
- `pnpm-lock.yaml` (modify through pnpm commands only)
- `.git/` directory
- `node_modules/` directory

### Never Delete Without Approval

- `package.json` files
- Prisma schema files
- Configuration files (tsconfig, vite.config, etc.)
- Any file containing > 100 lines of code

## Code Operations

### Never Do

- Use `any` type
- Use `// @ts-ignore`
- Disable ESLint rules inline
- Commit directly to main branch
- Push to remote without approval

### Always Require Approval For

- Database migrations
- Deleting files
- Installing new dependencies
- Changing authentication logic
- Modifying security configurations

## Terminal Commands

### Auto-Approve (Safe)

- `pnpm install`
- `pnpm build`
- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma generate`
- `cat`, `ls`, `head`, `tail`

### Require Approval

- `pnpm prisma migrate *`
- `pnpm prisma db push`
- `rm`, `rmdir`
- `git push`
- `npm publish`

### Never Execute

- `sudo *`
- `curl` / `wget` to external URLs
- `ssh`
- Any command with passwords/secrets
