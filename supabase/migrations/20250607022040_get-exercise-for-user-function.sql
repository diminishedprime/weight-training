-- Composite type: exercise_row_type
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
CREATE OR REPLACE FUNCTION public.get_exercise_for_user(
    p_user_id uuid,
    p_exercise_id uuid
)
RETURNS exercise_row_type AS $$
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
