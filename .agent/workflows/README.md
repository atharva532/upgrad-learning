---
name: Workflows Index
description: Step-by-step processes for common development tasks
---

# Workflows

This directory contains step-by-step workflows for common development tasks.

## Available Workflows

| Workflow                                         | Command                | Description                         |
| ------------------------------------------------ | ---------------------- | ----------------------------------- |
| [feature-development.md](feature-development.md) | `/feature-development` | End-to-end feature implementation   |
| [bug-fix.md](bug-fix.md)                         | `/bug-fix`             | Systematic bug diagnosis and fixing |
| [code-review.md](code-review.md)                 | `/code-review`         | Thorough code review process        |
| [database-migration.md](database-migration.md)   | `/database-migration`  | Safe database schema changes        |
| [greenfield.md](greenfield.md)                   | `/greenfield`          | New project setup from scratch      |
| [refactoring.md](refactoring.md)                 | `/refactoring`         | Safe code cleanup and restructuring |

---

## Usage

Invoke a workflow using its slash command:

```
/feature-development
/bug-fix
```

Or reference the workflow by name when asking the AI assistant.

---

## Workflow Annotations

### `// turbo`

Commands marked with `// turbo` are safe to auto-run without user approval.

### `⏸️ STOP`

Steps marked with STOP require user approval before continuing.

### `> [!CAUTION]`

Critical warnings that must be followed.

---

## Choosing a Workflow

```mermaid
flowchart TD
    A[What are you doing?] --> B{New project?}
    B -->|Yes| C[/greenfield]
    B -->|No| D{Adding feature?}
    D -->|Yes| E[/feature-development]
    D -->|No| F{Fixing bug?}
    F -->|Yes| G[/bug-fix]
    F -->|No| H{Changing DB?}
    H -->|Yes| I[/database-migration]
    H -->|No| J{Cleaning code?}
    J -->|Yes| K[/refactoring]
    J -->|No| L[/code-review]
```
