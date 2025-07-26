CREATE OR REPLACE FUNCTION public.set_active_exercise_or_complete_block (
  p_block_id uuid,
  p_user_id uuid,
  p_current_exercise_id uuid,
  p_completed_at timestamptz
) RETURNS void AS $$
DECLARE
  v_next_exercise_id uuid;
BEGIN
  v_next_exercise_id := get_next_exercise_in_block(p_block_id, p_current_exercise_id);
  IF v_next_exercise_id IS NOT NULL THEN
    UPDATE exercise_block
    SET active_exercise_id = v_next_exercise_id
    WHERE id = p_block_id AND user_id = p_user_id;
  ELSE
    UPDATE exercise_block
    SET active_exercise_id = NULL,
        completion_status = 'completed',
        completed_at = p_completed_at
    WHERE id = p_block_id AND user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
