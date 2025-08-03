-- Create composite type for a single set overview
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'recent_set_overview'
  ) THEN
    CREATE TYPE public.recent_set_overview AS (
      average_reps numeric,
      average_weight numeric,
      started_at timestamp with time zone
    );
  END IF;
END $$;

-- Create composite type for the result (array of set overviews)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'recent_set_overview_result'
  ) THEN
    CREATE TYPE public.recent_set_overview_result AS (
      overviews public.recent_set_overview[]
    );
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.recent_set_overviews (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS public.recent_set_overview_result AS $$
DECLARE
  result public.recent_set_overview_result;
  limit_count integer := 5;
BEGIN
  SELECT ARRAY(
    SELECT ROW(
      AVG(e.reps)::numeric,
      AVG(e.actual_weight_value)::numeric,
      b.started_at
    )::public.recent_set_overview
    FROM public.exercises e
    JOIN public.exercise_block_exercises ebe ON ebe.exercise_id = e.id
    JOIN public.exercise_block b ON b.id = ebe.block_id
    WHERE e.user_id = p_user_id
      AND b.exercise_type = p_exercise_type
      AND e.is_warmup = false
      AND e.actual_weight_value IS NOT NULL
      AND e.reps IS NOT NULL
      AND e.performed_at IS NOT NULL
      AND e.completion_status = 'completed'
    GROUP BY b.id
    ORDER BY MAX(e.performed_at) DESC
    LIMIT limit_count
  ) INTO result.overviews;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
