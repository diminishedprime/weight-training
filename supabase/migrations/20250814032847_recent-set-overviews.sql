DROP FUNCTION public.recent_set_overviews;

DROP TYPE IF EXISTS public.recent_set_overview_result;

DROP TYPE IF EXISTS public.recent_set_overview;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'recent_set_exercise'
  ) THEN
    CREATE TYPE public.recent_set_exercise AS (
      id uuid,
      reps integer,
      weight numeric,
      perceived_effort perceived_effort_enum,
      completion_status completion_status_enum
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'recent_set_overview'
  ) THEN
    CREATE TYPE public.recent_set_overview AS (
      block_id uuid,
      exercises recent_set_exercise[],
      started_at timestamp with time zone,
      median_weight numeric,
      median_reps integer,
      highest_weight numeric,
      highest_reps integer
    );
  END IF;
END $$;

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
  limit_count integer := 3;
BEGIN
  SELECT ARRAY(
    SELECT ROW(
      b.id,
      ex.exercises,
      b.started_at,
      ex.median_weight,
      ex.median_reps,
      ex.highest_weight,
      ex.highest_reps
    )::public.recent_set_overview
    FROM public.exercise_block b
    JOIN LATERAL (
      WITH filtered_exercises AS (
        SELECT
          e.id,
          e.reps,
          COALESCE(e.actual_weight_value, e.target_weight_value) AS weight,
          e.perceived_effort,
          e.completion_status
        FROM public.exercises e
        JOIN public.exercise_block_exercises ebe ON ebe.exercise_id = e.id
        WHERE ebe.block_id = b.id
          AND e.user_id = p_user_id
          AND e.completion_status <> 'not_started'
        ORDER BY e.performed_at ASC
      )
      SELECT
        ARRAY(
          SELECT ROW(id, reps, weight, perceived_effort, completion_status)::public.recent_set_exercise
          FROM filtered_exercises
        ) AS exercises,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY weight) AS median_weight,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY reps) AS median_reps,
        MAX(weight) AS highest_weight,
        MAX(reps) AS highest_reps
      FROM filtered_exercises
    ) ex ON TRUE
    WHERE b.exercise_type = p_exercise_type
      AND b.completion_status <> 'not_started'
      AND b.user_id = p_user_id
    ORDER BY b.started_at DESC
    LIMIT limit_count
  ) INTO result.overviews;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
