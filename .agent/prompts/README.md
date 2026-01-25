# Saved Prompts & Patterns

This directory contains reusable prompt patterns for common development tasks.

## Available Patterns

| Pattern           | File                   | Purpose                         |
| ----------------- | ---------------------- | ------------------------------- |
| Implement Feature | `implement-feature.md` | Feature implementation template |
| Fix Bug           | `fix-bug.md`           | Bug fixing workflow             |
| Review Code       | `review-code.md`       | Structured code review          |
| Write Tests       | `write-tests.md`       | Test generation template        |

---

## Usage Guidelines

### ✅ DO

- Use structured patterns that define **input**, **task**, and **output format**
- Verify AI suggestions with tests (especially for debugging fixes)
- Refine context or specification if a pattern doesn't work
- Be specific about files, functions, and components

### ❌ DON'T (Anti-Patterns)

| Anti-Pattern           | Problem                                                 | Solution                                          |
| ---------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| **Open-Ended Wording** | "What's the best way to do X?" leads to vague responses | Use structured patterns with clear inputs/outputs |
| **Prompt Thrashing**   | Asking the same thing repeatedly                        | If it fails twice, stop and refine the context    |
| **Blind Trust**        | Accepting fixes without verification                    | Always verify with regression tests               |
| **Context Overload**   | Dumping entire codebase                                 | Provide only relevant files and context           |
| **Vague Scope**        | "Make the code better"                                  | Specify exactly what to improve and why           |

---

## Quick Reference Templates

```
# Feature Implementation
Implement [FEATURE] following the existing patterns in this codebase.
Files to modify: [list files]
Acceptance criteria: [list criteria]

# Bug Fix
Error: [error message/trace]
Code: [relevant code]
Task: Identify root cause, propose minimal fix, add regression test.

# Code Review
Review [file/PR] for:
- Security vulnerabilities
- Performance issues
- Code style violations
- Missing error handling

# Test Writing
Create tests for [component/function] covering:
- Happy path scenarios
- Edge cases
- Error conditions
```

---

## Effective Prompting Tips

1. **Provide Context**: Include relevant files, not just the problem description
2. **Be Specific**: Name exact files, functions, and line numbers
3. **Define Success**: Clearly state what "done" looks like
4. **Chunk Large Tasks**: Break into smaller, verifiable steps
5. **Request Verification**: Ask for tests or validation steps
