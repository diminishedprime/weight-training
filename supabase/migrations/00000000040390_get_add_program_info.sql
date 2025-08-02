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
  -- TODO: Update this logic once we actually have completed_at in the relevant
  -- tables.
  v_old_data_warning timestamptz := NULL;
  v_program_count integer := 0;
  v_program_name text := NULL;
BEGIN
  -- Count total number of programs for the user
  SELECT COUNT(*) INTO v_program_count FROM public.wendler_program WHERE user_id = p_user_id;
  v_program_name := 'Wendler Program ' || (v_program_count + 1);


  -- Use program_order to find the most recent program
  SELECT id INTO v_program_id
  FROM public.wendler_program
  WHERE user_id = p_user_id
  ORDER BY program_order DESC, id DESC
  LIMIT 1;

  IF v_program_id IS NOT NULL THEN
    -- For each main lift, get a target_max_value of the right exercise_type
    SELECT wmm.target_max_value INTO v_squat
    FROM public.wendler_program_cycle wpc
    JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
    JOIN public.wendler_movement_max wmm ON wpcm.movement_max_id = wmm.id
    WHERE wpc.wendler_program_id = v_program_id AND wpc.user_id = p_user_id AND wpcm.exercise_type = 'barbell_back_squat'
    LIMIT 1;

    SELECT wmm.target_max_value INTO v_bench
    FROM public.wendler_program_cycle wpc
    JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
    JOIN public.wendler_movement_max wmm ON wpcm.movement_max_id = wmm.id
    WHERE wpc.wendler_program_id = v_program_id AND wpc.user_id = p_user_id AND wpcm.exercise_type = 'barbell_bench_press'
    LIMIT 1;

    SELECT wmm.target_max_value INTO v_deadlift
    FROM public.wendler_program_cycle wpc
    JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
    JOIN public.wendler_movement_max wmm ON wpcm.movement_max_id = wmm.id
    WHERE wpc.wendler_program_id = v_program_id AND wpc.user_id = p_user_id AND wpcm.exercise_type = 'barbell_deadlift'
    LIMIT 1;

    SELECT wmm.target_max_value INTO v_ohp
    FROM public.wendler_program_cycle wpc
    JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
    JOIN public.wendler_movement_max wmm ON wpcm.movement_max_id = wmm.id
    WHERE wpc.wendler_program_id = v_program_id AND wpc.user_id = p_user_id AND wpcm.exercise_type = 'barbell_overhead_press'
    LIMIT 1;
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
