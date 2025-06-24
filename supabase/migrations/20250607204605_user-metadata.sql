-- Table: user_metadata
-- Purpose: Stores per-user preferences and settings.
-- Columns:
--   id (uuid): Primary key for the metadata record.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   preferred_weight_unit (weight_unit_enum): User's preferred weight unit.
--   created_at, updated_at (timestamptz): Timestamps for record tracking.
-- Usage: Used to store and retrieve user-specific settings.
CREATE TABLE IF NOT EXISTS public.user_metadata
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    preferred_weight_unit weight_unit_enum DEFAULT 'pounds',
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    updated_at timestamp with time zone DEFAULT timezone('utc', now()),
    CONSTRAINT user_metadata_pkey PRIMARY KEY (id),
    CONSTRAINT user_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.user_exercise_weights
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    one_rep_max_weight_id uuid,
    target_max_weight_id uuid,
    default_rest_time_seconds integer DEFAULT 120,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    CONSTRAINT user_exercise_weights_pkey PRIMARY KEY (id),
    CONSTRAINT user_exercise_weights_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE,
    CONSTRAINT user_exercise_weights_one_rep_max_fkey FOREIGN KEY (one_rep_max_weight_id) REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT user_exercise_weights_target_max_fkey FOREIGN KEY (target_max_weight_id) REFERENCES public.weights(id) ON DELETE CASCADE,
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

-- Trigger: create_user_metadata_on_user_insert
-- Purpose: Automatically creates a user_metadata row and user_exercise_weights
-- rows for all exercise types when a new user is inserted.
CREATE OR REPLACE FUNCTION public.create_user_metadata_on_user_insert()
RETURNS TRIGGER AS $$
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
AFTER INSERT ON next_auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_user_metadata_on_user_insert();

-- Function: update_user_one_rep_max
-- Purpose: Sets or updates the user's one-rep max for a given exercise.
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The weight value.
--   p_weight_unit (weight_unit_enum): The weight unit.
-- Usage: Ensures a single canonical row for each user/exercise, updating or inserting as needed.
CREATE OR REPLACE FUNCTION public.update_user_one_rep_max(
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum
) RETURNS void AS $$
DECLARE
  v_weight_id uuid;
BEGIN
  v_weight_id := public.get_weight(p_weight_value, p_weight_unit);

  INSERT INTO public.user_exercise_weights (user_id, exercise_type, one_rep_max_weight_id)
    VALUES (p_user_id, p_exercise_type, v_weight_id)
    ON CONFLICT (user_id, exercise_type) DO UPDATE
      SET one_rep_max_weight_id = EXCLUDED.one_rep_max_weight_id;
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
CREATE OR REPLACE FUNCTION public.update_user_target_max(
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
CREATE OR REPLACE FUNCTION public.update_user_default_rest_time(
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

-- Function: get_user_preferences
-- Purpose: Returns user preferences and maxes for all exercises.
-- Arguments:
--   p_user_id (uuid): The user id.
-- Returns: Table of user preferences and maxes.
-- Usage: Used to fetch all relevant user settings and maxes for display or logic.
CREATE OR REPLACE FUNCTION get_user_preferences(
  p_user_id uuid
)
RETURNS SETOF user_preferences_row
language sql
as $$
  select 
    um.preferred_weight_unit,
    uew.exercise_type,
    w1.weight_value,
    w1.weight_unit,
    w2.weight_value,
    w2.weight_unit,
    uew.default_rest_time_seconds
  from user_metadata um
  left join user_exercise_weights uew on uew.user_id = um.user_id
  left join weights w1 on w1.id = uew.one_rep_max_weight_id
  left join weights w2 on w2.id = uew.target_max_weight_id
  where um.user_id = p_user_id;
$$;
