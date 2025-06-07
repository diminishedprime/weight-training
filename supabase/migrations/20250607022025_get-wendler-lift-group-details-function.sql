-- Function: get_wendler_lift_group_details
CREATE OR REPLACE FUNCTION public.get_wendler_lift_group_details(p_lift_group_id uuid)
RETURNS TABLE (
  lift_group_id uuid,
  user_id uuid,
  cycle_type text,
  lift_type text,
  training_max numeric(5,2),
  training_max_unit text,
  increase_amount numeric(5,2),
  increase_amount_unit text,
  lift_id uuid,
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
    lg.id AS lift_group_id,
    lg.user_id,
    wm.cycle_type,
    wm.lift_type,
    tm.weight_value AS training_max,
    tm.weight_unit AS training_max_unit,
    ia.weight_value AS increase_amount,
    ia.weight_unit AS increase_amount_unit,
    l.id AS lift_id,
    l.performed_at,
    l.reps,
    l.warmup,
    l.completion_status,
    w.weight_value,
    w.weight_unit,
    eb.block_order
  FROM public.lift_group lg
  JOIN public.wendler_metadata wm ON lg.wendler_id = wm.id
  JOIN public.weights tm ON wm.training_max_id = tm.id
  JOIN public.weights ia ON wm.increase_amount_id = ia.id
  JOIN public.exercise_block eb ON eb.lift_group_id = lg.id
  JOIN public.lifts l ON eb.lift_id = l.id
  JOIN public.weights w ON l.weight_id = w.id
  WHERE lg.id = p_lift_group_id
  ORDER BY eb.block_order;
END;
$$ LANGUAGE plpgsql STABLE;
