CREATE OR REPLACE FUNCTION _impl.set_active_exercise (
  p_user_id uuid,
  p_block_id uuid,
  p_exercise_id uuid
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.exercise_block
  SET active_exercise_id = p_exercise_id
  WHERE id = p_block_id AND user_id = p_user_id;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'set_active_block_result'
  ) THEN
    CREATE TYPE public.set_active_block_result AS (
      active_block_id uuid,
      active_exercise_id uuid,
      superblock public.get_perform_superblock_result
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.set_active_block (
  p_user_id uuid,
  p_superblock_id uuid,
  p_block_id uuid
) RETURNS public.set_active_block_result LANGUAGE plpgsql AS $$
DECLARE
  v_active_exercise_id uuid;
  v_first_exercise_id uuid;
  v_result public.set_active_block_result;
BEGIN
  UPDATE public.exercise_superblock
  SET active_block_id = p_block_id
  WHERE id = p_superblock_id AND user_id = p_user_id;

  -- fetch the currently active exercise for the block.
  SELECT active_exercise_id INTO v_active_exercise_id
  FROM public.exercise_block
  WHERE id = p_block_id AND user_id = p_user_id;

  -- Set the first exercise as active if no active exercise is set
  IF v_active_exercise_id IS NULL THEN
    SELECT ebe.exercise_id INTO v_first_exercise_id
    FROM public.exercise_block_exercises ebe
    WHERE ebe.block_id = p_block_id
    ORDER BY ebe.exercise_order ASC
    LIMIT 1;

    IF v_first_exercise_id IS NOT NULL THEN
      PERFORM _impl.set_active_exercise(
        p_user_id => p_user_id,
        p_block_id => p_block_id,
        p_exercise_id => v_first_exercise_id
      );
      v_active_exercise_id := v_first_exercise_id;
    END IF;
  END IF;

  v_result.active_block_id := p_block_id;
  v_result.active_exercise_id := v_active_exercise_id;


  -- Fetch the perform superblock result and set it in the return struct
  SELECT public.get_perform_superblock(p_user_id, p_superblock_id) INTO v_result.superblock;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.finish_exercise (
  p_user_id uuid,
  p_superblock_id uuid,
  p_block_id uuid,
  p_exercise_id uuid,
  p_actual_weight_value numeric,
  p_reps integer,
  p_is_warmup boolean,
  p_is_amrap boolean,
  p_notes text DEFAULT NULL,
  p_perceived_effort perceived_effort_enum DEFAULT NULL
) RETURNS public.get_perform_superblock_result LANGUAGE plpgsql AS $$
DECLARE
  v_active_exercise_id uuid;
  v_next_exercise_id uuid;
  v_current_order integer;
  v_max_order integer;
  v_now timestamptz := now();
BEGIN
  UPDATE public.exercises
  SET completion_status = 'completed',
      actual_weight_value = p_actual_weight_value,
      performed_at = v_now,
      reps = p_reps,
      is_warmup = p_is_warmup,
      is_amrap = p_is_amrap,
      notes = p_notes,
      perceived_effort = p_perceived_effort
  WHERE id = p_exercise_id;

  -- Check that the block's active_exercise_id matches
  SELECT active_exercise_id INTO v_active_exercise_id
  FROM public.exercise_block
  WHERE id = p_block_id;

  IF v_active_exercise_id IS DISTINCT FROM p_exercise_id THEN
    RAISE EXCEPTION 'Active exercise mismatch: block % has active_exercise_id %, but % was passed', p_block_id, v_active_exercise_id, p_exercise_id;
  END IF;

  -- Find the current exercise order
  SELECT exercise_order INTO v_current_order
  FROM public.exercise_block_exercises
  WHERE block_id = p_block_id AND exercise_id = p_exercise_id;

  -- Find the max order in the block
  SELECT MAX(exercise_order) INTO v_max_order
  FROM public.exercise_block_exercises
  WHERE block_id = p_block_id;

  -- If this is the first exercise, set started_at to now, and mark as in_progress.
  IF v_current_order = 1 THEN
    UPDATE public.exercise_block
    SET started_at = v_now,
        completion_status = 'in_progress'
    WHERE id = p_block_id AND started_at IS NULL;
  END IF;

  -- If there is a next exercise, set it as active. Otherwise, mark block as completed.
  IF v_current_order IS NOT NULL AND v_current_order < v_max_order THEN
    SELECT exercise_id INTO v_next_exercise_id
    FROM public.exercise_block_exercises
    WHERE block_id = p_block_id AND exercise_order = v_current_order + 1;

    IF v_next_exercise_id IS NOT NULL THEN
      UPDATE public.exercise_block
      SET active_exercise_id = v_next_exercise_id
      WHERE id = p_block_id;
    END IF;
  ELSE
    -- Last exercise, mark block as completed
    UPDATE public.exercise_block
    SET completion_status = 'completed',
        active_exercise_id = NULL,
        completed_at = v_now
    WHERE id = p_block_id;
  END IF;
  -- TODO: check on if superblock is completed here too.

  RETURN public.get_perform_superblock(p_user_id, p_superblock_id);
END;
$$;
