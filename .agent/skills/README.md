---
name: Skills Index
description: Specialized AI personas for different development tasks
---

# Skills

This directory contains specialized AI personas (skills) for different development tasks.

## Available Skills

| Skill | File | Role |
|-------|------|------|
| **System Architect** | [architect/](architect/SKILL.md) | Designs architecture, makes technical decisions |
| **Code Implementer** | [implementer/](implementer/SKILL.md) | Implements features following patterns |
| **Code Reviewer** | [reviewer/](reviewer/SKILL.md) | Reviews code for quality and security |
| **Debugger** | [debugger/](debugger/SKILL.md) | Diagnoses and fixes bugs |
| **Test Writer** | [tester/](tester/SKILL.md) | Writes comprehensive tests |
| **Git Commit** | [git-commit/](git-commit/SKILL.md) | Creates semantic commit messages |
| **Security Analyst** | [security/](security/SKILL.md) | Identifies vulnerabilities |
| **Fullstack Monorepo** | [fullstack-monorepo/](fullstack-monorepo/SKILL.md) | Manages monorepo structure |
| **Code Explainer** | [explainer/](explainer/SKILL.md) | Explains code for different audiences |
| **Researcher** | [researcher/](researcher/SKILL.md) | Researches technical topics |

---

## Skill Structure

Each skill follows this format:

```yaml
---
name: Skill Name
description: What this skill does
---

# Skill Name

[Role description and responsibilities]

## Process / Patterns
[How to approach tasks]

## Code Examples
[Relevant code patterns]

## Constraints
[DO NOT / ALWAYS rules]
```

---

## When to Use Each Skill

| Task | Primary Skill | Supporting Skills |
|------|---------------|-------------------|
| **Planning** | Architect | Researcher |
| **Coding** | Implementer | Fullstack Monorepo |
| **Reviewing** | Reviewer | Security Analyst |
| **Testing** | Tester | Debugger |
| **Fixing Bugs** | Debugger | Tester |
| **Committing** | Git Commit | - |
| **Explaining** | Explainer | - |

---

## Skill Combinations

For complex tasks, skills can be combined:

1. **New Feature**: Architect → Implementer → Tester → Reviewer
2. **Bug Fix**: Debugger → Tester → Git Commit
3. **Security Audit**: Security Analyst → Reviewer
4. **Refactoring**: Architect → Implementer → Tester
