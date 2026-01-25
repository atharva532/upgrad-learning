---
description: Workflow for starting a new project from scratch (greenfield)
---

# Greenfield Development Workflow

When creating a new project or major feature from scratch.

## 1. Specification First

Before writing any code:

a. Create or update `SPEC.md` with:

- Project overview and goals
- Core features and requirements
- Technical constraints
- Non-functional requirements

b. Create or update `STYLE.md` with:

- Coding conventions
- Naming patterns
- Preferred libraries

**⏸️ STOP: Get user approval on specification before proceeding**

## 2. Architecture Design

Define the high-level structure:

// turbo

```bash
# Start with folder structure
mkdir -p apps/frontend apps/backend packages/shared
```

Create architecture document covering:

- Component breakdown
- Data models
- API contracts
- Integration points

## 3. Scaffold Project

// turbo

```bash
# Initialize workspace
pnpm install
```

Generate skeleton files:

- Package.json files for each app/package
- TypeScript configurations
- Base configurations (ESLint, Prettier)

## 4. Shared Types First

Start with the shared package:

// turbo

```bash
# Build shared types
pnpm --filter @repo/shared build
```

Define:

- Core entities and DTOs
- Validation schemas (Zod)
- Common utilities

## 5. Backend Scaffold

// turbo

```bash
# Set up Prisma
pnpm --filter @repo/backend prisma init
```

Create:

- Database schema
- Base routes and middleware
- Error handling

## 6. Frontend Scaffold

// turbo

```bash
# Verify frontend setup
pnpm --filter @repo/frontend dev
```

Create:

- Routing structure
- Layout components
- API client setup

## 7. Integration Test

// turbo

```bash
# Run full verification
pnpm build
pnpm typecheck
pnpm lint
```

Verify:

- Build succeeds
- Types are aligned
- No circular dependencies

## 8. Documentation

Update `README.md` with:

- Project overview
- Setup instructions
- Development workflow

**✅ Greenfield setup complete**
