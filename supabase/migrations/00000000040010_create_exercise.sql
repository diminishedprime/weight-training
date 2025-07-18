CREATE OR REPLACE FUNCTION public.create_exercise (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_equipment_type equipment_type_enum,
  p_target_weight_value numeric,
  p_reps integer,
  p_actual_weight_value numeric DEFAULT NULL,
  p_weight_unit weight_unit_enum DEFAULT 'pounds',
  p_performed_at timestamptz DEFAULT NULL,
  p_warmup boolean DEFAULT false,
  p_is_amrap boolean DEFAULT false,
  p_completion_status completion_status_enum DEFAULT 'completed',
  p_relative_effort relative_effort_enum DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_exercise_id uuid;
BEGIN
    INSERT INTO public.exercises (
        user_id, exercise_type, equipment_type, performed_at, target_weight_value, actual_weight_value, weight_unit, reps, warmup, is_amrap, completion_status, notes, relative_effort
    ) VALUES (
        p_user_id, p_exercise_type, p_equipment_type, p_performed_at, p_target_weight_value, p_actual_weight_value, p_weight_unit, p_reps, p_warmup, p_is_amrap, p_completion_status, p_notes, p_relative_effort
    )
    RETURNING id INTO v_exercise_id;
    RETURN v_exercise_id;
END;
$$ LANGUAGE plpgsql;
