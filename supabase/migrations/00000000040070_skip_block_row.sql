CREATE OR REPLACE FUNCTION public.skip_block_row (
  p_user_id uuid,
  p_block_id uuid,
  p_exercise_id uuid,
  p_notes text DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_performed_at timestamptz := now();
BEGIN
  UPDATE exercises e
  SET completion_status = 'skipped',
      notes = COALESCE(p_notes, e.notes),
      update_time = v_performed_at,
      performed_at = v_performed_at
  FROM exercise_block_exercises ebe
  JOIN exercise_block b ON ebe.block_id = b.id
  WHERE e.id = ebe.exercise_id
    AND ebe.block_id = p_block_id
    AND ebe.exercise_id = p_exercise_id
    AND b.user_id = p_user_id;
  PERFORM set_active_exercise_or_complete_block(p_block_id, p_user_id, p_exercise_id, v_performed_at);
END;
$$ LANGUAGE plpgsql;
