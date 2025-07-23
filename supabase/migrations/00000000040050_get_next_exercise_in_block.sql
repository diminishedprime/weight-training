CREATE OR REPLACE FUNCTION public.get_next_exercise_in_block (p_block_id uuid, p_exercise_id uuid) RETURNS uuid AS $$
DECLARE
  v_next_exercise_id uuid;
BEGIN
  SELECT ebe2.exercise_id INTO v_next_exercise_id
  FROM exercise_block_exercises ebe1
  JOIN exercise_block_exercises ebe2 ON ebe1.block_id = ebe2.block_id
  WHERE ebe1.block_id = p_block_id
    AND ebe1.exercise_id = p_exercise_id
    AND ebe2.exercise_order = ebe1.exercise_order + 1
  LIMIT 1;
  RETURN v_next_exercise_id;
END;
$$ LANGUAGE plpgsql STABLE;
