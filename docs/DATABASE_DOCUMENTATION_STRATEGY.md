# DATABASE_DOCUMENTATION_STRATEGY.md

## Database Documentation Strategy

This document outlines the standards and philosophy for documenting the database
schema, migrations, and business logic in this project. Our approach is designed
to maximize maintainability, clarity, and domain understanding for all
contributors—now and in the future.

### 1. Philosophy

- **Domain-Driven:** Documentation should reflect real-world fitness concepts
  and the reasoning behind schema design.
- **Composability & Testability:** All documentation should make it clear how
  tables, types, and functions can be composed and tested.
- **Rationale, Not Just Description:** We document not only what each
  table/function does, but also why it exists and why it is designed the way it
  is.

### 2. Structure of Documentation

For every table, type, enum, and function in a migration or schema file,
documentation must include:

- **Purpose:** What this object represents or accomplishes in the domain.
- **Why:** The rationale for its existence and design. This should answer:
  - Why is this abstraction needed?
  - Why is it structured this way (e.g., why a join table, why two abstraction
    levels, why not arbitrary nesting)?
  - What trade-offs or real-world requirements does it address?
- **Columns/Arguments:** For tables and functions, a list of columns/arguments
  with types and a brief description.

### 3. Formatting Conventions

- Use clear, sectioned comments above each object:
  ```sql
  -- Table: exercise_block
  --
  -- Purpose: Represents a block of exercises (e.g., a set of sets/reps for a user).
  --
  -- Why: The exercise_block table is the core unit for tracking a group of
  --      identical exercises performed together—such as "5 sets of 5 squats".
  --      Each block contains only one exercise type, which simplifies analytics,
  --      program design, and UI. ...
  --
  -- Columns:
  --   id (uuid): Primary key.
  --   ...
  ```
- For functions, include argument and return value documentation, and always
  explain the business logic rationale.
- Use consistent indentation and line breaks for readability.

### 4. The "Why" Section

- The "Why" section is required for every table, join table, and function.
- It must go beyond describing what the object does, and instead explain the
  reasoning, trade-offs, and domain context that led to its design.
- If a design decision might not seem obvious, or if there are alternative
  approaches that were considered and rejected, document why those alternatives
  were not chosen. This helps future maintainers understand not just what we
  did, but why we didn't do it another way.
- Examples:
  - Why do we use exactly two abstraction levels (block and superblock) instead
    of arbitrary nesting?
  - Why do we use a classic junction table for block-exercise and
    superblock-block relationships?
  - Why do we avoid "jagged" blocks?

### 5. Example

```sql
-- Table: exercise_superblock_blocks (join table)
--
-- Purpose: Many-to-many join between exercise_superblock and exercise_block.
--
-- Why: The exercise_superblock_blocks table is a classic junction (join) table
--      that enables each superblock (e.g., a workout template or training day)
--      to contain an ordered sequence of blocks. This design is necessary
--      because a superblock is composed of a sequence of blocks (e.g., "Push
--      Day" is a sequence of "Wendler Bench Press 3x5", ...), and we need to
--      preserve both the association and the order of those blocks within the
--      superblock. ...
--
-- Columns:
--   superblock_id (uuid): FK to exercise_superblock(id).
--   block_id (uuid): FK to exercise_block(id).
--   superblock_order (integer): Order of block within the superblock.
```

### 6. General Guidelines

- All migrations and schema files must be self-documenting and understandable
  without external context.
- When in doubt, err on the side of over-explaining the rationale.
- Update documentation as the schema evolves, especially when design decisions
  change.
- Use the same standards for documenting enums, composite types, and triggers.

### 7. Review and Enforcement

- PRs that add or modify database objects must include updated documentation
  following this strategy.
- Code review should check for both completeness and clarity of the "Why"
  section.

---

By following this strategy, we ensure that our database is not only robust and
maintainable, but also transparent and easy to reason about for all
contributors.
