-- Table: user_metadata
-- Purpose: Stores per-user preferences and settings.
-- Columns:
--   id (uuid): Primary key for the metadata record.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   preferred_weight_unit (weight_unit_enum): User's preferred weight unit.
--   created_at, updated_at (timestamptz): Timestamps for record tracking.
-- Usage: Used to store and retrieve user-specific settings.
CREATE TABLE IF NOT EXISTS
  public.user_metadata (
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
-- Purpose: Stores per-user, per-exercise one-rep max and target max weights, and rest time.
-- Columns:
--   id (uuid): Primary key for the record.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   exercise_type (exercise_type_enum): The exercise type.
--   one_rep_max_weight_id (uuid): Foreign key to weights(id) for 1RM.
--   target_max_weight_id (uuid): Foreign key to weights(id) for target max.
--   default_rest_time_seconds (integer): Default rest time in seconds for this exercise (default 120).
--   created_at (timestamptz): Timestamp for record creation.
-- Usage: Used to track user progress, goals, and rest preferences for each exercise.
CREATE TABLE IF NOT EXISTS
  public.user_exercise_weights (
    id uuid NOT NULL DEFAULT uuid_generate_v4 (),
    user_id uuid NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    one_rep_max_weight_id uuid,
    target_max_weight_id uuid,
    default_rest_time_seconds integer DEFAULT 120,
    created_at timestamp with time zone DEFAULT timezone ('utc', now()),
    CONSTRAINT user_exercise_weights_pkey PRIMARY KEY (id),
    CONSTRAINT user_exercise_weights_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
    CONSTRAINT user_exercise_weights_one_rep_max_fkey FOREIGN KEY (one_rep_max_weight_id) REFERENCES public.weights (id) ON DELETE CASCADE,
    CONSTRAINT user_exercise_weights_target_max_fkey FOREIGN KEY (target_max_weight_id) REFERENCES public.weights (id) ON DELETE CASCADE,
    CONSTRAINT user_exercise_weights_unique UNIQUE (user_id, exercise_type)
  );

-- Type: user_preferences_row
-- Purpose: Composite type for get_user_preferences return value, with nullable max fields.
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
-- Purpose: Source of a 1RM entry (manual, competition, auto, etc)
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
-- Purpose: Tracks all historical 1RM values for each user/exercise.
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   exercise_type (exercise_type_enum): The exercise type.
--   weight_id (uuid): Foreign key to weights(id) for 1RM.
--   recorded_at (timestamptz): When this 1RM was set.
--   source (user_one_rep_max_source_enum): Source of the entry.
--   notes (text): Optional user notes.
CREATE TABLE IF NOT EXISTS
  public.user_one_rep_max_history (
    id uuid NOT NULL DEFAULT uuid_generate_v4 (),
    user_id uuid NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    weight_id uuid NOT NULL,
    recorded_at timestamptz NOT NULL DEFAULT timezone ('utc', now()),
    source user_one_rep_max_source_enum NOT NULL DEFAULT 'manual',
    notes text,
    CONSTRAINT user_one_rep_max_history_pkey PRIMARY KEY (id),
    CONSTRAINT user_one_rep_max_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
    CONSTRAINT user_one_rep_max_history_weight_id_fkey FOREIGN KEY (weight_id) REFERENCES public.weights (id) ON DELETE CASCADE
  );

-- Trigger: create_user_metadata_on_user_insert
-- Purpose: Automatically creates a user_metadata row and user_exercise_weights
-- rows for all exercise types when a new user is inserted.
CREATE
OR REPLACE FUNCTION public.create_user_metadata_on_user_insert () RETURNS TRIGGER AS $$
DECLARE
  exercise_type_val exercise_type_enum;
BEGIN
  INSERT INTO public.user_metadata (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Insert a user_exercise_weights row for every exercise_type_enum value
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
-- Purpose: Sets or updates the user's one-rep max for a given exercise.
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The weight value.
--   p_weight_unit (weight_unit_enum): The weight unit.
-- Usage: Ensures a single canonical row for each user/exercise, updating or inserting as needed.
CREATE
OR REPLACE FUNCTION public.update_user_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_source user_one_rep_max_source_enum DEFAULT 'manual',
  p_notes text DEFAULT NULL,
  p_recorded_at timestamptz DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_weight_id uuid;
  v_now timestamptz;
BEGIN
  v_weight_id := public.get_weight(p_weight_value, p_weight_unit);
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));

  -- Insert into history
  INSERT INTO public.user_one_rep_max_history (
    user_id, exercise_type, weight_id, recorded_at, source, notes
  ) VALUES (
    p_user_id, p_exercise_type, v_weight_id, v_now, p_source, p_notes
  );
  -- No need to update canonical value directly; triggers on history will sync it.
END;
$$ LANGUAGE plpgsql;

-- Function: update_user_target_max
-- Purpose: Sets or updates the user's target max for a given exercise.
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The weight value.
--   p_weight_unit (weight_unit_enum): The weight unit.
-- Usage: Ensures a single canonical row for each user/exercise, updating or inserting as needed.
CREATE
OR REPLACE FUNCTION public.update_user_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum
) RETURNS void AS $$
DECLARE
  v_weight_id uuid;
BEGIN
  v_weight_id := public.get_weight(p_weight_value, p_weight_unit);

  INSERT INTO public.user_exercise_weights (user_id, exercise_type, target_max_weight_id)
    VALUES (p_user_id, p_exercise_type, v_weight_id)
    ON CONFLICT (user_id, exercise_type) DO UPDATE
      SET target_max_weight_id = EXCLUDED.target_max_weight_id;
END;
$$ LANGUAGE plpgsql;

-- Function: update_user_default_rest_time
-- Purpose: Sets or updates the user's default rest time for a given exercise.
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_default_rest_time_seconds (integer): The new default rest time in seconds.
-- Usage: Ensures a single canonical row for each user/exercise, updating or inserting as needed.
CREATE
OR REPLACE FUNCTION public.update_user_default_rest_time (
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
-- Purpose: Sets/updates the user's canonical 1RM and logs the change in history.
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The weight value.
--   p_weight_unit (weight_unit_enum): The weight unit.
--   p_source (user_one_rep_max_source_enum): Source of the entry.
--   p_notes (text): Optional notes.
--   p_recorded_at (timestamptz): Optional override for timestamp.
-- Usage: Always logs to history, and updates canonical value in user_exercise_weights.
CREATE
OR REPLACE FUNCTION public.update_user_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_source user_one_rep_max_source_enum DEFAULT 'manual',
  p_notes text DEFAULT NULL,
  p_recorded_at timestamptz DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_weight_id uuid;
  v_now timestamptz;
BEGIN
  v_weight_id := public.get_weight(p_weight_value, p_weight_unit);
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));

  -- Insert into history
  INSERT INTO public.user_one_rep_max_history (
    user_id, exercise_type, weight_id, recorded_at, source, notes
  ) VALUES (
    p_user_id, p_exercise_type, v_weight_id, v_now, p_source, p_notes
  );
  -- No need to update canonical value directly; triggers on history will sync it.
END;
$$ LANGUAGE plpgsql;

-- Function: get_user_one_rep_max_history
-- Purpose: Returns all 1RM history for a user/exercise, most recent first.
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
-- Returns: Table of history rows.
CREATE
OR REPLACE FUNCTION public.get_user_one_rep_max_history (
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
    SELECT h.id, h.user_id, h.exercise_type, w.weight_value, w.weight_unit, h.recorded_at, h.source, h.notes
    FROM public.user_one_rep_max_history h
    JOIN public.weights w ON h.weight_id = w.id
    WHERE h.user_id = p_user_id AND h.exercise_type = p_exercise_type
    ORDER BY h.recorded_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: edit_user_one_rep_max_history
-- Purpose: Edits a 1RM history row (weight, timestamp, notes, source).
-- Arguments:
--   p_history_id (uuid): The history row id.
--   p_user_id (uuid): The user id (for RLS).
--   p_weight_value (numeric): New weight value.
--   p_weight_unit (weight_unit_enum): New weight unit.
--   p_recorded_at (timestamptz): New timestamp.
--   p_source (user_one_rep_max_source_enum): New source.
--   p_notes (text): New notes.
-- Usage: Updates the specified row if it belongs to the user.
CREATE
OR REPLACE FUNCTION public.edit_user_one_rep_max_history (
  p_history_id uuid,
  p_user_id uuid,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_recorded_at timestamptz,
  p_source user_one_rep_max_source_enum,
  p_notes text
) RETURNS void AS $$
DECLARE
  v_weight_id uuid;
BEGIN
  v_weight_id := public.get_weight(p_weight_value, p_weight_unit);
  UPDATE public.user_one_rep_max_history
    SET weight_id = v_weight_id,
        recorded_at = p_recorded_at,
        source = p_source,
        notes = p_notes
    WHERE id = p_history_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function: get_user_preferences
-- Purpose: Returns user preferences and maxes for all exercises.
-- Arguments:
--   p_user_id (uuid): The user id.
-- Returns: Table of user preferences and maxes.
-- Usage: Uses most recent 1RM from history if present, else falls back to user_exercise_weights.
CREATE
OR REPLACE FUNCTION public.get_user_preferences (p_user_id uuid) RETURNS SETOF user_preferences_row language sql as $$
  with latest_1rm as (
    select distinct on (h.exercise_type)
      h.exercise_type,
      w.weight_value as one_rep_max_value,
      w.weight_unit as one_rep_max_unit,
      h.recorded_at
    from user_one_rep_max_history h
    join weights w on w.id = h.weight_id
    where h.user_id = p_user_id
    order by h.exercise_type, h.recorded_at desc
  )
  select 
    um.preferred_weight_unit,
    uew.exercise_type,
    coalesce(l1rm.one_rep_max_value, w1.weight_value) as one_rep_max_value,
    coalesce(l1rm.one_rep_max_unit, w1.weight_unit) as one_rep_max_unit,
    w2.weight_value as target_max_value,
    w2.weight_unit as target_max_unit,
    uew.default_rest_time_seconds
  from user_metadata um
  left join user_exercise_weights uew on uew.user_id = um.user_id
  left join latest_1rm l1rm on l1rm.exercise_type = uew.exercise_type
  left join weights w1 on w1.id = uew.one_rep_max_weight_id
  left join weights w2 on w2.id = uew.target_max_weight_id
  where um.user_id = p_user_id;
$$;

-- Function: sync_user_exercise_weights_one_rep_max
-- Purpose: Ensures the canonical one_rep_max_weight_id in user_exercise_weights
--          always matches the latest entry in user_one_rep_max_history for a
--          given user/exercise.
--
-- Why this exists:
--   - The canonical 1RM (one_rep_max_weight_id) is denormalized (i.e.
--     duplicated) in user_exercise_weights for fast lookup.
--   - The true source of 1RM history is user_one_rep_max_history, which can be
--     edited (including timestamp, weight, or deleted).
--   - This function is called by triggers after any INSERT, UPDATE, or DELETE
--     on user_one_rep_max_history to ensure that
--     user_exercise_weights.one_rep_max_weight_id always reflects the most
--     recent (by recorded_at) 1RM for that user/exercise.  
--   - This prevents data drift and guarantees that the canonical value is
--     always in sync with the history table, regardless of how history is
--     changed.
--
-- Usage:
--   - Do not call this function directly from application code. It is invoked
--     automatically by triggers defined later in this file.
--   - If you add new ways to modify user_one_rep_max_history, ensure those
--     flows will still fire the triggers (or call this function).
CREATE
OR REPLACE FUNCTION _trigger.sync_user_exercise_weights_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS void AS $$
DECLARE
  v_latest_weight_id uuid;
BEGIN
  SELECT h.weight_id
    INTO v_latest_weight_id
    FROM public.user_one_rep_max_history h
    WHERE h.user_id = p_user_id AND h.exercise_type = p_exercise_type
    ORDER BY h.recorded_at DESC, h.id DESC
    LIMIT 1;

  UPDATE public.user_exercise_weights
    SET one_rep_max_weight_id = v_latest_weight_id
    WHERE user_id = p_user_id AND exercise_type = p_exercise_type;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: after_insert_user_one_rep_max_history
CREATE
OR REPLACE FUNCTION _trigger.after_insert_user_one_rep_max_history () RETURNS TRIGGER AS $$
BEGIN
  PERFORM _trigger.sync_user_exercise_weights_one_rep_max(NEW.user_id, NEW.exercise_type);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: after_update_user_one_rep_max_history
CREATE
OR REPLACE FUNCTION _trigger.after_update_user_one_rep_max_history () RETURNS TRIGGER AS $$
BEGIN
  PERFORM _trigger.sync_user_exercise_weights_one_rep_max(NEW.user_id, NEW.exercise_type);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: after_delete_user_one_rep_max_history
CREATE
OR REPLACE FUNCTION _trigger.after_delete_user_one_rep_max_history () RETURNS TRIGGER AS $$
BEGIN
  PERFORM _trigger.sync_user_exercise_weights_one_rep_max(OLD.user_id, OLD.exercise_type);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers on user_one_rep_max_history
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

-- Grant USAGE on _trigger schema to anon and authenticated roles so triggers can be called from API
GRANT USAGE ON SCHEMA _trigger TO anon;

GRANT USAGE ON SCHEMA _trigger TO authenticated;