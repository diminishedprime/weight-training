-- TODO - I think I may actually want the target_max to be in metadata or
--        something in the wendler metadata tables. target_max is actually
--        something specific to a wendler block, not anything else.
--
-- TODO - Additionally, I think that one_rep_max is actually something that
--        belongs joined via a an exercise_user junction table, probably
--        supporting history as well, but it probably can just go in the
--        exercises.sql file instead of this special one.
--
-- ========================================================================== --
--
-- Migration: 00000000000070_user-metadata.sql
--
-- Purpose: Defines tables, types, enums, functions, and triggers for
--          user-specific metadata, exercise weights, one-rep max history, and
--          related business logic.
--
-- Strategy: Domain-driven, composable, and testable schema for user preferences,
--           progress tracking, and auditability in fitness applications.
--
-- See: DATABASE_STRATEGY.md and DATABASE_DOCUMENTATION_STRATEGY.md for
--      philosophy and standards.
--
-- ========================================================================== --
--
-- Table: user_metadata
--
-- Purpose: Stores per-user preferences and settings, such as preferred weight unit.
--
-- Why: User-specific settings are separated from authentication/user identity
--      to allow for extensibility and to avoid coupling domain preferences to
--      auth logic. This enables composability (e.g., adding more preferences in
--      the future) and supports domain-driven design by keeping user settings
--      in a dedicated table. The unique constraint on user_id ensures one
--      settings row per user.
--
-- Columns:
--   id (uuid): Primary key for the metadata record.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   preferred_weight_unit (weight_unit_enum): User's preferred weight unit.
--   created_at, updated_at (timestamptz): Timestamps for record tracking.
--
CREATE TABLE IF NOT EXISTS public.user_metadata (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  preferred_weight_unit weight_unit_enum DEFAULT 'pounds',
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT user_metadata_pkey PRIMARY KEY (id),
  CONSTRAINT user_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_metadata_user_unique UNIQUE (user_id)
);

-- Table: user_exercise_weights
--
-- Purpose: Stores per-user, per-exercise canonical one-rep max (1RM), target
--          max weights, and default rest time.
--
-- Why: This table denormalizes the latest 1RM and target max for each
--      user/exercise for fast lookup in the application, while the true source
--      of 1RM history is tracked in user_one_rep_max_history. This design
--      allows for efficient queries and UI rendering, while still supporting a
--      full audit/history trail. The unique constraint ensures only one row per
--      user/exercise combination. Default rest time is included to support
--      user-specific training preferences.
--
-- Columns:
--   id (uuid): Primary key for the record.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   exercise_type (exercise_type_enum): The exercise type.
--   one_rep_max_value (numeric, nullable): 1RM value.
--   one_rep_max_unit (weight_unit_enum, nullable): 1RM unit.
--   target_max_value (numeric, nullable): Target max value.
--   target_max_unit (weight_unit_enum, nullable): Target max unit.
--   default_rest_time_seconds (integer): Default rest time in seconds for this exercise (default 120).
--   created_at (timestamptz): Timestamp for record creation.
--
CREATE TABLE IF NOT EXISTS public.user_exercise_weights (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  one_rep_max_value numeric NULL,
  one_rep_max_unit weight_unit_enum NULL,
  target_max_value numeric NULL,
  target_max_unit weight_unit_enum NULL,
  default_rest_time_seconds integer DEFAULT 120,
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT user_exercise_weights_pkey PRIMARY KEY (id),
  CONSTRAINT user_exercise_weights_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_exercise_weights_unique UNIQUE (user_id, exercise_type)
);

-- Type: user_preferences_row
--
-- Purpose: Composite type for get_user_preferences return value, with nullable
--          max fields for flexibility.
--
-- Why: This type is used to return a single row per exercise for a user,
--      including both canonical and most recent 1RM/target max values,
--      supporting flexible UI and analytics. Nullable fields allow for cases
--      where a user has not set a max yet. This type is only used for function
--      return values, not for storage.
--
-- Columns:
--   preferred_weight_unit (weight_unit_enum): User's preferred weight unit.
--   exercise_type (exercise_type_enum): The exercise type.
--   one_rep_max_value (numeric, nullable): 1RM value, or NULL if not set.
--   one_rep_max_unit (weight_unit_enum, nullable): 1RM unit, or NULL if not set.
--   target_max_value (numeric, nullable): Target max value, or NULL if not set.
--   target_max_unit (weight_unit_enum, nullable): Target max unit, or NULL if not set.
--   default_rest_time_seconds (integer): Default rest time in seconds.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_preferences_row') THEN
    CREATE TYPE user_preferences_row AS (
      preferred_weight_unit weight_unit_enum,
      exercise_type exercise_type_enum,
      one_rep_max_value numeric,
      one_rep_max_unit weight_unit_enum,
      target_max_value numeric,
      target_max_unit weight_unit_enum,
      default_rest_time_seconds integer
    );
  END IF;
END$$;

-- Enum: user_one_rep_max_source_enum
--
-- Purpose: Enumerates the source of a 1RM entry (manual, competition, auto,
--          imported, other).
--
-- Why: Tracking the source of a 1RM value is important for auditability and
--      domain understanding (e.g., distinguishing between a competition PR and
--      an auto-calculated value). Using an enum ensures only valid, known
--      sources are used, supporting composability and future extensibility.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_one_rep_max_source_enum') THEN
    CREATE TYPE public.user_one_rep_max_source_enum AS ENUM (
      'manual',
      'competition',
      'auto',
      'imported',
      'other'
    );
  END IF;
END$$;

-- Table: user_one_rep_max_history
--
-- Purpose: Tracks all historical 1RM values for each user/exercise, including
--          source and notes.
--
-- Why: This table provides a full audit trail of 1RM changes, supporting
--      analytics, undo/history, and compliance with domain requirements for
--      tracking progress over time. The canonical 1RM is denormalized in
--      user_exercise_weights for fast lookup, but the history table is the
--      source of truth. Notes and source fields support richer domain modeling
--      (e.g., distinguishing between a PR in competition vs. training).
--
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   exercise_type (exercise_type_enum): The exercise type.
--   weight_value (numeric): The 1RM value.
--   weight_unit (weight_unit_enum): The 1RM unit.
--   recorded_at (timestamptz): When this 1RM was set.
--   source (user_one_rep_max_source_enum): Source of the entry.
--   notes (text): Optional user notes.
CREATE TABLE IF NOT EXISTS public.user_one_rep_max_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  weight_value numeric NOT NULL,
  weight_unit weight_unit_enum NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT timezone ('utc', now()),
  source user_one_rep_max_source_enum NOT NULL DEFAULT 'manual',
  notes text,
  CONSTRAINT user_one_rep_max_history_pkey PRIMARY KEY (id),
  CONSTRAINT user_one_rep_max_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Table: target_max_history
--
-- Purpose: Tracks all target max values for each user/exercise.
--
-- Why: This table provides a full audit trail of Wendler target max changes,
--      supporting analytics, undo/history, and compliance with domain
--      requirements for tracking progress over time. It is a junction/history
--      table for user/exercise/target max.
--
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   exercise_type (exercise_type_enum): The exercise type.
--   value (numeric): The Wendler target max value.
--   unit (weight_unit_enum): The Wendler target max unit.
--   recorded_at (timestamptz): When this target max was set.
CREATE TABLE IF NOT EXISTS public.target_max_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  value numeric NOT NULL,
  unit weight_unit_enum NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT timezone ('utc', now()),
  CONSTRAINT target_max_history_pkey PRIMARY KEY (id),
  CONSTRAINT target_max_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Index: idx_target_max_history_user_exercise_recorded_at
--
-- Purpose: Supports efficient lookup of the most recent target max for a user/exercise.
--
-- Why: The get_target_max function queries by user_id and exercise_type,
--      ordering by recorded_at DESC. This index optimizes that access pattern
--      for analytics, UI, and business logic.
CREATE INDEX IF NOT EXISTS idx_target_max_history_user_exercise_recorded_at ON public.target_max_history (user_id, exercise_type, recorded_at DESC, id DESC);

-- Function: set_target_max
--
-- Purpose: Inserts a new Wendler target max history row for a user/exercise.
--
-- Why: This function provides a single, auditable way to record a new Wendler
--      target max value for a user/exercise, supporting analytics,
--      undo/history, and compliance with domain requirements. It does not
--      update the canonical value in user_exercise_weights; use
--      update_user_target_max for that purpose.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_value (numeric): The Wendler target max value.
--   p_unit (weight_unit_enum): The Wendler target max unit.
--   p_recorded_at (timestamptz, optional): Optional override for timestamp.
CREATE OR REPLACE FUNCTION public.set_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_value numeric,
  p_unit weight_unit_enum,
  p_recorded_at timestamptz DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_now timestamptz;
BEGIN
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));
  INSERT INTO public.target_max_history (
    user_id, exercise_type, value, unit, recorded_at
  ) VALUES (
    p_user_id, p_exercise_type, p_value, p_unit, v_now
  );
END;
$$ LANGUAGE plpgsql;

-- Function: public.get_target_max
--
-- Purpose: Returns the most recent Wendler target max value, unit, and
--          timestamp for a user/exercise.
--
-- Why: This function provides a single, type-safe way to retrieve the latest
--      Wendler target max for analytics, UI, and business logic. It queries the
--      target_max_history table, returning the most recent entry by
--      recorded_at.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--
-- Returns: TABLE (value numeric, unit weight_unit_enum, recorded_at timestamptz)
CREATE OR REPLACE FUNCTION public.get_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS TABLE (
  value numeric,
  unit weight_unit_enum,
  recorded_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
    SELECT h.value, h.unit, h.recorded_at
      FROM public.target_max_history h
     WHERE h.user_id = p_user_id
       AND h.exercise_type = p_exercise_type
     ORDER BY h.recorded_at DESC, h.id DESC
     LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger: create_user_metadata_on_user_insert
--
-- Purpose: Automatically creates a user_metadata row and user_exercise_weights
--          rows for all exercise types when a new user is inserted.
--
-- Why: This trigger ensures that every new user has a complete set of metadata
--      and exercise weight rows, supporting a consistent domain model and
--      simplifying downstream logic (e.g., no need to check for missing rows in
--      application code). This design supports composability and testability by
--      guaranteeing initial state for all users.
CREATE OR REPLACE FUNCTION public.create_user_metadata_on_user_insert () RETURNS TRIGGER AS $$
DECLARE
  exercise_type_val exercise_type_enum;
BEGIN
  INSERT INTO public.user_metadata (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  FOR exercise_type_val IN SELECT unnest(enum_range(NULL::exercise_type_enum)) LOOP
    INSERT INTO public.user_exercise_weights (user_id, exercise_type)
    VALUES (NEW.id, exercise_type_val)
    ON CONFLICT (user_id, exercise_type) DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_create_user_metadata ON next_auth.users;

CREATE TRIGGER trg_create_user_metadata
AFTER INSERT ON next_auth.users FOR EACH ROW
EXECUTE FUNCTION public.create_user_metadata_on_user_insert ();

-- Function: update_user_one_rep_max
--
-- Purpose: Sets or updates the user's one-rep max for a given exercise, always
--          logging to history.
--
-- Why: This function ensures that every change to a user's 1RM is logged in
--      history, supporting auditability and analytics. The canonical value in
--      user_exercise_weights is always synced via triggers, so this function
--      only needs to insert into history. This separation of concerns supports
--      composability and testability.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The weight value.
--   p_weight_unit (weight_unit_enum): The weight unit.
--   p_source (user_one_rep_max_source_enum): Source of the entry.
--   p_notes (text): Optional notes.
--   p_recorded_at (timestamptz): Optional override for timestamp.
CREATE OR REPLACE FUNCTION public.update_user_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_source user_one_rep_max_source_enum DEFAULT 'manual',
  p_notes text DEFAULT NULL,
  p_recorded_at timestamptz DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_now timestamptz;
BEGIN
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));

  -- Insert into history
  INSERT INTO public.user_one_rep_max_history (
    user_id, exercise_type, weight_value, weight_unit, recorded_at, source, notes
  ) VALUES (
    p_user_id, p_exercise_type, p_weight_value, p_weight_unit, v_now, p_source, p_notes
  );
  -- No need to update canonical value directly; triggers on history will sync it.
END;
$$ LANGUAGE plpgsql;

-- Function: update_user_target_max
--
-- Purpose: Sets or updates the user's target max for a given exercise.
--
-- Why: Target max is a user-specific goal distinct from 1RM, and is stored
--      separately for analytics and UI. This function ensures a single
--      canonical row per user/exercise, supporting composability and fast
--      lookup. The use of ON CONFLICT ensures idempotency and simplifies
--      application logic.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The weight value.
--   p_weight_unit (weight_unit_enum): The weight unit.
CREATE OR REPLACE FUNCTION public.update_user_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_exercise_weights (user_id, exercise_type, target_max_value, target_max_unit)
    VALUES (p_user_id, p_exercise_type, p_weight_value, p_weight_unit)
    ON CONFLICT (user_id, exercise_type) DO UPDATE
      SET target_max_value = EXCLUDED.target_max_value,
          target_max_unit = EXCLUDED.target_max_unit;
END;
$$ LANGUAGE plpgsql;

-- Function: update_user_default_rest_time
--
-- Purpose: Sets or updates the user's default rest time for a given exercise.
--
-- Why: Rest time is a key training parameter, and storing it per user/exercise
--      supports personalized programming. This function ensures a single
--      canonical row per user/exercise, supporting composability and fast
--      lookup. The use of ON CONFLICT ensures idempotency and simplifies
--      application logic.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_default_rest_time_seconds (integer): The new default rest time in seconds.
CREATE OR REPLACE FUNCTION public.update_user_default_rest_time (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_default_rest_time_seconds integer
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_exercise_weights (user_id, exercise_type, default_rest_time_seconds)
    VALUES (p_user_id, p_exercise_type, p_default_rest_time_seconds)
    ON CONFLICT (user_id, exercise_type) DO UPDATE
      SET default_rest_time_seconds = EXCLUDED.default_rest_time_seconds;
END;
$$ LANGUAGE plpgsql;

-- Function: update_user_one_rep_max_and_log
--
-- Purpose: Sets/updates the user's canonical 1RM and logs the change in history.
--
-- Why: This function always logs to history and relies on triggers to sync the
--      canonical value, supporting auditability and separation of concerns.
--      This design supports composability and testability by decoupling history
--      from canonical value updates.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The weight value.
--   p_weight_unit (weight_unit_enum): The weight unit.
--   p_source (user_one_rep_max_source_enum): Source of the entry.
--   p_notes (text): Optional notes.
--   p_recorded_at (timestamptz): Optional override for timestamp.
CREATE OR REPLACE FUNCTION public.update_user_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_source user_one_rep_max_source_enum DEFAULT 'manual',
  p_notes text DEFAULT NULL,
  p_recorded_at timestamptz DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_now timestamptz;
BEGIN
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));

  INSERT INTO public.user_one_rep_max_history (
    user_id, exercise_type, weight_value, weight_unit, recorded_at, source, notes
  ) VALUES (
    p_user_id, p_exercise_type, p_weight_value, p_weight_unit, v_now, p_source, p_notes
  );
END;
$$ LANGUAGE plpgsql;

-- Function: get_user_one_rep_max_history
--
-- Purpose: Returns all 1RM history for a user/exercise, most recent first.
--
-- Why: This function provides a full audit trail for a user's 1RM progress,
--      supporting analytics and UI. It returns value/unit directly, supporting composability and type safety in the application layer.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
-- Returns: Table of history rows (id, user_id, exercise_type, weight_value, weight_unit, recorded_at, source, notes).
CREATE OR REPLACE FUNCTION public.get_user_one_rep_max_history (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS TABLE (
  id uuid,
  user_id uuid,
  exercise_type exercise_type_enum,
  weight_value numeric,
  weight_unit weight_unit_enum,
  recorded_at timestamptz,
  source user_one_rep_max_source_enum,
  notes text
) AS $$
BEGIN
  RETURN QUERY
    SELECT h.id, h.user_id, h.exercise_type, h.weight_value, h.weight_unit, h.recorded_at, h.source, h.notes
    FROM public.user_one_rep_max_history h
    WHERE h.user_id = p_user_id AND h.exercise_type = p_exercise_type
    ORDER BY h.recorded_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: edit_user_one_rep_max_history
--
-- Purpose: Edits a 1RM history row (weight, timestamp, notes, source) for a
--          user.
--
-- Why: This function allows users to correct mistakes or update metadata for a
--      1RM entry, supporting auditability and user control. The function
--      enforces that only the owner can edit their history row, supporting
--      security and testability.
--
-- Arguments:
--   p_history_id (uuid): The history row id.
--   p_user_id (uuid): The user id (for RLS).
--   p_weight_value (numeric): New weight value.
--   p_weight_unit (weight_unit_enum): New weight unit.
--   p_recorded_at (timestamptz): New timestamp.
--   p_source (user_one_rep_max_source_enum): New source.
--   p_notes (text): New notes.
-- Usage: Updates the specified row if it belongs to the user.
CREATE OR REPLACE FUNCTION public.edit_user_one_rep_max_history (
  p_history_id uuid,
  p_user_id uuid,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_recorded_at timestamptz,
  p_source user_one_rep_max_source_enum,
  p_notes text
) RETURNS void AS $$
BEGIN
  UPDATE public.user_one_rep_max_history
    SET weight_value = p_weight_value,
        weight_unit = p_weight_unit,
        recorded_at = p_recorded_at,
        source = p_source,
        notes = p_notes
    WHERE id = p_history_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function: get_user_preferences
--
-- Purpose: Returns user preferences and maxes for all exercises, using most
--          recent 1RM from history if present, else falling back to canonical
--          value.
--
-- Why: This function provides a single query to retrieve all relevant user
--      settings and maxes for UI and analytics, supporting composability and
--      type safety. The use of COALESCE and left joins ensures that missing
--      data is handled gracefully, and the function is robust to partial data.
--
-- Arguments:
--   p_user_id (uuid): The user id.
-- Returns: Table of user preferences and maxes (user_preferences_row).
-- Usage: Uses most recent 1RM from history if present, else falls back to user_exercise_weights.
CREATE OR REPLACE FUNCTION public.get_user_preferences (p_user_id uuid) RETURNS SETOF user_preferences_row language sql as $$
  with latest_1rm as (
    select distinct on (h.exercise_type)
      h.exercise_type,
      h.weight_value as one_rep_max_value,
      h.weight_unit as one_rep_max_unit,
      h.recorded_at
    from user_one_rep_max_history h
    where h.user_id = p_user_id
    order by h.exercise_type, h.recorded_at desc
  )
  select 
    um.preferred_weight_unit,
    uew.exercise_type,
    coalesce(l1rm.one_rep_max_value, uew.one_rep_max_value) as one_rep_max_value,
    coalesce(l1rm.one_rep_max_unit, uew.one_rep_max_unit) as one_rep_max_unit,
    uew.target_max_value,
    uew.target_max_unit,
    uew.default_rest_time_seconds
  from user_metadata um
  left join user_exercise_weights uew on uew.user_id = um.user_id
  left join latest_1rm l1rm on l1rm.exercise_type = uew.exercise_type
  where um.user_id = p_user_id;
$$;

-- Function: _trigger.sync_user_exercise_weights_one_rep_max
--
-- Purpose: Ensures the canonical one_rep_max_weight_id in user_exercise_weights
--          always matches the latest entry in user_one_rep_max_history for a
--          given user/exercise.
--
-- Why: The canonical 1RM (one_rep_max_weight_id) is denormalized for fast
--      lookup, but the true source of 1RM history is user_one_rep_max_history.
--      This function is called by triggers after any INSERT, UPDATE, or DELETE
--      on user_one_rep_max_history to ensure that
--      user_exercise_weights.one_rep_max_weight_id always reflects the most
--      recent (by recorded_at) 1RM for that user/exercise. This prevents data
--      drift and guarantees that the canonical value is always in sync with the
--      history table, regardless of how history is changed. This design
--      supports composability, testability, and domain-driven analytics.
--
-- Usage: Do not call this function directly from application code. It is
--        invoked automatically by triggers defined later in this file. If you
--        add new ways to modify user_one_rep_max_history, ensure those flows
--        will still fire the triggers (or call this function).
CREATE OR REPLACE FUNCTION _trigger.sync_user_exercise_weights_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS void AS $$
DECLARE
  v_latest_weight_value numeric;
  v_latest_weight_unit weight_unit_enum;
BEGIN
  SELECT h.weight_value, h.weight_unit
    INTO v_latest_weight_value, v_latest_weight_unit
    FROM public.user_one_rep_max_history h
    WHERE h.user_id = p_user_id AND h.exercise_type = p_exercise_type
    ORDER BY h.recorded_at DESC, h.id DESC
    LIMIT 1;

  UPDATE public.user_exercise_weights
    SET one_rep_max_value = v_latest_weight_value,
        one_rep_max_unit = v_latest_weight_unit
    WHERE user_id = p_user_id AND exercise_type = p_exercise_type;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: after_insert_user_one_rep_max_history
--
-- Purpose: After insert on user_one_rep_max_history, syncs canonical 1RM in
--          user_exercise_weights.
--
-- Why: Ensures that any new 1RM entry is immediately reflected in the canonical
--      value for fast lookup and analytics. This trigger supports composability
--      and prevents stale data.
CREATE OR REPLACE FUNCTION _trigger.after_insert_user_one_rep_max_history () RETURNS TRIGGER AS $$
BEGIN
  PERFORM _trigger.sync_user_exercise_weights_one_rep_max(NEW.user_id, NEW.exercise_type);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: after_update_user_one_rep_max_history
--
-- Purpose: After update on user_one_rep_max_history, syncs canonical 1RM in
--          user_exercise_weights.
--
-- Why: Ensures that any edit to a 1RM entry is immediately reflected in the
--      canonical value for fast lookup and analytics. This trigger supports
--      composability and prevents stale data.
CREATE OR REPLACE FUNCTION _trigger.after_update_user_one_rep_max_history () RETURNS TRIGGER AS $$
BEGIN
  PERFORM _trigger.sync_user_exercise_weights_one_rep_max(NEW.user_id, NEW.exercise_type);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: after_delete_user_one_rep_max_history
--
-- Purpose: After delete on user_one_rep_max_history, syncs canonical 1RM in user_exercise_weights.
--
-- Why: Ensures that any deletion of a 1RM entry is immediately reflected in the
--      canonical value for fast lookup and analytics. This trigger supports
--      composability and prevents stale data.
CREATE OR REPLACE FUNCTION _trigger.after_delete_user_one_rep_max_history () RETURNS TRIGGER AS $$
BEGIN
  PERFORM _trigger.sync_user_exercise_weights_one_rep_max(OLD.user_id, OLD.exercise_type);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers on user_one_rep_max_history
--
-- Purpose: Ensure canonical 1RM is always in sync with history after insert,
--          update, or delete.
--
-- Why: These triggers guarantee that the denormalized canonical value is always
--      up to date, supporting fast queries and robust analytics. This design
--      supports composability and testability by automating data integrity.
DROP TRIGGER IF EXISTS trg_after_insert_user_one_rep_max_history ON public.user_one_rep_max_history;

CREATE TRIGGER trg_after_insert_user_one_rep_max_history
AFTER INSERT ON public.user_one_rep_max_history FOR EACH ROW
EXECUTE FUNCTION _trigger.after_insert_user_one_rep_max_history ();

DROP TRIGGER IF EXISTS trg_after_update_user_one_rep_max_history ON public.user_one_rep_max_history;

CREATE TRIGGER trg_after_update_user_one_rep_max_history
AFTER
UPDATE ON public.user_one_rep_max_history FOR EACH ROW
EXECUTE FUNCTION _trigger.after_update_user_one_rep_max_history ();

DROP TRIGGER IF EXISTS trg_after_delete_user_one_rep_max_history ON public.user_one_rep_max_history;

CREATE TRIGGER trg_after_delete_user_one_rep_max_history
AFTER DELETE ON public.user_one_rep_max_history FOR EACH ROW
EXECUTE FUNCTION _trigger.after_delete_user_one_rep_max_history ();
