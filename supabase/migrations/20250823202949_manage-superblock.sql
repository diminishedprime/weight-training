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
  SELECT exercise_order INTO v_current_order
  FROM public.exercise_block_exercises
  WHERE block_id = p_block_id AND exercise_id = p_exercise_id;

  SELECT MAX(exercise_order) INTO v_max_order
  FROM public.exercise_block_exercises
  WHERE block_id = p_block_id;
  IF v_current_order = 1 THEN
    UPDATE public.exercise_block
    SET started_at = v_now,
        completion_status = 'in_progress'
    WHERE id = p_block_id AND started_at IS NULL;
  END IF;

  UPDATE public.exercise_superblock
  SET completion_status = 'in_progress', started_at = v_now
  WHERE id = p_superblock_id AND completion_status != 'in_progress' AND started_at IS NULL;

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

  END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM public.exercise_superblock_blocks esb
      JOIN public.exercise_block eb ON esb.block_id = eb.id
      WHERE esb.superblock_id = p_superblock_id
        AND eb.completion_status NOT IN ('completed', 'skipped', 'failed')
    ) THEN
      UPDATE public.exercise_superblock
      SET completion_status = 'completed', completed_at = v_now
      WHERE id = p_superblock_id;
    END IF;
END;
$$;
