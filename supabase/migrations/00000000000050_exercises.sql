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
      'barbell_back_squat',
      'barbell_front_squat',
      'barbell_bench_press',
      'barbell_overhead_press',
      'barbell_row',
      -- Dumbbell Exercises
      'dumbbell_row',
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
      -- Bodyweight Exercises
      'pushup',
      'situp',
      'pullup',
      'chinup',
      -- Corner Case Exercises
      'plate_stack_calf_raise'
    );
  END IF;

-- Enum: completion_status_enum
--
-- Purpose: Tracks the completion state of an exercise attempt.
--
-- Why: This enum provides a controlled vocabulary for the completion status of
--      all exercises tracked in the system. Since supabase can generate types,
--      it also gives our UI useful typing information.
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'completion_status_enum') THEN
    CREATE TYPE public.completion_status_enum AS ENUM (
      'completed',
      'not_completed',
      'failed',
      'skipped'
    );
  END IF;

-- Enum: equipment_type_enum
-- 
-- Purpose: Enumerates the types of equipment used for exercises.
--
-- Why: This enum provides a controlled vocabulary for the equipment used in
--      exercises. It provides a useful high-level categorization of exercises,
--      in a way that users will find intuitive.
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

-- Enum: relative_effort_enum
--
-- Purpose: Captures the user's subjective effort for an exercise set.
--
-- Why: This enables tracking of perceived exertion, which is valuable for
--      program personalization, progress analysis, and user feedback. The
--      values are intentionally simple to encourage consistent use.
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relative_effort_enum') THEN
    CREATE TYPE public.relative_effort_enum AS ENUM (
      'easy',
      'okay',
      'hard'
    );
  END IF;
END$$;

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
--   weight_id (uuid): FK to weights(id), the weight used.
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
  weight_id uuid NOT NULL,
  reps integer NOT NULL,
  warmup boolean NOT NULL DEFAULT false,
  completion_status completion_status_enum NOT NULL DEFAULT 'not_completed',
  notes text NULL,
  relative_effort relative_effort_enum NULL,
  CONSTRAINT exercises_id_pkey PRIMARY KEY (id),
  CONSTRAINT exercises_weight_id_fkey FOREIGN KEY (weight_id) REFERENCES public.weights (id) ON DELETE CASCADE,
  CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
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
--   p_performed_at (timestamptz, nullable): When performed.
--   p_weight_unit (weight_unit_enum, default 'pounds'): The weight unit.
--   p_warmup (boolean, default false): Whether this is a warmup set.
--   p_completion_status (completion_status_enum, default 'completed'): Completion state.
--   p_relative_effort (relative_effort_enum, default null): User's perceived effort.
-- Returns: uuid (the new exercise id).
CREATE OR REPLACE FUNCTION public.create_exercise (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_equipment_type equipment_type_enum,
  p_weight_value numeric,
  p_reps integer,
  p_performed_at timestamptz DEFAULT NULL,
  p_weight_unit weight_unit_enum DEFAULT 'pounds',
  p_warmup boolean DEFAULT false,
  p_completion_status completion_status_enum DEFAULT 'completed',
  p_relative_effort relative_effort_enum DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_weight_id uuid;
    v_exercise_id uuid;
BEGIN
    v_weight_id := public.get_weight(p_weight_value, p_weight_unit);
    INSERT INTO public.exercises (
        user_id, exercise_type, equipment_type, performed_at, weight_id, reps, warmup, completion_status, relative_effort
    ) VALUES (
        p_user_id, p_exercise_type, p_equipment_type, p_performed_at, v_weight_id, p_reps, p_warmup, p_completion_status, p_relative_effort
    )
    RETURNING id INTO v_exercise_id;
    RETURN v_exercise_id;
END;
$$ LANGUAGE plpgsql;

-- Function: get_exercises_by_type_for_user
--
-- Purpose: Returns up to 30 most recent exercises of a given type for a user.
--
-- Why: This function enables efficient retrieval of a user's exercise history
--      for analytics, progress tracking, and UI display. The limit of 30 is a
--      trade-off between performance and usability for most user flows.
-- Arguments:
--   p_user_id (uuid): The user id.
--   p_exercise_type (exercise_type_enum): The exercise type.
-- Returns: Table of exercise records (see columns below).
--
--  Todo - update this to support pagination, additionally creating a composite
--         index to support efficient pagination.
--
CREATE OR REPLACE FUNCTION public.get_exercises_by_type_for_user (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS TABLE (
  exercise_id uuid,
  user_id uuid,
  exercise_type exercise_type_enum,
  equipment_type equipment_type_enum,
  performed_at timestamptz,
  weight_value numeric,
  weight_unit weight_unit_enum,
  reps integer,
  warmup boolean,
  completion_status completion_status_enum,
  notes text,
  relative_effort relative_effort_enum
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.user_id,
        e.exercise_type,
        e.equipment_type,
        e.performed_at,
        w.weight_value,
        w.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.notes,
        e.relative_effort
    FROM public.exercises e
    JOIN public.weights w ON e.weight_id = w.id
    WHERE e.user_id = p_user_id
      AND e.exercise_type = p_exercise_type
    ORDER BY e.performed_at DESC NULLS LAST
    LIMIT 30;
END;
$$ LANGUAGE plpgsql STABLE;

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
--   p_reps (integer): The new number of reps.
--   p_performed_at (timestamptz, nullable): When performed.
--   p_weight_unit (weight_unit_enum, default 'pounds'): The weight unit.
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
  p_reps integer,
  p_performed_at timestamptz DEFAULT NULL,
  p_weight_unit weight_unit_enum DEFAULT 'pounds',
  p_warmup boolean DEFAULT false,
  p_completion_status completion_status_enum DEFAULT 'completed',
  p_notes text DEFAULT NULL,
  p_relative_effort relative_effort_enum DEFAULT NULL
) RETURNS void AS $$
DECLARE
    v_weight_id uuid;
BEGIN
    v_weight_id := public.get_weight(p_weight_value, p_weight_unit);
    UPDATE public.exercises
    SET
        exercise_type = p_exercise_type,
        performed_at = p_performed_at,
        weight_id = v_weight_id,
        reps = p_reps,
        warmup = p_warmup,
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
        w.weight_value,
        w.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.notes,
        e.relative_effort
    INTO result
    FROM public.exercises e
    JOIN public.weights w ON e.weight_id = w.id
    WHERE e.user_id = p_user_id
      AND e.id = p_exercise_id
    LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
