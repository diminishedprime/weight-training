---
mode: agent
---

# Database Documentation Prompt

You are tasked with documenting database schema, migrations, and business logic
for this project. Follow these standards to ensure clarity, maintainability, and
domain understanding:

## Philosophy

- Documentation must be domain-driven, reflecting real-world fitness concepts
  and the reasoning behind schema design.
- Always include not just what each table, type, enum, or function does, but
  also why it exists and why it is designed that way.
- Documentation should make composability and testability clear.

## Structure for Each Object

For every table, type, enum, and function, include:

- **Purpose:** What this object represents or accomplishes in the domain.
- **Why:** The rationale for its existence and design. This should answer:
  - Why is this abstraction needed?
  - Why is it structured this way (e.g., why a join table, why two abstraction
    levels, why not arbitrary nesting)?
  - What trade-offs or real-world requirements does it address?
  - If a design decision might not seem obvious, or if there are alternative
    approaches that were considered and rejected, document why those
    alternatives were not chosen.
- **Columns/Arguments:** For tables and functions, a list of columns/arguments
  with types and a brief description.

## Formatting Conventions

- Use clear, sectioned comments above each object, for example:
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

## The "Why" Section

- The "Why" section is required for every table, join table, and function.
- It must go beyond describing what the object does, and instead explain the
  reasoning, trade-offs, and domain context that led to its design.
- If a design decision might not seem obvious, or if there are alternative
  approaches that were considered and rejected, document why those alternatives
  were not chosen.

## General Guidelines

- All migrations and schema files must be self-documenting and understandable
  without external context.
- When in doubt, err on the side of over-explaining the rationale.
- Update documentation as the schema evolves, especially when design decisions
  change.
- Use the same standards for documenting enums, composite types, and triggers.

## Review and Enforcement

- PRs that add or modify database objects must include updated documentation
  following this strategy.
- Code review should check for both completeness and clarity of the "Why"
  section.

By following these instructions, you will produce database documentation that is
robust, maintainable, and easy to reason about for all contributors.
