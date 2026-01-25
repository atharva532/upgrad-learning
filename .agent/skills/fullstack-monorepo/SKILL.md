---
name: Fullstack Monorepo
description: Manages the fullstack monorepo structure with pnpm workspaces
---

# Fullstack Monorepo Skill

You manage a production-grade fullstack monorepo with shared packages.

## Project Structure

```text
upgradlearning/
├── apps/
│   ├── frontend/         # React + Vite
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── styles/
│   │   └── package.json
│   └── backend/          # Express + Prisma
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   └── routes/
│       ├── prisma/
│       └── package.json
├── packages/             # Shared packages
├── .agent/               # Agent configuration
└── package.json          # Root workspace
```

## Workspace Commands

```bash
# Install all dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm --filter @repo/frontend dev
pnpm --filter @repo/backend dev

# Build all packages
pnpm build

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

## Package Management

### Adding Dependencies

```bash
# Add to specific package
pnpm --filter @repo/frontend add react-router-dom
pnpm --filter @repo/backend add express

# Add dev dependency
pnpm --filter @repo/frontend add -D @types/react

# Add to root (shared tooling)
pnpm add -D -w typescript prettier
```

### Workspace References

```json
// In apps/frontend/package.json
{
  "dependencies": {
    "@repo/types": "workspace:*",
    "@repo/schemas": "workspace:*"
  }
}
```

## Database Operations

```bash
# Generate Prisma client
pnpm --filter @repo/backend prisma generate

# Push schema changes (dev)
pnpm --filter @repo/backend prisma db push

# Create migration
pnpm --filter @repo/backend prisma migrate dev --name add_user_table

# Open Prisma Studio
pnpm --filter @repo/backend prisma studio
```

## Creating New Packages

### New Shared Package

```bash
mkdir -p packages/new-package/src
```

```json
// packages/new-package/package.json
{
  "name": "@repo/new-package",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### New App

```bash
mkdir -p apps/new-app/src
```

## Best Practices

1. **Shared Types**: Define all DTOs and types in `packages/types`
2. **Shared Validation**: Use Zod schemas from `packages/schemas`
3. **No Circular Deps**: Packages should not depend on apps
4. **Version Lock**: Use `workspace:*` for internal dependencies
5. **Root Scripts**: Define common scripts in root package.json

## Dependency Rules

```text
apps/frontend  →  packages/*  ✅
apps/backend   →  packages/*  ✅
packages/a     →  packages/b  ✅ (if no cycle)
apps/*         →  apps/*      ❌ (apps don't depend on each other)
packages/*     →  apps/*      ❌ (packages don't depend on apps)
```

## Constraints

- **DO NOT** create circular dependencies
- **DO NOT** put app-specific code in packages
- **DO NOT** duplicate types across packages
- **ALWAYS** use workspace protocol for internal deps
- **ALWAYS** run `pnpm install` after package.json changes
