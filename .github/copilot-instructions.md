# Copilot Instructions

This project is a Next.js application using TypeScript and Material UI, with a
focus on mobile-first, maintainable, and type-safe code. Follow these summarized
standards:

## UI & Component Standards

- Use absolute imports (with `@/`), never relative imports.
- Prefer `const functionName = () => {}` for components and functions.
- Use `Stack` for layout (never `Box`), and minimal custom CSS.
- All logic/state for a component should be in a local hook named
  `use{ComponentName}API`, used as `const api = use{ComponentName}API()`. All
  event handlers (e.g., `onClick`) should be provided by this hook and wrapped
  in `useCallback`.
- Mark client components with `"use client"` at the top.
- Use explicit types and document all fields.
- Keep files under 150 lines; split if needed.
- Prefer export default, and use `React.FC<PropType>` for component typing.
- Only use `any` as a last resort, with a comment.
- Place page-specific components in a `_components` directory within the page
  folder; general-purpose components go in `components/`.

## Forms & Server Actions

- Use MUI components for forms, with `component="form"` on `Stack`.
- Use server actions (with `"use server"`) for mutations, called directly or
  with `.bind` from the client.

## Testing

- Use `vitest` for integration/flow-based tests, not isolated component tests
  unless necessary.
- Only mock external dependencies; use real implementations for internal
  logic/UI.
- Use `data-testid` for test targeting.
- Restore all mocks before each test; use `waitFor` and `act` for async UI
  updates.
- All tests must be in `*.integration.test.tsx` unless testing a utility/hook.

## Database

- Follow domain-driven design and composability (see `DATABASE_STRATEGY.md`).
- Use enums for domain values, join tables for many-to-many, and stored
  procedures for business logic.
- All migrations and database code must be well-commented.
- Write flow-based tests for stored procedures and user flows, not just
  tables/columns.
- Use PGTap for database tests; all test files must use a sortable numeric
  prefix.

## General

- Never change source and test files at the same time unless necessary.
- If a change breaks tests, discuss options before proceeding.

For details, see the full strategy docs in `/docs`

## Misc

When asked to reset the database, run the following command:

```bash
pnpm run db:reset --notify --sound
```
