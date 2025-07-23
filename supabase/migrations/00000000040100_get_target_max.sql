DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'target_max_row') THEN
    CREATE TYPE public.target_max_row AS (
      weight_value numeric,
      weight_unit weight_unit_enum,
      recorded_at timestamptz
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS target_max_row AS $$
DECLARE
  result target_max_row;
BEGIN
  SELECT h.weight_value, h.weight_unit, h.recorded_at
    INTO result
    FROM public.target_max_history h
    WHERE h.user_id = p_user_id
      AND h.exercise_type = p_exercise_type
    ORDER BY h.recorded_at DESC, h.id DESC
    LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
