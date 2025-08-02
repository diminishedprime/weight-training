DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_movement_overview') THEN
    CREATE TYPE public.wendler_movement_overview AS (
      id uuid,
      training_max_value numeric,
      increase_amount_value numeric,
      exercise_type exercise_type_enum,
      weight_unit weight_unit_enum
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_program_overview') THEN
    CREATE TYPE public.wendler_program_overview AS (
      id uuid,
      user_id uuid,
      name text,
      started_at timestamptz,
      completed_at timestamptz,
      notes text,
      movement_overviews public.wendler_movement_overview[]
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'get_wendler_program_overviews_result') THEN
    CREATE TYPE public.get_wendler_program_overviews_result AS (
      program_overviews public.wendler_program_overview[],
      page_count integer
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_wendler_program_overviews (p_user_id uuid, p_page_num integer) RETURNS public.get_wendler_program_overviews_result AS $$
DECLARE
  p_limit integer := 10;
  v_offset integer := (p_page_num - 1) * p_limit;
  v_program_overviews public.wendler_program_overview[];
  v_page_count integer;
BEGIN
  SELECT ARRAY(
    SELECT ROW(
      wp.id,
      wp.user_id,
      wp.name,
      wp.started_at,
      wp.completed_at,
      wp.notes,
      (
        SELECT ARRAY(
          SELECT ROW(
            wpcm.id,
            wmm.target_max_value,
            wmm.increase_amount_value,
            wpcm.exercise_type,
            wmm.weight_unit
          )::public.wendler_movement_overview
          FROM (
            SELECT DISTINCT ON (wpcm.exercise_type) wpcm.*
            FROM public.wendler_program wp2
            JOIN public.wendler_program_cycle wpc ON wpc.wendler_program_id = wp2.id
            JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
            WHERE wp2.id = wp.id
              AND wpcm.exercise_type IN (
                'barbell_back_squat',
                'barbell_bench_press',
                'barbell_overhead_press',
                'barbell_deadlift'
              )
            ORDER BY wpcm.exercise_type, wpcm.id
          ) wpcm
          JOIN public.wendler_movement_max wmm ON wpcm.movement_max_id = wmm.id
        )
      )
    )::public.wendler_program_overview
    FROM public.wendler_program wp
    WHERE wp.user_id = p_user_id
    ORDER BY wp.program_order DESC
    LIMIT p_limit OFFSET v_offset
  ) INTO v_program_overviews;

  SELECT CEIL(COUNT(*)::numeric / p_limit)::integer INTO v_page_count
  FROM public.wendler_program
  WHERE user_id = p_user_id;

  RETURN (
    v_program_overviews,
    v_page_count
  );
END;
$$ LANGUAGE plpgsql STABLE;
