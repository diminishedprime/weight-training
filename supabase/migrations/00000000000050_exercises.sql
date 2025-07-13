-- ========================================================================== --
--
-- Migration: 00000000000050_exercises.sql
-- Purpose: All exercise-related tables, types, and functions for the fitness
--          domain.
--
-- This migration defines the core enums, tables, and functions for tracking
-- exercises, their types, equipment, completion status, and user-specific
-- exercise records. All objects are created in the public schema.
--
-- Philosophy: The schema is designed to be domain-driven, composable, and
--             testable, reflecting real-world fitness concepts and supporting
--             robust analytics and user flows. See
--             DATABASE_DOCUMENTATION_STRATEGY.md for documentation standards
--             and rationale.  Enum: exercise_type_enum
--
-- ========================================================================== --
--
-- Enum: exercise_type_enum
--
-- Purpose: Enumerates all supported exercise types in the domain.
-- 
-- Why: This enum provides a controlled vocabulary for all exercises tracked in
--      the system. Since supabase can generate types, it also gives our UI
--      useful typing information. New types are to be added as needed.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_type_enum') THEN
    CREATE TYPE public.exercise_type_enum AS ENUM (
      -- Barbell Exercises
      'barbell_deadlift',
      'barbell_romanian_deadlift',
      'barbell_back_squat',
      'barbell_front_squat',
      'barbell_bench_press',
      'barbell_incline_bench_press',
      'barbell_overhead_press',
      'barbell_row',
      -- Olympic Barbell Exercises
      'barbell_snatch',
      'barbell_clean_and_jerk',
      -- Dumbbell Exercises
      'dumbbell_row',
      'dumbbell_bench_press',
      'dumbbell_incline_bench_press',
      'dumbbell_overhead_press',
      'dumbbell_bicep_curl',
      'dumbbell_hammer_curl',
      'dumbbell_wrist_curl', -- Is that what this is called?
      'dumbbell_fly',
      'dumbbell_lateral_raise',
      'dumbbell_skull_crusher',
      'dumbbell_preacher_curl',
      -- Machine Exercises
      'machine_converging_chest_press',
      'machine_diverging_lat_pulldown',
      'machine_diverging_low_row',
      'machine_converging_shoulder_press',
      'machine_lateral_raise',
      'machine_abdominal',
      'machine_back_extension',
      'machine_seated_leg_curl',
      'machine_leg_extension',
      'machine_leg_press',
      'machine_inner_thigh',
      'machine_outer_thigh',
      'machine_triceps_extension',
      'machine_biceps_curl',
      'machine_rear_delt',
      'machine_pec_fly',
      'machine_assissted_chinup',
      'machine_assissted_pullup',
      'machine_assissted_dip',
      -- Bodyweight Exercises
      'bodyweight_pushup',
      'bodyweight_situp',
      'bodyweight_pullup',
      'bodyweight_chinup',
      'bodyweight_dip',
      -- Kettlebell Exercises
      'kettlebell_swings',
      'kettlebell_front_squat',
      'kettlebell_row',
      -- Corner Case Exercises
      'plate_stack_calf_raise'
    );
  END IF;
END$$;

-- Enum: completion_status_enum
--
-- Purpose: Tracks the completion state of an exercise attempt.
--
-- Why: This enum provides a controlled vocabulary for the completion status of
--      all exercises tracked in the system. Since supabase can generate types,
--      it also gives our UI useful typing information.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'completion_status_enum') THEN
    CREATE TYPE public.completion_status_enum AS ENUM (
      'completed',
      'not_completed',
      'failed',
      'skipped'
    );
  END IF;
END$$;

-- Enum: equipment_type_enum
-- 
-- Purpose: Enumerates the types of equipment used for exercises.
--
-- Why: This enum provides a controlled vocabulary for the equipment used in
--      exercises. It provides a useful high-level categorization of exercises,
--      in a way that users will find intuitive.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_type_enum') THEN
    CREATE TYPE public.equipment_type_enum AS ENUM (
      'barbell',
      'dumbbell',
      'kettlebell',
      'machine',
      'bodyweight',
      'plate_stack'
    );
  END IF;
END$$;

-- Enum: relative_effort_enum
--
-- Purpose: Captures the user's subjective effort for an exercise set.
--
-- Why: This enables tracking of perceived exertion, which is valuable for
--      program personalization, progress analysis, and user feedback. The
--      values are intentionally simple to encourage consistent use.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relative_effort_enum') THEN
    CREATE TYPE public.relative_effort_enum AS ENUM (
      'easy',
      'okay',
      'hard'
    );
  END IF;
END$$;

-- Enum: weight_unit_enum
--
-- Purpose: Enumerates the units used for weights (e.g., pounds, kilograms).
--
-- Why: This enum provides a controlled vocabulary for weight units, ensuring
--      type safety and consistency across the schema.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weight_unit_enum') THEN
    CREATE TYPE public.weight_unit_enum AS ENUM (
      'pounds',
      'kilograms'
    );
  END IF;
END$$;

-- Sequence: exercises_insert_order_seq
--
-- Purpose: Provides a monotonic increasing sequence for tracking insertion order
--          of exercises, independent of timestamps.
--
-- Why: When bulk importing data (e.g., via seed.sql), all insert_time values
--      can be identical, breaking chronological ordering needed for personal
--      record triggers. This sequence ensures we can always determine the
--      actual insertion order.
CREATE SEQUENCE IF NOT EXISTS public.exercises_insert_order_seq;

-- Table: exercises
--
-- Purpose: Stores all user exercise records, including type, equipment, weight,
--          reps, and completion status.
--
-- Why: This table is the core fact table for tracking every exercise performed
--      by a user. It's the cornerstone of the fitness domain, enabling
--      comprehensive tracking and analysis of user workouts.
--
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): FK to next_auth.users(id).
--   exercise_type (exercise_type_enum): The type of exercise performed.
--   equipment_type (equipment_type_enum): The equipment used.
--   performed_at (timestamptz, nullable): When the exercise was performed.
--   insert_time (timestamptz): When the row was inserted into the database.
--   insert_order (bigint): Monotonic sequence for tracking insertion order.
--   weight_value (numeric): The weight value used.
--   weight_unit (weight_unit_enum): The weight unit used.
--   reps (integer): Number of reps performed.
--   warmup (boolean): Whether this set was a warmup.
--   completion_status (completion_status_enum): Completion state.
--   notes (text, nullable): Optional user notes.
--   relative_effort (relative_effort_enum, nullable): User's perceived effort.
CREATE TABLE IF NOT EXISTS public.exercises (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  equipment_type equipment_type_enum NOT NULL DEFAULT 'barbell',
  performed_at timestamp with time zone NULL,
  insert_time timestamp with time zone NOT NULL DEFAULT timezone ('utc', now()),
  insert_order bigint NOT NULL DEFAULT nextval('public.exercises_insert_order_seq'),
  weight_value numeric NOT NULL,
  actual_weight_value numeric NOT NULL,
  weight_unit weight_unit_enum NOT NULL,
  reps integer NOT NULL,
  warmup boolean NOT NULL DEFAULT false,
  is_amrap boolean NOT NULL DEFAULT false,
  completion_status completion_status_enum NOT NULL DEFAULT 'not_completed',
  notes text NULL,
  relative_effort relative_effort_enum NULL,
  CONSTRAINT exercises_id_pkey PRIMARY KEY (id)
  -- TODO: Re-enable this constraint once Steph & Matt exist in production database
  -- The constraint is temporarily disabled to allow seeding imported exercise data
  -- without pre-creating user records, since some auth fields can't be determined ahead of time
  -- CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Function: create_exercise
--
-- Purpose: Inserts a new exercise record for a user, creating the weight if needed.
--
-- Why: This function encapsulates the business logic for exercise creation,
--      ensuring that weights are normalized and all required fields are set.
--
--      It returns the new exercise id for composability in flows that need to
--      chain inserts (e.g., block creation).
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_equipment_type (equipment_type_enum): The equipment type.
--   p_weight_value (numeric): The weight value.
--   p_reps (integer): Number of reps.
--   p_weight_unit (weight_unit_enum, default 'pounds'): The weight unit.
--   p_performed_at (timestamptz, nullable): When performed.
--   p_warmup (boolean, default false): Whether this is a warmup set.
--   p_completion_status (completion_status_enum, default 'completed'): Completion state.
--   p_relative_effort (relative_effort_enum, default null): User's perceived effort.
--   p_notes (text, default null): Optional notes.
-- Returns: uuid (the new exercise id).
CREATE OR REPLACE FUNCTION public.create_exercise (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_equipment_type equipment_type_enum,
  p_weight_value numeric,
  p_actual_weight_value numeric,
  p_reps integer,
  p_weight_unit weight_unit_enum DEFAULT 'pounds',
  p_performed_at timestamptz DEFAULT NULL,
  p_warmup boolean DEFAULT false,
  p_is_amrap boolean DEFAULT false,
  p_completion_status completion_status_enum DEFAULT 'completed',
  p_relative_effort relative_effort_enum DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_exercise_id uuid;
BEGIN
    INSERT INTO public.exercises (
        user_id, exercise_type, equipment_type, performed_at, weight_value, actual_weight_value, weight_unit, reps, warmup, is_amrap, completion_status, notes, relative_effort
    ) VALUES (
        p_user_id, p_exercise_type, p_equipment_type, p_performed_at, p_weight_value, p_actual_weight_value, p_weight_unit, p_reps, p_warmup, p_is_amrap, p_completion_status, p_notes, p_relative_effort
    )
    RETURNING id INTO v_exercise_id;
    RETURN v_exercise_id;
END;
$$ LANGUAGE plpgsql;

-- Function: update_exercise_for_user
--
-- Purpose: Updates an existing exercise record for a user, changing any of the
--          available fields.
--
-- Why: This function encapsulates the business logic for editing exercises,
--      ensuring that only the owner can update, and that weights are
--      normalized.
--
-- Arguments:
--   p_exercise_id (uuid): The exercise id.
--   p_user_id (uuid): The user id (for RLS).
--   p_exercise_type (exercise_type_enum): The exercise type.
--   p_weight_value (numeric): The new weight value.
--   p_weight_unit (weight_unit_enum, default 'pounds'): The weight unit.
--   p_reps (integer): The new number of reps.
--   p_performed_at (timestamptz, nullable): When performed.
--   p_warmup (boolean, default false): Whether this is a warmup set.
--   p_completion_status (completion_status_enum, default 'completed'): Completion state.
--   p_notes (text, default null): Optional notes.
--   p_relative_effort (relative_effort_enum, default null): User's perceived effort.
-- Returns: void
CREATE OR REPLACE FUNCTION public.update_exercise_for_user (
  p_exercise_id uuid,
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_actual_weight_value numeric,
  p_reps integer,
  p_weight_unit weight_unit_enum DEFAULT 'pounds',
  p_performed_at timestamptz DEFAULT NULL,
  p_warmup boolean DEFAULT false,
  p_is_amrap boolean DEFAULT false,
  p_completion_status completion_status_enum DEFAULT 'completed',
  p_notes text DEFAULT NULL,
  p_relative_effort relative_effort_enum DEFAULT NULL
) RETURNS void AS $$
BEGIN
    UPDATE public.exercises
    SET
        exercise_type = p_exercise_type,
        performed_at = p_performed_at,
        weight_value = p_weight_value,
        actual_weight_value = p_actual_weight_value,
        weight_unit = p_weight_unit,
        reps = p_reps,
        warmup = p_warmup,
        is_amrap = p_is_amrap,
        completion_status = p_completion_status,
        notes = p_notes,
        relative_effort = p_relative_effort
    WHERE id = p_exercise_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Composite type: exercise_row_type
--
-- Purpose: Used as a return type for get_exercise_for_user, representing a full
--          exercise record.
--
-- Why: This composite type enables type-safe, composable return values for
--      functions that need to return a full exercise record, including mapping
--      the weight-id to its value and unit.
--
-- Columns:
--   exercise_id (uuid): The exercise id.
--   user_id (uuid): The user id.
--   exercise_type (exercise_type_enum): The exercise type.
--   equipment_type (equipment_type_enum): The equipment type.
--   performed_at (timestamptz): When performed.
--   weight_value (numeric): The weight value.
--   weight_unit (weight_unit_enum): The weight unit.
--   reps (integer): Number of reps.
--   warmup (boolean): Whether this is a warmup set.
--   completion_status (completion_status_enum): Completion state.
--   notes (text): Optional notes.
--   relative_effort (relative_effort_enum): User's perceived effort.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_row_type') THEN
    CREATE TYPE public.exercise_row_type AS (
      exercise_id uuid,
      user_id uuid,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      performed_at timestamptz,
      weight_value numeric,
      actual_weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      warmup boolean,
      completion_status completion_status_enum,
      notes text,
      relative_effort relative_effort_enum
    );
  END IF;
END$$;

-- Function: get_exercise_for_user
--
-- Purpose: Returns a single exercise record for a user by id.
--
-- Why: This function enables retrieving specific exercise for editing and UI
--      display.
--
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_id (uuid): The exercise id.
-- Returns: exercise_row_type (see above).
CREATE OR REPLACE FUNCTION public.get_exercise_for_user (p_user_id uuid, p_exercise_id uuid) RETURNS exercise_row_type AS $$
DECLARE
    result exercise_row_type;
BEGIN
    SELECT
        e.id,
        e.user_id,
        e.exercise_type,
        e.equipment_type,
        e.performed_at,
        e.weight_value,
        e.actual_weight_value,
        e.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.notes,
        e.relative_effort
    INTO result
    FROM public.exercises e
    WHERE e.user_id = p_user_id
      AND e.id = p_exercise_id
    LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- TODO: Consider creating a new table `bodyweight_exercise_details` to track bodyweight-specific data for exercises.
-- This table would have a foreign key to exercises(id) and could include fields like:
--   bodyweight_value numeric NULL, -- The user's bodyweight at the time of exercise
--   bodyweight_unit weight_unit_enum NULL, -- Unit for bodyweight (e.g., pounds, kilograms)
--   added_weight_value numeric NULL, -- Any additional weight used (vest, belt, etc.)
--   added_weight_unit weight_unit_enum NULL -- Unit for added weight
-- This would allow more accurate tracking and analytics for bodyweight and weighted bodyweight exercises.
--
-- Example table definition:
--
-- CREATE TABLE public.bodyweight_exercise_details (
--   exercise_id uuid PRIMARY KEY REFERENCES public.exercises(id) ON DELETE CASCADE,
--   bodyweight_value numeric NULL,
--   bodyweight_unit weight_unit_enum NULL,
--   added_weight_value numeric NULL,
--   added_weight_unit weight_unit_enum NULL
-- );
--
-- Example usage:
-- -- For a bodyweight pullup with a 20lb vest, user weighed 180lb:
-- -- INSERT INTO public.bodyweight_exercise_details (exercise_id, bodyweight_value, bodyweight_unit, added_weight_value, added_weight_unit)
-- -- VALUES ('<exercise_id>', 180, 'pounds', 20, 'pounds');
