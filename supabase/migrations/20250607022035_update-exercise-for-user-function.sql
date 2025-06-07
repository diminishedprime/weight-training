-- Function: update_exercise_for_user
CREATE OR REPLACE FUNCTION public.update_exercise_for_user(
    p_exercise_id uuid,
    p_user_id uuid,
    p_exercise_type exercise_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'completed',
    p_notes text DEFAULT NULL,
    p_relative_effort relative_effort_enum DEFAULT NULL
) RETURNS void AS $$
DECLARE
    v_weight_id uuid;
BEGIN
    -- Insert new weight and get its id
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;
    -- Update the exercise row, only if it belongs to the user
    UPDATE public.exercises
    SET
        exercise_type = p_exercise_type,
        performed_at = p_performed_at,
        weight_id = v_weight_id,
        reps = p_reps,
        warmup = p_warmup,
        completion_status = p_completion_status,
        notes = p_notes,
        relative_effort = p_relative_effort
    WHERE id = p_exercise_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
