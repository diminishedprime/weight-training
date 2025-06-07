-- Function: create_exercise
CREATE OR REPLACE FUNCTION public.create_exercise(
    p_user_id uuid,
    p_exercise_type exercise_type_enum,
    p_equipment_type equipment_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'completed',
    p_relative_effort relative_effort_enum DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_weight_id uuid;
    v_exercise_id uuid;
BEGIN
    -- Insert weight and get its id
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;
    -- Insert exercise and get its id
    INSERT INTO public.exercises (
        user_id, exercise_type, equipment_type, performed_at, weight_id, reps, warmup, completion_status, relative_effort
    ) VALUES (
        p_user_id, p_exercise_type, p_equipment_type, p_performed_at, v_weight_id, p_reps, p_warmup, p_completion_status, p_relative_effort
    )
    RETURNING id INTO v_exercise_id;
    RETURN v_exercise_id;
END;
$$ LANGUAGE plpgsql;
