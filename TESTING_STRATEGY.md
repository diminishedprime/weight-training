# Testing Strategy

## Overview

We want our component tests to be flow-based, integration-style tests. The goal
is to ensure robust coverage of user journeys and application flows, without
redundant or overly granular test files. This approach will help us:

- Validate that components work together as expected in real-world scenarios.
- Reduce maintenance overhead by focusing on meaningful, high-value tests.
- Keep test coverage high by ensuring all important variants and edge cases are
  exercised within the context of actual pages and flows.

## Key Principles

- **Test Flows, Not Just Components:**  
  Focus on testing how components interact within pages and user flows, rather
  than testing each component in isolation.
- **Variant Coverage in Context:**  
  Ensure that all important component variants and edge cases are covered within
  the main page or flow tests, rather than in separate files.
- **Minimal Mocks:**  
  Only mock external dependencies (e.g., network requests, third-party services,
  authentication, database). Prefer using real implementations for internal
  logic and UI.  
  Example:
  ```ts
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    fakeServerUtil.requireLoggedInUser(USER_ID)
  );
  ```
- **Use Test IDs for Targeting:**  
  Use `data-testid` attributes for elements that need to be targeted in tests,
  especially for dynamic or interactive UI elements.
- **Maintain High Coverage:**  
  Use coverage tools to ensure that all critical paths, branches, and variants
  are exercised by flow tests.
- **Descriptive, Behavior-Focused Tests:**  
  Write tests that describe user behaviors and expected outcomes, not
  implementation details. Assertions should reflect user-visible outcomes (e.g.,
  input values, visible messages) rather than internal state.
- **Minimal Logic in Tests:**  
  Tests should avoid complex logic and instead focus on clear, step-by-step user
  flows.
- **Edge Case Coverage:**  
  Cover both typical and edge cases (e.g., not logged in, error handling,
  special UI buttons).
- **No stderr Output:**  
  All tests should run cleanly without warnings or errors in stderr. Fix any act
  warnings, Suspense warnings, or other noisy output before considering a test
  complete.

## Test Organization

- **Page/Flow Tests:**  
  Each main page or user flow should have a corresponding test file (e.g.,
  `page.integration.test.tsx`). These tests should cover:
  - Typical user journeys
  - Error and edge cases
  - All important UI variants as they appear in the flow
- **Component Tests (When Needed):**  
  Only write isolated component tests for:
  - Highly reusable components with complex logic not easily covered in flows
  - Utility hooks or functions
- **Test File Naming:**
  - Use `.integration.test.tsx` for flow/page tests
  - Use `.test.tsx` or `.test.ts` for rare isolated component or utility tests

## Example

Instead of testing a `DateTimePicker` component in isolation, write tests for
the page(s) where it is used, ensuring all relevant behaviors and edge cases are
covered in the context of the actual user flow.

## Tools

- **Vitest** for running tests and collecting coverage.
- **Testing Library** for simulating user interactions and verifying UI
  behavior.
- **Stryker** for mutation testing to ensure test suite effectiveness.

## Additional Guidelines

- Restore all mocks before each test to ensure isolation and prevent test
  bleed-through.
- Prefer using `await waitFor(...)` for async UI updates.
- Use `act` when simulating user actions that trigger state changes.
- When checking for side effects (e.g., API calls), assert that the correct mock
  functions were called with expected arguments.
- Keep test files focused and concise; if a test file grows too large, consider
  splitting by flow or major feature.
