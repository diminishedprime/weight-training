CREATE OR REPLACE FUNCTION _impl.update_completion_status (
  p_user_id uuid,
  p_superblock_id uuid,
  p_block_id uuid,
  p_exercise_id uuid
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_active_exercise_id uuid;
  v_next_exercise_id uuid;
  v_current_order integer;
  v_max_order integer;
  v_now timestamptz := now();
  v_next_block_id uuid;
BEGIN
  -- Find the current exercise order
  SELECT exercise_order INTO v_current_order
  FROM public.exercise_block_exercises
  WHERE block_id = p_block_id AND exercise_id = p_exercise_id;

  -- Find the max order in the block
  SELECT MAX(exercise_order) INTO v_max_order
  FROM public.exercise_block_exercises
  WHERE block_id = p_block_id;
  -- If this is the first exercise, set started_at to now, and mark as
  -- in_progress.
  IF v_current_order = 1 THEN
    UPDATE public.exercise_block
    SET started_at = v_now,
        completion_status = 'in_progress'
    WHERE id = p_block_id AND started_at IS NULL;
  END IF;

  -- If the superblock is not in progress, set it to in_progress with a
  -- started_at of now.
  UPDATE public.exercise_superblock
  SET completion_status = 'in_progress', started_at = v_now
  WHERE id = p_superblock_id AND completion_status != 'in_progress' AND started_at IS NULL;

  -- If there is a next exercise, set it as active. Otherwise, mark block as
  -- completed.
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

    SELECT eb.id INTO v_next_block_id
    FROM public.exercise_block eb
    JOIN public.exercise_superblock_blocks esb ON esb.block_id = eb.id
    WHERE esb.superblock_id = p_superblock_id
      AND eb.completion_status != 'completed'
    ORDER BY esb.superblock_order ASC
    LIMIT 1;

    IF v_next_block_id IS NOT NULL THEN
      UPDATE public.exercise_block
      SET completion_status = 'in_progress', started_at = v_now
      WHERE id = v_next_block_id AND started_at IS NULL;

      UPDATE public.exercise_superblock
      SET active_block_id = v_next_block_id
      WHERE id = p_superblock_id;
    ELSE
      -- If no incomplete blocks remain, mark superblock as completed
      UPDATE public.exercise_superblock
      SET completion_status = 'completed', completed_at = v_now, active_block_id = NULL
      WHERE id = p_superblock_id;
    END IF;
  END IF;

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

  PERFORM _impl.update_completion_status(
    p_user_id => p_user_id,
    p_superblock_id => p_superblock_id,
    p_block_id => p_block_id,
    p_exercise_id => p_exercise_id
  );

  RETURN public.get_perform_superblock(p_user_id, p_superblock_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.skip_exercise (
  p_user_id uuid,
  p_superblock_id uuid,
  p_block_id uuid,
  p_exercise_id uuid,
  p_notes text DEFAULT NULL
) RETURNS public.get_perform_superblock_result LANGUAGE plpgsql AS $$
DECLARE
  v_active_exercise_id uuid;
  v_now timestamptz := now();
BEGIN
  UPDATE public.exercises
  SET completion_status = 'skipped',
      performed_at = v_now,
      notes = p_notes
  WHERE id = p_exercise_id;

  PERFORM _impl.update_completion_status(
    p_user_id => p_user_id,
    p_superblock_id => p_superblock_id,
    p_block_id => p_block_id,
    p_exercise_id => p_exercise_id
  );

  RETURN public.get_perform_superblock(p_user_id, p_superblock_id);
END;
$$;

-- TODO - all of these should be abstracted quite a bit more since they mostly
-- have the same body.
CREATE OR REPLACE FUNCTION public.fail_exercise (
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
  v_now timestamptz := now();
BEGIN
  UPDATE public.exercises
  SET completion_status = 'failed',
      actual_weight_value = p_actual_weight_value,
      performed_at = v_now,
      reps = p_reps,
      is_warmup = p_is_warmup,
      is_amrap = p_is_amrap,
      notes = p_notes,
      perceived_effort = p_perceived_effort
  WHERE id = p_exercise_id;

  PERFORM _impl.update_completion_status(
    p_user_id => p_user_id,
    p_superblock_id => p_superblock_id,
    p_block_id => p_block_id,
    p_exercise_id => p_exercise_id
  );

  RETURN public.get_perform_superblock(p_user_id, p_superblock_id);
END;
$$;
