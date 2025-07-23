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
-- Why: Needed for next_auth (obvi)
CREATE SCHEMA IF NOT EXISTS next_auth;

GRANT USAGE ON SCHEMA next_auth TO service_role;

GRANT ALL ON SCHEMA next_auth TO postgres;

-- Schema: _trigger
--
-- Purpose: Internal-only schema for trigger helper functions.
--
-- Why: This schema is reserved for functions and objects that are only meant to
--      be invoked by triggers, never directly by application queries. By
--      putting _trigger stuff in its own schema, we can also make the
--      functions, etc. that are only to be used by the database not show up in
--      the generated types, which allow you to explicitly say which schemas it
--      should generate types for. See supabase/config.toml
CREATE SCHEMA IF NOT EXISTS _trigger;

GRANT USAGE ON SCHEMA _trigger TO service_role;

GRANT USAGE ON SCHEMA _trigger TO anon;

GRANT USAGE ON SCHEMA _trigger TO authenticated;

-- Schema: _impl
--
-- Purpose: Internal-only schema for implementation helper functions.
--
-- Why: This schema is reserved for functions and objects that are only meant to
--      be invoked by internal flows, never directly by application queries. By
--      putting _impl stuff in its own schema, we can also make the functions,
--      etc. that are only to be used by the database not show up in the
--      generated types, which allow you to explicitly say which schemas it
--      should generate types for. See supabase/config.toml
CREATE SCHEMA IF NOT EXISTS _impl;

GRANT USAGE ON SCHEMA _impl TO service_role;

GRANT USAGE ON SCHEMA _impl TO anon;

GRANT USAGE ON SCHEMA _impl TO authenticated;

CREATE SCHEMA IF NOT EXISTS _system;

GRANT USAGE ON SCHEMA _system TO service_role;

GRANT USAGE ON SCHEMA _system TO anon;

GRANT USAGE ON SCHEMA _system TO authenticated;
