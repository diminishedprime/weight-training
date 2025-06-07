-- Function: create_lift
CREATE OR REPLACE FUNCTION public.create_lift(
    p_user_id uuid,
    p_lift_type lift_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'Completed'
) RETURNS uuid AS $$
DECLARE
    v_weight_id uuid;
    v_lift_id uuid;
BEGIN
    -- Insert weight and get its id
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;
    -- Insert lift and get its id
    INSERT INTO public.lifts (
        user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status
    ) VALUES (
        p_user_id, p_lift_type, p_performed_at, v_weight_id, p_reps, p_warmup, p_completion_status
    )
    RETURNING id INTO v_lift_id;
    RETURN v_lift_id;
END;
$$ LANGUAGE plpgsql;
