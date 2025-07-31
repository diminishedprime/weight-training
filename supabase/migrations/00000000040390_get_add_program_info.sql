DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'get_add_program_info_result') THEN
    CREATE TYPE public.get_add_program_info_result AS (
      user_id uuid,
      squat_target_max numeric,
      bench_press_target_max numeric,
      deadlift_target_max numeric,
      overhead_press_target_max numeric,
      program_name text,
      old_data_warning timestamptz
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_add_program_info (p_user_id uuid) RETURNS public.get_add_program_info_result AS $$
DECLARE
  v_program_id uuid;
  v_cycle_id uuid;
  v_cycle_started_at timestamptz;
  v_squat numeric := 0;
  v_bench numeric := 0;
  v_deadlift numeric := 0;
  v_ohp numeric := 0;
  v_old_data_warning timestamptz := NULL;
  v_program_count integer := 0;
  v_program_name text := NULL;
BEGIN
  -- Count total number of programs for the user
  SELECT COUNT(*) INTO v_program_count FROM public.wendler_program WHERE user_id = p_user_id;
  v_program_name := 'Wendler Program ' || (v_program_count + 1);
  SELECT wp.id INTO v_program_id
  FROM public.wendler_program wp
  LEFT JOIN LATERAL (
    SELECT MIN(eb.started_at) AS started_at
    FROM public.wendler_program_cycle wpc
    JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
    JOIN public.exercise_block eb ON wpcm.block_id = eb.id
    WHERE wpc.wendler_program_id = wp.id AND eb.started_at IS NOT NULL
  ) prog_start ON TRUE
  WHERE wp.user_id = p_user_id
  ORDER BY prog_start.started_at DESC NULLS LAST
  LIMIT 1;

  IF v_program_id IS NOT NULL THEN
    -- Find most recent cycle for that program (by id desc as fallback)
    SELECT id, (
      SELECT MIN(eb.started_at)
      FROM public.wendler_program_cycle_movement wpcm
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpcm.wendler_program_cycle_id = wpc.id AND eb.started_at IS NOT NULL
    ) AS started_at
    INTO v_cycle_id, v_cycle_started_at
    FROM public.wendler_program_cycle wpc
    WHERE wendler_program_id = v_program_id AND user_id = p_user_id
    ORDER BY id DESC
    LIMIT 1;

    IF v_cycle_id IS NOT NULL THEN
      -- For each main lift, get the most recent training_max_value by block's started_at
      SELECT wpcm.training_max_value INTO v_squat
      FROM public.wendler_program_cycle_movement wpcm
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpcm.wendler_program_cycle_id = v_cycle_id AND wpcm.user_id = p_user_id AND wpcm.exercise_type = 'barbell_back_squat'
      ORDER BY eb.started_at DESC NULLS LAST
      LIMIT 1;

      SELECT wpcm.training_max_value INTO v_bench
      FROM public.wendler_program_cycle_movement wpcm
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpcm.wendler_program_cycle_id = v_cycle_id AND wpcm.user_id = p_user_id AND wpcm.exercise_type = 'barbell_bench_press'
      ORDER BY eb.started_at DESC NULLS LAST
      LIMIT 1;

      SELECT wpcm.training_max_value INTO v_deadlift
      FROM public.wendler_program_cycle_movement wpcm
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpcm.wendler_program_cycle_id = v_cycle_id AND wpcm.user_id = p_user_id AND wpcm.exercise_type = 'barbell_deadlift'
      ORDER BY eb.started_at DESC NULLS LAST
      LIMIT 1;

      SELECT wpcm.training_max_value INTO v_ohp
      FROM public.wendler_program_cycle_movement wpcm
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpcm.wendler_program_cycle_id = v_cycle_id AND wpcm.user_id = p_user_id AND wpcm.exercise_type = 'barbell_overhead_press'
      ORDER BY eb.started_at DESC NULLS LAST
      LIMIT 1;

      -- Set old_data_warning if cycle started_at is more than 6 months ago
      IF v_cycle_started_at IS NOT NULL AND v_cycle_started_at < (now() - INTERVAL '6 months') THEN
        v_old_data_warning := v_cycle_started_at;
      END IF;
    END IF;
  END IF;

  RETURN (
    p_user_id,
    COALESCE(v_squat, 0),
    COALESCE(v_bench, 0),
    COALESCE(v_deadlift, 0),
    COALESCE(v_ohp, 0),
    v_program_name,
    v_old_data_warning
  );
END;
$$ LANGUAGE plpgsql STABLE;
