-- ========================================================================== --
--
-- Migration: 00000000000070_user-metadata.sql
--
-- See: DATABASE_STRATEGY.md and DATABASE_DOCUMENTATION_STRATEGY.md for
--      philosophy and standards.
--
-- ========================================================================== --
--
-- Table: user_metadata
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
  default_rest_time integer DEFAULT 120,
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT user_metadata_pkey PRIMARY KEY (id),
  CONSTRAINT user_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_metadata_user_unique UNIQUE (user_id)
);

-- Enum: update_source_enum
--
-- Purpose: Enumerates the source of an update or entry (manual, competition, auto,
--          imported, other).
--
-- Why: Tracking the source of a value is important for auditability and
--      domain understanding (e.g., distinguishing between a competition PR and
--      an auto-calculated value). Using an enum ensures only valid, known
--      sources are used, supporting composability and future extensibility.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'update_source_enum') THEN
    CREATE TYPE public.update_source_enum AS ENUM (
      'manual',
      'system'
    );
  END IF;
END$$;

-- Table: personal_record_history
--
-- Purpose: Tracks all historical personal record (1RM) values for each user/exercise, including
--          source and notes.
--
-- Why: This table provides a full history of PR changes, in order to be able
--      to display charts and trends, and for the user to be able to see their
--      progress over time.
--
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): Foreign key to next_auth.users(id).
--   exercise_type (exercise_type_enum): The exercise type.
--   value (numeric): The PR value.
--   unit (weight_unit_enum): The PR unit.
--   recorded_at (timestamptz): When this PR was set.
--   source (update_source_enum): Source of the entry.
--   notes (text): Optional user notes.
--   exercise_id (uuid, nullable): The exercise that set this PR, if any.
CREATE TABLE IF NOT EXISTS public.personal_record_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  value numeric NOT NULL,
  unit weight_unit_enum NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT timezone ('utc', now()),
  source update_source_enum NOT NULL DEFAULT 'manual',
  notes text,
  exercise_id uuid NULL,
  CONSTRAINT personal_record_history_pkey PRIMARY KEY (id),
  CONSTRAINT personal_record_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT personal_record_history_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE SET NULL
);

-- Index: idx_personal_record_history_exercise_id
--
-- Purpose: Supports efficient lookup of whether an exercise was ever a personal record.
-- Why: Used for EXISTS subqueries in analytics and UI.
CREATE INDEX IF NOT EXISTS idx_personal_record_history_exercise_id ON public.personal_record_history (exercise_id);

-- Table: target_max_history
--
-- Purpose: Tracks all target max values for each user/exercise.
--
-- Why: This table provides a full history of Wendler target max changes, in
--      order to be able to display charts and trends, and for the user to be
--      able to see their progress over time.
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
  source update_source_enum NOT NULL DEFAULT 'manual',
  notes text,
  CONSTRAINT target_max_history_pkey PRIMARY KEY (id),
  CONSTRAINT target_max_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Index: idx_target_max_history_user_exercise_recorded_at
--
-- Purpose: Supports efficient lookup of the most recent target max for a user/exercise.
--
-- Why: The most common query is fetching the most recent target max for a given user and exercise_type, ordered by recorded_at DESC.
CREATE INDEX IF NOT EXISTS idx_target_max_history_user_exercise_recorded_at ON public.target_max_history (user_id, exercise_type, recorded_at DESC, id DESC);

-- Index: idx_personal_max_history_user_exercise_recorded_at
--
-- Purpose: Supports efficient lookup of the most recent one rep max for a user/exercise.
--
-- Why: The most common query is fetching the most recent one rep max for a given user and exercise_type, ordered by recorded_at DESC.
-- Index: idx_personal_record_history_user_exercise_recorded_at
--
-- Purpose: Supports efficient lookup of the most recent personal record for a user/exercise.
--
-- Why: The most common query is fetching the most recent personal record for a given user and exercise_type, ordered by recorded_at DESC.
CREATE INDEX IF NOT EXISTS idx_personal_record_history_user_exercise_recorded_at ON public.personal_record_history (user_id, exercise_type, recorded_at DESC, id DESC);
