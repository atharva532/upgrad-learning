# Context Files (Memory Banks)

These files act as "external memory" that prevents the AI from forgetting project constraints over long sessions.

---

## Context Loading Protocol

> [!IMPORTANT]
> **At Session Start**: Scan the root directory for `SPEC.md`, `STYLE.md`, and `AGENTS.md`. If these files exist, ingest them as the primary context for all decisions.

If a user request contradicts the content of `SPEC.md`, **stop and ask for clarification**:

> "This request contradicts the agreed architecture in SPEC.md. Should we update the spec?"

---

## 1. The Living Specification (`SPEC.md`)

### Purpose
Contains the high-level design, architectural decisions, and approved feature plan.

### Rule
Treat this file as the **absolute source of truth**. Before writing code, read this file to ensure alignment with the master plan.

### Maintenance
If the user changes requirements during the chat, you **must update `SPEC.md`** to reflect the new consensus before implementing code. This prevents 'context loss' and ensures the spec remains a living executable artifact.

---

## 2. The Style Guide (`STYLE.md`)

### Purpose
Documents the project's specific naming conventions, preferred libraries, and formatting rules.

### Rule
Prioritize conventions in this file **over general language standards**. If this file provides examples, you must follow them strictly.

### Anti-Pattern Check
Use this file to verify you are not introducing:
- Inconsistent abstractions
- Forbidden dependencies
- Style violations

---

## 3. The Agent Configuration (`AGENTS.md`)

### Purpose
Defines how AI assistants should behave in this project.

### Rule
- Follow any agent-specific instructions
- Respect tool preferences
- Apply project-specific patterns

---

## 4. The Project Entry Point (`README.md`)

### Purpose
Defines the project overview, build instructions, and component summary.

### Rule
- **Greenfield**: When initializing a project, generate this file first
- **Feature Development**: When adding new features or changing APIs, update this file to keep documentation synchronized with code

---

## Quick Reference

| File | Purpose | When to Update |
|------|---------|----------------|
| `SPEC.md` | Architecture & design decisions | When requirements change |
| `STYLE.md` | Coding conventions & standards | When new patterns are adopted |
| `AGENTS.md` | AI behavior configuration | When changing AI workflows |
| `README.md` | Project overview & build instructions | When adding features or changing APIs |

---

## Context Loss Prevention

> [!CAUTION]
> AI assistants have limited context windows. To prevent forgetting:

1. **Reference context files** at the start of complex tasks
2. **Update spec files** when requirements change
3. **Create summary files** for large codebases
4. **Use explicit file links** instead of vague references
