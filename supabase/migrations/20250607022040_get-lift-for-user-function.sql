-- Composite type: lift_row_type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lift_row_type') THEN
    CREATE TYPE public.lift_row_type AS (
      lift_id uuid,
      user_id uuid,
      lift_type lift_type_enum,
      performed_at timestamptz,
      weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      warmup boolean,
      completion_status completion_status_enum
    );
  END IF;
END$$;

-- Function: get_lift_for_user
CREATE OR REPLACE FUNCTION public.get_lift_for_user(
    p_user_id uuid,
    p_lift_id uuid
)
RETURNS lift_row_type AS $$
DECLARE
    result lift_row_type;
BEGIN
    SELECT
        l.id,
        l.user_id,
        l.lift_type,
        l.performed_at,
        w.weight_value,
        w.weight_unit,
        l.reps,
        l.warmup,
        l.completion_status
    INTO result
    FROM public.lifts l
    JOIN public.weights w ON l.weight_id = w.id
    WHERE l.user_id = p_user_id
      AND l.id = p_lift_id
    LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
