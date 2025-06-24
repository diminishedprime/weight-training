# Database Strategy

## Overview

Our database strategy is designed to support a robust, testable, and evolvable
fitness application schema. The approach prioritizes clear domain modeling,
composability, and maintainability, with a focus on supporting real user flows.
Since migrations have not yet been deployed, we optimize for clarity and
correctness over backwards compatibility at this stage.

## Key Principles

- **Domain-Driven Schema:**

  - Tables and types are modeled to reflect real-world fitness concepts (users,
    exercises, weights, blocks, superblocks, etc.).
  - Use of enums for domain-specific values (e.g., `exercise_type_enum`,
    `weight_unit_enum`, `completion_status_enum`) to ensure data integrity and
    enable type-safe queries.

- **Composability and Reuse:**

  - Many-to-many relationships (e.g., blocks to exercises, superblocks to
    blocks) are modeled with join tables, enabling flexible workout structures.
  - Stored procedures are used for complex flows (e.g., creating a Wendler
    block, adding a leg day superblock) to encapsulate business logic and reduce
    duplication.

- **Testability:**

  - All stored procedures and functions are written to be testable, and we write
    tests for them to ensure correctness and prevent regressions.
  - Functions are deterministic where possible (e.g., `IMMUTABLE` for pure
    functions like rounding/normalization).

- **Well-Commented Code:**

  - All database objects (tables, types, functions, triggers, etc.) should be
    well-commented.
  - Every stored procedure and function must include a clear comment describing
    its purpose and intended use, including any important details about
    arguments, return values, and side effects.
  - Comments should make it easy for future maintainers to understand the intent
    and context of each object, especially for complex flows or business logic.

- **Minimal Mocks, Real Data:**

  - We avoid using mocks in database tests except for external dependencies.
    Internal logic is tested with real data to ensure realistic coverage.

- **User-Centric Data:**

  - All user data is namespaced by user ID, and foreign keys are used to enforce
    referential integrity.
  - User preferences and metadata are stored in dedicated tables, with triggers
    to ensure metadata is created for each user.

- **Evolvability:**

  - Since migrations are not yet deployed, we edit them directly for clarity and
    correctness, without worrying about backwards compatibility.
  - Enums and types are created with `IF NOT EXISTS` to allow for safe re-runs
    during development.

- **Security and Access Control:**

  - Row-level security (RLS) is supported via helper functions (e.g.,
    `next_auth.uid()`), and all user data is protected by foreign key
    constraints.

## Test Organization

- **Flow-Based Tests:**

  - Tests are written for stored procedures and user flows, not just for
    individual tables or columns.
  - Edge cases and error handling are covered in the context of real flows
    (e.g., creating a superblock, updating user maxes).

- **Naming Conventions:**
  - Tables, types, and functions use clear, descriptive names reflecting their
    domain purpose.
  - Functions are prefixed with their domain (e.g., `public.create_exercise`,
    `public.get_superblocks_for_user`).

## Test Data and Setup

- All tests are wrapped in transactions and rolled back automatically, so you do
  not need to manually clean up data in test files.
- Use `seed.sql` to provide any required setup or test data for your database
  tests. Only add setup directly in a test file if it is not covered by the seed
  data and can't easly be added into the seed data.
- This ensures tests are isolated, repeatable, and easy to maintain.

## Example

Instead of testing a single insert into the `exercises` table, we test the full
flow of creating a block or superblock, ensuring all related rows are created
and linked as expected.

## Tools

- **PostgreSQL** for schema and logic.
- **PGTap** for unit testing our database.
- **Migration files** are the source of truth and are edited directly until
  deployment.

## Additional Guidelines

- Prefer using enums and composite types for clarity and type safety.
- Use triggers for automatic metadata creation and data consistency.
- Write functions to encapsulate business logic and support testability.
- Keep migrations focused and concise; split by feature or flow if a file grows
  too large.
- Review and update migrations as needed before deployment to ensure the schema
  matches evolving requirements.
- For stored procedures, arguments should be prepended with a `p_`
- **All migrations and database code should be well-commented, especially stored
  procedures, with clear explanations of their use and intent.**

## Creating a New Migration Test

To create a new migration test file using the Supabase CLI, use the following
script:

```bash
pnpm run db:new-test
```

This will run `supabase db new` to scaffold a new migration or migration test.
Name your migration or test file appropriately and follow the standards outlined
in this document for structure, documentation, and test coverage.
