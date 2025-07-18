-- ========================================================================== --
--
-- NOTE: This migration was originally copied from
--       https://authjs.dev/getting-started/adapters/supabase and adapted for
--       this project. See the Auth.js documentation for upstream changes or
--       updates.
--
-- Migration: 00000000000030_auth.sql
--
-- Purpose: All authentication-related tables and functions for user login,
--          session management, and third-party account linking.
--
-- Why: These tables and functions implement the standard Auth.js schema for
--      Supabase, providing a robust, well-tested foundation for authentication
--      flows. This approach ensures compatibility with Auth.js adapters,
--      simplifies integration, and leverages community best practices for
--      security and maintainability. All tables are namespaced under next_auth
--      to avoid conflicts and clarify their domain.
--
-- ========================================================================== --
-- Function: next_auth.get_deterministic_uuid
-- Purpose: Generate deterministic UUIDs for specific imported users when they sign up
-- This ensures imported exercise data gets properly linked to users when they authenticate
CREATE OR REPLACE FUNCTION next_auth.get_deterministic_uuid (email_address text) RETURNS uuid AS $$
BEGIN
  CASE email_address
    WHEN 'stephaniebpena@gmail.com' THEN 
      RETURN 'd6e4a8a4-a0c1-4760-9512-a569473fe162'::uuid;
    WHEN 'matthewjhamrick@gmail.com' THEN 
      RETURN '97097295-6eb1-4824-8bfa-8984cf9bea6b'::uuid;
    ELSE
      RAISE EXCEPTION 'get_deterministic_uuid should only be called with matt or stephs email.';
  END CASE;
END;
$$ LANGUAGE plpgsql;

--
-- Table: next_auth.users
--
-- Purpose: Stores user identities for authentication and profile information.
--
-- Why: Central user table required for all authentication flows. Email is
--      unique to prevent duplicate accounts. UUID primary key for global
--      uniqueness and compatibility with Supabase/Next.js conventions.
--      Uses deterministic UUID function via trigger to ensure imported users get correct IDs.
CREATE TABLE IF NOT EXISTS next_auth.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  name text, -- Optional display name
  email text, -- User's email address (unique)
  "emailVerified" timestamp with time zone, -- When the email was verified
  image text, -- Optional profile image URL
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT email_unique UNIQUE (email)
);

-- Trigger function to set deterministic UUID based on email
CREATE OR REPLACE FUNCTION next_auth.set_user_uuid () RETURNS TRIGGER AS $$
BEGIN
  -- Only set the UUID if it's the default value or null, and the email is Steph or Matt's
  IF NEW.email IN ('stephaniebpena@gmail.com', 'matthewjhamrick@gmail.com') THEN
    NEW.id := next_auth.get_deterministic_uuid(NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before insert
CREATE TRIGGER trg_set_user_uuid BEFORE INSERT ON next_auth.users FOR EACH ROW
EXECUTE FUNCTION next_auth.set_user_uuid ();

GRANT ALL ON TABLE next_auth.users TO postgres;

GRANT ALL ON TABLE next_auth.users TO service_role;

-- Function: next_auth.uid
-- Purpose: Returns the current user's UUID from the JWT claims, for use in RLS
--          (Row-Level Security) policies.
--
-- Why: Enables secure, user-specific access control in Supabase by extracting
--      the authenticated user's ID from the JWT. This is a standard pattern for
--      multi-tenant applications.
--
-- Implementation details:
--   - The function attempts to get the user's UUID from the JWT claim 'sub'
--     (subject).
--   - It first tries current_setting('request.jwt.claim.sub', true), which is
--     the direct claim.
--   - If that is missing or empty (nullif returns NULL for empty string), it
--     falls back to current_setting('request.jwt.claims', true), which is the
--     full JWT claims object as a string.
--   - ::jsonb ->> 'sub' casts the string to JSONB and extracts the 'sub' field
--     as text.
--   - coalesce returns the first non-null value from these two attempts.
--   - The result is cast to uuid.
--   - This chain ensures compatibility with different Supabase/JWT
--     configurations and always returns the user's id if present.
--   - current_setting is a PostgreSQL function that retrieves the value of a
--     configuration parameter for the current session. Supabase injects JWT
--     claims into these settings for each request, making them accessible to
--     database functions and policies. The second argument (true) means 'return
--     NULL if the setting does not exist' instead of throwing an error.
CREATE FUNCTION next_auth.uid () RETURNS uuid LANGUAGE sql STABLE AS $$
  select
    coalesce(
      nullif(current_setting('request.jwt.claim.sub', true), ''), -- Direct claim, or NULL if empty
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub') -- Fallback: parse 'sub' from claims JSON
    )::uuid
$$;

-- Table: next_auth.sessions
--
-- Purpose: Stores active user sessions for persistent login.
--
-- Why: Allows users to remain logged in across requests and devices. Each
--      session is linked to a user and has an expiration timestamp. Session
--      token is unique for security.
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  expires timestamp with time zone NOT NULL, -- Session expiration
  "sessionToken" text NOT NULL, -- Unique session token
  "userId" uuid, -- Foreign key to users
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessionToken_unique UNIQUE ("sessionToken"),
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.sessions TO postgres;

GRANT ALL ON TABLE next_auth.sessions TO service_role;

-- Table: next_auth.accounts
--
-- Purpose: Links users to third-party OAuth providers (Google, GitHub, etc.).
--
-- Why: Enables users to sign in with external accounts. Each account is unique
--      per provider and providerAccountId. Foreign key to users ensures
--      referential integrity.
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  type text NOT NULL, -- Account type (e.g., oauth)
  provider text NOT NULL, -- Provider name (e.g., google)
  "providerAccountId" text NOT NULL, -- Provider's user/account ID
  refresh_token text, -- OAuth refresh token
  access_token text, -- OAuth access token
  expires_at bigint, -- Token expiration
  token_type text, -- OAuth token type
  scope text, -- OAuth scopes
  id_token text, -- ID token
  session_state text, -- OAuth session state
  oauth_token_secret text, -- OAuth 1.0 secret
  oauth_token text, -- OAuth 1.0 token
  "userId" uuid, -- Foreign key to users
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT provider_unique UNIQUE (provider, "providerAccountId"),
  CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.accounts TO postgres;

GRANT ALL ON TABLE next_auth.accounts TO service_role;

-- Table: next_auth.verification_tokens
--
-- Purpose: Stores tokens for email verification and passwordless login flows.
--
-- Why: Enables secure, time-limited verification for user actions (e.g., email
--      sign-in, password reset). Unique constraints prevent token reuse and
--      ensure integrity.
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier text, -- Email or other identifier
  token text, -- Verification token
  expires timestamp with time zone NOT NULL, -- Expiration timestamp
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (token),
  CONSTRAINT token_unique UNIQUE (token),
  CONSTRAINT token_identifier_unique UNIQUE (token, identifier)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;

GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;
