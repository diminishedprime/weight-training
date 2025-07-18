CREATE OR REPLACE FUNCTION public.set_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_value numeric,
  p_unit weight_unit_enum,
  p_recorded_at timestamptz DEFAULT NULL,
  p_source update_source_enum DEFAULT 'manual'
) RETURNS void AS $$
DECLARE
  v_now timestamptz;
BEGIN
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));
  INSERT INTO public.target_max_history (
    user_id, exercise_type, weight_value, weight_unit, recorded_at, source
  ) VALUES (
    p_user_id, p_exercise_type, p_value, p_unit, v_now, p_source
  );
END;
$$ LANGUAGE plpgsql;
