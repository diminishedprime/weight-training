-- Function: update_lift_for_user
CREATE OR REPLACE FUNCTION public.update_lift_for_user(
    p_lift_id uuid,
    p_user_id uuid,
    p_lift_type lift_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'Completed'
) RETURNS void AS $$
DECLARE
    v_weight_id uuid;
BEGIN
    -- Insert new weight and get its id
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;
    -- Update the lift row, only if it belongs to the user
    UPDATE public.lifts
    SET
        lift_type = p_lift_type,
        performed_at = p_performed_at,
        weight_id = v_weight_id,
        reps = p_reps,
        warmup = p_warmup,
        completion_status = p_completion_status
    WHERE id = p_lift_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
