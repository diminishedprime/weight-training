CREATE OR REPLACE FUNCTION public.create_exercise (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_equipment_type equipment_type_enum,
  p_target_weight_value numeric,
  p_reps integer,
  p_actual_weight_value numeric DEFAULT NULL,
  p_weight_unit weight_unit_enum DEFAULT 'pounds',
  -- TODO: performed_at should default to now if completion status defaults to
  -- completed...
  p_performed_at timestamptz DEFAULT NULL,
  p_is_warmup boolean DEFAULT false,
  p_is_amrap boolean DEFAULT false,
  p_completion_status completion_status_enum DEFAULT 'completed',
  p_perceived_effort perceived_effort_enum DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_exercise_id uuid;
BEGIN
-- TODO this should check some invariants. For example, if the completion status
-- is completed, then it needs a performed_at timestamp.
    INSERT INTO public.exercises (
        user_id, exercise_type, equipment_type, performed_at, target_weight_value, actual_weight_value, weight_unit, reps, is_warmup, is_amrap, completion_status, notes, perceived_effort, update_time
    ) VALUES (
        p_user_id, p_exercise_type, p_equipment_type, p_performed_at, p_target_weight_value, p_actual_weight_value, p_weight_unit, p_reps, p_is_warmup, p_is_amrap, p_completion_status, p_notes, p_perceived_effort, p_performed_at
    )
    RETURNING id INTO v_exercise_id;
    RETURN v_exercise_id;
END;
$$ LANGUAGE plpgsql;
