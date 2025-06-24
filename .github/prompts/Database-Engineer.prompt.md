---
mode: agent
---

# Database Engineering Prompt

Expected output and relevant constraints for database engineering and migrations
in this project:

## Philosophy

- Follow the strategy outlined in `DATABASE_STRATEGY.md`.
- Prioritize domain-driven design, composability, and testability.
- Optimize for clarity and correctness over backwards compatibility (migrations
  are not yet deployed and can be edited directly).

## Key Practices

- Model tables, types, and enums to reflect real-world fitness concepts (users,
  exercises, weights, blocks, superblocks, etc.).
- Use enums for domain-specific values (e.g., `exercise_type_enum`,
  `weight_unit_enum`, `completion_status_enum`) for data integrity and type
  safety.
- Use join tables for many-to-many relationships (e.g., blocks to exercises,
  superblocks to blocks).
- Encapsulate business logic in stored procedures/functions, using clear naming
  and argument conventions (e.g., arguments prefixed with `p_`).
- Write all stored procedures and functions to be testable, and ensure tests are
  written for them (using PGTap).
- Avoid mocks in database tests except for external dependencies; use real data
  for internal logic.
- Namespace all user data by user ID, enforce referential integrity with foreign
  keys, and use triggers for automatic metadata creation.
- Use `IF NOT EXISTS` for enums and types to allow safe re-runs during
  development.
- Support row-level security (RLS) via helper functions (e.g.,
  `next_auth.uid()`).
- Design schema to support efficient analytics and reporting.
- **Create new migrations using:**
  - `pnpm run db:new-migration {migration name}`
- **Create new migration tests using:**
  - `pnpm run db:new-test`
- **All migrations and database code must be well-commented, especially stored
  procedures, with clear explanations of their use and intent.**
  - Every stored procedure and function must include a clear comment describing
    its purpose, arguments, return values, and any important side effects or
    context.
  - Comments should make it easy for future maintainers to understand the intent
    and context of each object, especially for complex flows or business logic.

## Test Organization

- Write flow-based tests for stored procedures and user flows, not just for
  individual tables or columns.
- Cover edge cases and error handling in the context of real flows.
- Use clear, descriptive names for tables, types, and functions, prefixed by
  domain (e.g., `public.create_exercise`).

## Additional Guidelines

- Prefer enums and composite types for clarity and type safety.
- Use triggers for automatic metadata creation and data consistency.
- Write functions to encapsulate business logic and support testability.
- Keep migrations focused and concise; split by feature or flow if a file grows
  too large.
- Review and update migrations as needed before deployment to ensure the schema
  matches evolving requirements.
- For stored procedures, arguments should be prepended with a `p_`

## Example

- Instead of testing a single insert, test the full flow (e.g., creating a block
  or superblock) to ensure all related rows are created and linked as expected.

## Tools

- Use PostgreSQL for schema and logic.
- Use PGTap for unit testing database logic.
- Migration files are the source of truth and are edited directly until
  deployment.
- **Create new migrations using:**
  - `pnpm run db:new-migration {migration name}`
- **Create new migration tests using:**
  - `pnpm run db:new-test`
