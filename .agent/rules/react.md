---
name: React Rules
description: Component patterns, hooks, state management, and accessibility for React frontend
---

# React Rules

## Component Guidelines

### DO

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Colocate styles with components
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations

### DON'T

- Use class components
- Put business logic in components (use hooks/services)
- Use inline styles for complex styling
- Mutate state directly
- Use `useEffect` for derived state (compute it directly)

## Component Structure

```tsx
// 1. Imports
import { useState, useCallback } from 'react';
import type { User } from '@repo/types';
import styles from './UserCard.module.css';

// 2. Types
interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

// 3. Component
export function UserCard({ user, onSelect }: UserCardProps) {
  // 3a. State
  const [isExpanded, setIsExpanded] = useState(false);

  // 3b. Callbacks
  const handleClick = useCallback(() => {
    onSelect?.(user);
  }, [user, onSelect]);

  // 3c. Render
  return (
    <div className={styles.card} onClick={handleClick}>
      <h3>{user.name}</h3>
      {isExpanded && <p>{user.email}</p>}
    </div>
  );
}
```

## Hooks Guidelines

```tsx
// Custom hooks start with 'use'
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [id]);

  return { user, loading };
}
```

## State Management

- Use React Query for server state
- Use useState/useReducer for local state
- Lift state only when necessary
- Avoid prop drilling - use context or composition

---

## Accessibility (a11y)

### Required Practices

```tsx
// ✅ Use semantic HTML
<button onClick={handleClick}>Submit</button>  // Not <div>

// ✅ Add labels to form elements
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-describedby="email-hint" />
<span id="email-hint">We'll never share your email</span>

// ✅ Add alt text to images
<img src={avatar} alt="User profile photo" />
<img src={decorative} alt="" />  {/* Empty alt for decorative */}

// ✅ Use ARIA when needed
<button aria-label="Close modal" aria-pressed={isOpen}>×</button>
<div role="alert" aria-live="polite">{errorMessage}</div>
```

### Keyboard Navigation

```tsx
// ✅ Ensure focus is visible
.button:focus {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

// ✅ Handle keyboard events
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Clickable div
</div>
```

### Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical (follows visual order)
- [ ] Color is not the only indicator (add icons/text)
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Forms have associated labels
- [ ] Error messages are announced to screen readers

---

## Constraints

- **DO NOT** use `div` for interactive elements (use `button`, `a`)
- **DO NOT** remove focus outlines without replacement
- **DO NOT** use color alone to convey meaning
- **ALWAYS** provide text alternatives for images
- **ALWAYS** test with keyboard navigation
