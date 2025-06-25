-- Migration: 20250603140001_schemas.sql
-- Purpose: Central place to declare and document all schemas in the database.
--          This file should be the go-to reference for what schemas exist and
--          why. Add new schemas here with clear, high-level documentation.
--          This migration should run before any migration that uses these
--          schemas.
-- Schema: public
--   Purpose: The default schema for most application tables, types, and
--            functions.
-- 
--            Used for all user-facing and business logic objects unless
--            otherwise specified.
CREATE SCHEMA IF NOT EXISTS public;

-- Schema: next_auth
--   Purpose: Contains all authentication-related tables and functions (users,
--            sessions, accounts, etc).
-- 
--            Isolated for security and clarity. Used only for auth logic and
--            RLS helpers.
CREATE SCHEMA IF NOT EXISTS next_auth;

GRANT USAGE ON SCHEMA next_auth TO service_role;

GRANT ALL ON SCHEMA next_auth TO postgres;

-- Schema: _trigger
--   Purpose: Internal-only schema for trigger helper functions and other code
--            that should never be called directly by application code.
-- 
--            Use this for any function that is only meant to be invoked by
--            triggers or other internal flows.
CREATE SCHEMA IF NOT EXISTS _trigger;

GRANT USAGE ON SCHEMA _trigger TO service_role;

GRANT USAGE ON SCHEMA _trigger TO anon;

GRANT USAGE ON SCHEMA _trigger TO authenticated;

--   You may add other internal schemas here as needed in the future.