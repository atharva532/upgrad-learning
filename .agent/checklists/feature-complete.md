# Feature Complete Checklist

Run through this checklist before marking a feature as complete.

## Implementation

### Backend (if applicable)

- [ ] API endpoints implemented
- [ ] Input validation with Zod schemas
- [ ] Error handling with appropriate status codes
- [ ] Response format is consistent
- [ ] Database queries are optimized

### Frontend (if applicable)

- [ ] UI components created/updated
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Responsive design works
- [ ] Accessibility basics (labels, keyboard nav)

### Shared

- [ ] Types added to @repo/types (if needed)
- [ ] Schemas added to @repo/schemas (if needed)

## Quality

### Verification

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds

### Testing

- [ ] Manual testing completed
- [ ] Unit tests written (if required)
- [ ] Edge cases tested

### Documentation

- [ ] Code is self-documenting
- [ ] JSDoc comments for public APIs
- [ ] README updated (if needed)

## Final Review

- [ ] No TODO comments without issue numbers
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Security checklist passed
- [ ] Code review requested
