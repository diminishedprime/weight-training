-- ========================================================================== --
--
-- Migration: 00000000000110_form-drafts.sql
--
-- Purpose: Form draft storage for temporary user input persistence across sessions.
--
-- See: DATABASE_STRATEGY.md and DATABASE_DOCUMENTATION_STRATEGY.md for
--      philosophy and standards.
--
-- ========================================================================== --
-- Note: Using string type for form_type instead of enum to allow full file paths
--       for maximum uniqueness and flexibility. The full path ensures we can
--       distinguish between different forms even if they have similar names.
-- Table: form_drafts
--
-- Purpose: Stores temporary form state for users to persist input across sessions,
--          page refreshes, and browser restarts. This is not user preferences but 
--          ephemeral form state that should be automatically cleaned up.
--
-- Why: Form state needs to persist to avoid losing user input during hydration
--      mismatches, browser refreshes, or navigation. This is different from user
--      preferences as it's temporary working state that should be cleared after
--      form submission or after a reasonable timeout period.
--
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   form_type (text): Identifier for the form type using full component path.
--   form_data (jsonb): The serialized form state data.
--   created_at (timestamptz): When this draft was created.
--   updated_at (timestamptz): When this draft was last updated.
--   expires_at (timestamptz): When this draft should be automatically cleaned up.
CREATE TABLE IF NOT EXISTS public.form_drafts (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  form_type text NOT NULL,
  form_data jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone ('utc', now()),
  expires_at timestamp with time zone NOT NULL DEFAULT timezone ('utc', now()) + INTERVAL '7 days',
  CONSTRAINT form_drafts_pkey PRIMARY KEY (id),
  CONSTRAINT form_drafts_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT form_drafts_user_form_unique UNIQUE (user_id, form_type)
);

-- Index: idx_form_drafts_user_form_type
--
-- Purpose: Supports efficient lookup of form drafts by user and form type.
--
-- Why: The most common query pattern is finding a specific form draft for a user,
--      which requires filtering by both user_id and form_type.
CREATE INDEX IF NOT EXISTS idx_form_drafts_user_form_type ON public.form_drafts (user_id, form_type);

-- Index: idx_form_drafts_expires_at
--
-- Purpose: Supports efficient cleanup of expired form drafts.
--
-- Why: Background cleanup processes need to efficiently find and remove expired drafts.
CREATE INDEX IF NOT EXISTS idx_form_drafts_expires_at ON public.form_drafts (expires_at);

-- Function: get_form_draft
--
-- Purpose: Retrieve a form draft for a specific user and form type.
--
-- Parameters:
--   p_user_id: The user's UUID
--   p_form_type: The form type identifier
--
-- Returns: The form_data jsonb or NULL if not found
CREATE OR REPLACE FUNCTION public.get_form_draft (p_user_id uuid, p_form_type text) RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT form_data
    INTO result
    FROM public.form_drafts
    WHERE user_id = p_user_id
      AND form_type = p_form_type
      AND expires_at > timezone('utc', now());
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: save_form_draft
--
-- Purpose: Save or update a form draft for a specific user and form type.
--
-- Parameters:
--   p_user_id: The user's UUID
--   p_form_type: The form type identifier
--   p_form_data: The form state data as jsonb
--   p_ttl_days: Time to live in days (default 7)
CREATE OR REPLACE FUNCTION public.save_form_draft (
  p_user_id uuid,
  p_form_type text,
  p_form_data jsonb,
  p_ttl_days integer DEFAULT 7
) RETURNS void AS $$
BEGIN
  INSERT INTO public.form_drafts (user_id, form_type, form_data, expires_at)
    VALUES (
      p_user_id, 
      p_form_type, 
      p_form_data, 
      timezone('utc', now()) + (p_ttl_days || ' days')::interval
    )
    ON CONFLICT (user_id, form_type) DO UPDATE
      SET form_data = EXCLUDED.form_data,
          updated_at = timezone('utc', now()),
          expires_at = timezone('utc', now()) + (p_ttl_days || ' days')::interval;
END;
$$ LANGUAGE plpgsql;

-- Function: clear_form_draft
--
-- Purpose: Remove a form draft after successful submission.
--
-- Parameters:
--   p_user_id: The user's UUID
--   p_form_type: The form type identifier
CREATE OR REPLACE FUNCTION public.clear_form_draft (p_user_id uuid, p_form_type text) RETURNS void AS $$
BEGIN
  DELETE FROM public.form_drafts
    WHERE user_id = p_user_id
      AND form_type = p_form_type;
END;
$$ LANGUAGE plpgsql;

-- Function: cleanup_expired_form_drafts
--
-- Purpose: Clean up expired form drafts (intended for scheduled execution).
--
-- Returns: Number of drafts deleted
CREATE OR REPLACE FUNCTION public.cleanup_expired_form_drafts () RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.form_drafts
    WHERE expires_at <= timezone('utc', now());
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
