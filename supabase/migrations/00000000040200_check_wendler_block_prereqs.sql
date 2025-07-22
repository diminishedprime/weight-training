DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_block_prereqs_row') THEN
    CREATE TYPE public.wendler_block_prereqs_row AS (
      is_target_max_set BOOLEAN,
      is_prev_cycle_unit_match BOOLEAN,
      has_no_target_max BOOLEAN,
      has_unit_mismatch BOOLEAN,
      prev_cycle_unit weight_unit_enum,
      current_unit weight_unit_enum,
      prev_training_max NUMERIC,
      current_training_max NUMERIC
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.check_wendler_block_prereqs (
  p_user_id UUID,
  p_exercise_type exercise_type_enum
) RETURNS wendler_block_prereqs_row LANGUAGE plpgsql AS $$
DECLARE
  v_current_training_max NUMERIC;
  v_current_unit weight_unit_enum;
  v_prev_training_max NUMERIC;
  v_prev_unit weight_unit_enum;
  result wendler_block_prereqs_row;
  has_no_target_max BOOLEAN := FALSE;
  has_unit_mismatch BOOLEAN := FALSE;
BEGIN
  -- Check if target max is set
  SELECT weight_value, weight_unit INTO v_current_training_max, v_current_unit
    FROM public.get_target_max(p_user_id, p_exercise_type);
  IF v_current_training_max IS NULL OR v_current_unit IS NULL THEN
    has_no_target_max := TRUE;
  END IF;

  -- Get previous cycle's training max and unit
  SELECT training_max_value, training_max_unit INTO v_prev_training_max, v_prev_unit
    FROM wendler_metadata
   WHERE user_id = p_user_id AND exercise_type = p_exercise_type
   ORDER BY created_at DESC
   LIMIT 1;

  IF v_prev_training_max IS NOT NULL AND v_prev_unit IS DISTINCT FROM v_current_unit THEN
    has_unit_mismatch := TRUE;
  END IF;

  result.is_target_max_set := v_current_training_max IS NOT NULL AND v_current_unit IS NOT NULL;
  result.is_prev_cycle_unit_match := (v_prev_training_max IS NULL) OR (v_prev_unit = v_current_unit);
  result.has_no_target_max := has_no_target_max;
  result.has_unit_mismatch := has_unit_mismatch;
  result.prev_cycle_unit := v_prev_unit;
  result.current_unit := v_current_unit;
  result.prev_training_max := v_prev_training_max;
  result.current_training_max := v_current_training_max;
  RETURN result;
END;
$$;
