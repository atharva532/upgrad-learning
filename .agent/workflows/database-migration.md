---
description: Safe workflow for database schema changes
---

# Database Migration Workflow

## Prerequisites
- Schema change is planned
- Backup strategy is in place (for production)

## Steps

### 1. Plan the Migration

Document what changes are needed:
- New tables/columns?
- Modified columns?
- Deleted fields?
- Data migration needed?

**⏸️ STOP: Get user approval on migration plan**

### 2. Update Prisma Schema

Modify `apps/backend/prisma/schema.prisma`

// turbo
```bash
pnpm --filter @repo/backend prisma format
```

### 3. Generate Prisma Client (Dev Preview)

// turbo
```bash
pnpm --filter @repo/backend prisma generate
```

### 4. Create Migration File

**⚠️ REQUIRES APPROVAL**
```bash
pnpm --filter @repo/backend prisma migrate dev --name <migration_name>
```

Review the generated SQL in `prisma/migrations/`

### 5. Verify Build

// turbo
```bash
pnpm typecheck
```

// turbo
```bash
pnpm build
```

### 6. Update TypeScript Types

If the schema change affects shared types:
- Update types in `packages/types/`
- Update Zod schemas in `packages/schemas/`

### 7. Commit

```
feat(db): <description of schema change>

- Add/modify/remove <table/column>
- Migration: <migration_name>
```

**✅ Migration complete**

## Rollback (if needed)

```bash
pnpm --filter @repo/backend prisma migrate reset
```

⚠️ This will delete all data in development database
