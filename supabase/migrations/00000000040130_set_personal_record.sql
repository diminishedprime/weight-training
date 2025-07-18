CREATE OR REPLACE FUNCTION public.set_personal_record (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_reps integer,
  p_recorded_at timestamptz DEFAULT NULL,
  p_source update_source_enum DEFAULT 'manual',
  p_notes text DEFAULT NULL,
  p_exercise_id uuid DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_now timestamptz;
BEGIN
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));
  INSERT INTO public.personal_record_history (
    user_id, exercise_type, weight_value, weight_unit, reps, recorded_at, source, notes, exercise_id
  ) VALUES (
    p_user_id, p_exercise_type, p_weight_value, p_weight_unit, p_reps, v_now, p_source, p_notes, p_exercise_id
  );
END;
$$ LANGUAGE plpgsql;
