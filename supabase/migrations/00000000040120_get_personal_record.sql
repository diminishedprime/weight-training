DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'personal_record_row') THEN
    CREATE TYPE public.personal_record_row AS (
      weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      recorded_at timestamptz,
      exercise_id uuid
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_personal_record (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_reps integer
) RETURNS personal_record_row AS $$
DECLARE
  result personal_record_row;
BEGIN
  SELECT h.weight_value, h.weight_unit, h.reps, h.recorded_at, h.exercise_id
    INTO result
    FROM public.personal_record_history h
    WHERE h.user_id = p_user_id
      AND h.exercise_type = p_exercise_type
      AND h.reps = p_reps
    ORDER BY h.recorded_at DESC, h.id DESC
    LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
