---
description: End-to-end workflow for implementing new features
---

# Feature Development Workflow

## Prerequisites
- Feature requirements are clear
- No blocking dependencies

## Steps

### 1. Create Implementation Plan
// turbo
```bash
# Analyze existing patterns
ls apps/backend/src apps/frontend/src packages/
```

Create a plan covering:
- Files to create/modify
- Data models needed
- API endpoints required
- UI components needed

**⏸️ STOP: Get user approval on plan before proceeding**

### 2. Backend Implementation (if needed)

a. Update Prisma schema (if DB changes)
// turbo
```bash
pnpm --filter @repo/backend prisma format
```

b. Generate Prisma client
// turbo
```bash
pnpm --filter @repo/backend prisma generate
```

c. Create API endpoint:
- Add route in `apps/backend/src/routes/`
- Add controller in `apps/backend/src/controllers/`
- Add Zod schema for validation

### 3. Frontend Implementation (if needed)

a. Create components in `apps/frontend/src/components/`
b. Create/update pages in `apps/frontend/src/pages/`
c. Add API service methods
d. Add styles

### 4. Verification

// turbo
```bash
pnpm typecheck
```

// turbo
```bash
pnpm lint
```

// turbo
```bash
pnpm build
```

### 5. Test (if tests exist)
// turbo
```bash
pnpm test
```

### 6. Git Commit

Follow conventional commit format:
```
feat(<scope>): <description>
```

**✅ Feature complete**
