---
name: Rules Index
description: Overview of all coding rules and when to apply them
---

# Rules

This directory contains coding standards and guidelines for the UpGrad Learning Platform.

## Available Rules

| Rule | Scope | Description |
|------|-------|-------------|
| [typescript.md](typescript.md) | All code | Strict types, no `any`, type guards |
| [react.md](react.md) | Frontend | Component patterns, hooks, state |
| [express.md](express.md) | Backend | API patterns, error handling |
| [security.md](security.md) | All code | Input validation, secrets, auth |
| [forbidden.md](forbidden.md) | All code | Actions requiring explicit approval |
| [context_files.md](context_files.md) | AI sessions | SPEC.md/STYLE.md protocol |
| [core_principles.md](core_principles.md) | All code | TDD, spec-first, security-first |
| [error-handling.md](error-handling.md) | All code | Error patterns, logging, recovery |
| [configuration.md](configuration.md) | All code | Environment variables, config |

---

## When to Apply

### Starting a Session
1. Read `context_files.md` - Load project context
2. Read `core_principles.md` - Understand core approach

### Writing Code
- **Frontend**: Apply `react.md` + `typescript.md`
- **Backend**: Apply `express.md` + `typescript.md`
- **Both**: Always apply `security.md`

### Before Committing
- Review `forbidden.md` for blocked actions
- Check `error-handling.md` for proper patterns

---

## Rule Priority

When rules conflict, apply in this order:

1. **Security** - Never compromise security
2. **Project-Specific** - Follow existing patterns
3. **Language Rules** - TypeScript/React/Express
4. **General Principles** - Core principles

> [!IMPORTANT]
> If unsure about a rule, ask for clarification rather than guessing.
