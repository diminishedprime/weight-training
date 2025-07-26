CREATE OR REPLACE FUNCTION public.update_exercise_for_user (
  p_exercise_id uuid,
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_target_weight_value numeric,
  p_reps integer,
  p_actual_weight_value numeric DEFAULT NULL,
  p_weight_unit weight_unit_enum DEFAULT 'pounds',
  p_performed_at timestamptz DEFAULT NULL,
  p_is_warmup boolean DEFAULT false,
  p_is_amrap boolean DEFAULT false,
  p_completion_status completion_status_enum DEFAULT 'completed',
  p_notes text DEFAULT NULL,
  p_perceived_effort perceived_effort_enum DEFAULT NULL
) RETURNS void AS $$
BEGIN
    UPDATE public.exercises
    SET
        exercise_type = p_exercise_type,
        performed_at = p_performed_at,
        target_weight_value = p_target_weight_value,
        actual_weight_value = p_actual_weight_value,
        weight_unit = p_weight_unit,
        reps = p_reps,
        is_warmup = p_is_warmup,
        is_amrap = p_is_amrap,
        completion_status = p_completion_status,
        notes = p_notes,
        perceived_effort = p_perceived_effort
    WHERE id = p_exercise_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
