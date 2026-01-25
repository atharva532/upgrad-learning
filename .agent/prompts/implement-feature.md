# Implement Feature Prompt

Use this prompt template when asking the agent to implement a new feature.

## Template

```text
Implement [FEATURE_NAME] with the following requirements:

**Description:**
[What the feature should do]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Technical Requirements:**
- Backend: [API endpoints needed]
- Frontend: [UI components needed]
- Database: [Schema changes needed]

**Files to modify/create:**
- [File path 1]
- [File path 2]
```

## Example

```text
Implement user profile page with the following requirements:

**Description:**
A page where users can view and edit their profile information.

**Acceptance Criteria:**
- [ ] Users can view their name, email, and role
- [ ] Users can edit their name
- [ ] Changes are saved to the database
- [ ] Success/error messages are shown

**Technical Requirements:**
- Backend: GET/PUT /api/users/:id endpoints
- Frontend: ProfilePage component with form
- Database: No schema changes (User model exists)

**Files to modify/create:**
- apps/backend/src/routes/user.routes.ts
- apps/backend/src/controllers/user.controller.ts
- apps/frontend/src/pages/ProfilePage.tsx
```
