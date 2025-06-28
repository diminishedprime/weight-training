-- ========================================================================== --
--
-- Migration: 20250603140001_schemas.sql
--
-- Purpose: Central place to declare and document all schemas in the database.
--          This file is the authoritative reference for what schemas exist and
--          why. Add new schemas here with clear, high-level documentation.
--          This migration must run before any migration that uses these
--          schemas.
--
-- Philosophy: Schemas are used to organize database objects by domain and
--             responsibility, supporting security, clarity, and
--             maintainability.  Each schema below includes a "Purpose" and
--             "Why" section to explain its role in the domain and the rationale
--             for its boundaries.
--
-- ========================================================================== --
--
-- Schema: public
--
-- Purpose: The default schema for most application tables, types, and
--          functions.
--
-- Why: Used for all user-facing and business logic objects unless otherwise
--      specified. This keeps the core domain model clear and accessible, and
--      aligns with PostgreSQL defaults for compatibility and tooling support.
CREATE SCHEMA IF NOT EXISTS public;

-- Schema: next_auth
--
-- Purpose: Contains all authentication-related tables and functions (users,
--          sessions, accounts, etc).
--
-- Why: Isolated for security and clarity. By separating authentication logic
--      from the main application schema, we reduce accidental coupling and make
--      it easier to reason about access control. This schema is only used for
--      auth logic and RLS helpers, and is never referenced by business logic
--      outside of authentication flows. This separation also makes it easier to
--      upgrade or swap out authentication mechanisms in the future.
CREATE SCHEMA IF NOT EXISTS next_auth;

GRANT USAGE ON SCHEMA next_auth TO service_role;

GRANT ALL ON SCHEMA next_auth TO postgres;

-- Schema: _trigger
--
-- Purpose: Internal-only schema for trigger helper functions and other code
--          that should never be called directly by application code.
--
-- Why: This schema is reserved for functions and objects that are only meant to
--      be invoked by triggers or other internal flows, never directly by
--      application queries. By putting _trigger stuff in its own schema, we can
--      also make the functions, etc. that are only to be used by the database
--      not show up in the generated types, which allow you to explicitly say
--      which schemas it should generate types for. 
CREATE SCHEMA IF NOT EXISTS _trigger;

GRANT USAGE ON SCHEMA _trigger TO service_role;

GRANT USAGE ON SCHEMA _trigger TO anon;

GRANT USAGE ON SCHEMA _trigger TO authenticated;
