---
mode: agent
---

# Next.js Engineer Prompt

## UI Strategy Overview

This project is a mobile-first web application built with Next.js, TypeScript,
and Material UI (MUI). The UI strategy emphasizes clean, maintainable, and
type-safe code, focusing on user experience and modern best practices.

### Frameworks and Libraries

- **Next.js** for server-side rendering, routing, and API routes, leveraging
  both server and client components for optimal performance and security.
- **TypeScript** for type safety and clear documentation of all data structures
  and component props.
- **Material UI (MUI)** for a consistent, accessible, and mobile-friendly
  component library. Layouts are managed with `Stack` and other MUI primitives,
  minimizing custom CSS.

### Component Structure

- **Client vs. Server Components**: Components using client-side hooks (e.g.,
  `useState`, `useEffect`) are marked with `"use client"` at the top.
  Server-only logic (such as authentication or database queries) is placed in
  server components or server actions.
- **Hooks for Logic**: Any component with logic beyond display (such as form
  state or side effects) uses a custom hook (e.g., `useNewSuperblock`). These
  hooks expose an API object (not destructured) for clarity and maintainability.
- **Props Access**: Props should typically be accessed directly with dot
  notation (e.g., `props.value`) instead of destructuring. This makes it more
  obvious where variables are coming from and improves readability.
- **API-Style Component Logic**: Prefer an API-style for working with
  components. Components with logic should have a separate local hook named
  `use{ComponentName}API`, used in the component as
  `const api = use{ComponentName}API()`. All logic, state, and event handlers
  (such as onClick) should be provided by this hook.
- **useCallback for Handlers**: Always use `useCallback` for onClick and similar
  event handlers, and these should be provided by the logic hook.
- **Type Safety & Inference**: All components and hooks are explicitly typed,
  and all types are documented. However, when TypeScript can infer types
  (especially for hook return values and function parameters), prefer inference
  over manual annotation for improved maintainability and clarity.
- **Type Aliases for Database Types**: When using types from the generated
  `database.types.ts` file, always create local type aliases for those types.
  This improves readability and maintainability, as the generated types are
  often verbose or unwieldy.

### Component Organization

- **Page-Specific Components**: Components that are only needed for a specific
  page and are not generally reusable are placed in a `_components` directory
  within that page's folder (e.g., `src/app/preferences/_components`).
- **General-Purpose Components**: Components intended for reuse across the
  application are placed in the top-level `components` directory.

### Forms and Server Actions

- **Form Handling**: Forms are built using MUI components and leverage the
  `component="form"` prop on `Stack` for semantic HTML.
- **Server Actions with .bind**: To perform server updates from the client,
  forms use server actions (async functions marked with `"use server"`). These
  actions are imported and called directly from client components, often using
  `.bind` to pre-fill parameters or to pass the `FormData` object. This enables
  secure, type-safe server mutations without exposing sensitive logic to the
  client.
- **Example**: In the preferences section, the `SetExercisePreferences`
  component renders forms for updating user exercise settings. Each form uses
  the `action` prop with a server action (e.g., `updateOneRepMax.bind(...)`) to
  securely update the database when the user submits a change. This pattern
  allows direct, type-safe server updates from the client UI without exposing
  sensitive logic or requiring extra API endpoints.

### Mobile-First Design

- **Layout**: Uses MUI's `Stack` for layout, with `flexWrap` and spacing to
  ensure components adapt to small screens. Avoid using `Box` entirely—prefer
  `Stack` for all layout purposes.
- **Minimal Custom CSS**: Styling is handled via MUI props (e.g., `spacing`,
  `boxShadow`, `bgcolor`) rather than custom CSS or `sx` unless necessary.
- **Accessibility**: MUI components provide accessible defaults, and forms use
  semantic elements for better mobile and screen reader support.

### Best Practices

- **No Relative Imports**: All imports use the `@/` alias for clarity and
  maintainability.
- **Short Files**: Files are kept under 150 lines when possible, splitting logic
  and UI into smaller components or hooks as needed.
- **Testing**: Uses `vitest` for integration tests, focusing on user-facing
  behavior rather than implementation details.
- **Function Documentation**: All functions should be well-typed and use
  JSDoc-style comments that explain not just what the function does, but also
  its intention and common usage patterns.

### Summary

The UI strategy centers on maintainability, type safety, and a seamless mobile
experience. By leveraging Next.js, TypeScript, and MUI, the application achieves
a modern, robust, and user-friendly interface, with secure and efficient server
interactions via server actions and form handling.
