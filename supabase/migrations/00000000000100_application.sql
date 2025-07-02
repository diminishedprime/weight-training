-- This file is for stuff that's dependent on other things all existing at once,
-- for example, returning exercises that were potentially a one-rep-max.
-- Requires that the one-rep-max table already exists and it's defined after the
-- exercises table.
-- ========================================================================== --
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
  relative_effort relative_effort_enum,
  personal_record boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.user_id,
        e.exercise_type,
        e.equipment_type,
        e.performed_at,
        e.weight_value,
        e.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.notes,
        e.relative_effort,
        EXISTS (
            SELECT 1
            FROM public.personal_record_history prh
            WHERE prh.exercise_id = e.id
        ) AS personal_record
    FROM public.exercises e
    WHERE e.user_id = p_user_id
      AND e.exercise_type = p_exercise_type
    ORDER BY e.performed_at DESC NULLS LAST
    LIMIT 30;
END;
$$ LANGUAGE plpgsql STABLE;
