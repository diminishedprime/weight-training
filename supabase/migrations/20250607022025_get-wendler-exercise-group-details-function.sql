-- Function: get_wendler_exercise_group_details
CREATE OR REPLACE FUNCTION public.get_wendler_exercise_group_details(p_exercise_group_id uuid)
RETURNS TABLE (
  exercise_group_id uuid,
  user_id uuid,
  cycle_type text,
  exercise_type text,
  training_max numeric(5,2),
  training_max_unit text,
  increase_amount numeric(5,2),
  increase_amount_unit text,
  exercise_id uuid,
  performed_at timestamp with time zone,
  reps integer,
  warmup boolean,
  completion_status text,
  weight_value numeric(5,2),
  weight_unit text,
  block_order integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    eg.id AS exercise_group_id,
    eg.user_id,
    wm.cycle_type,
    wm.exercise_type,
    tm.weight_value AS training_max,
    tm.weight_unit AS training_max_unit,
    ia.weight_value AS increase_amount,
    ia.weight_unit AS increase_amount_unit,
    e.id AS exercise_id,
    e.performed_at,
    e.reps,
    e.warmup,
    e.completion_status,
    w.weight_value,
    w.weight_unit,
    eb.block_order
  FROM public.exercise_group eg
  JOIN public.wendler_metadata wm ON eg.wendler_id = wm.id
  JOIN public.weights tm ON wm.training_max_id = tm.id
  JOIN public.weights ia ON wm.increase_amount_id = ia.id
  JOIN public.exercise_block eb ON eb.exercise_group_id = eg.id
  JOIN public.exercises e ON eb.exercise_id = e.id
  JOIN public.weights w ON e.weight_id = w.id
  WHERE eg.id = p_exercise_group_id
  ORDER BY eb.block_order;
END;
$$ LANGUAGE plpgsql STABLE;
