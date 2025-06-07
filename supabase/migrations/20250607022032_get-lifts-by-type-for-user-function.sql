-- Function: get_lifts_by_type_for_user
CREATE OR REPLACE FUNCTION public.get_lifts_by_type_for_user(
    p_user_id uuid,
    p_lift_type lift_type_enum
)
RETURNS TABLE (
    lift_id uuid,
    user_id uuid,
    lift_type lift_type_enum,
    performed_at timestamptz,
    weight_value numeric,
    weight_unit weight_unit_enum,
    reps integer,
    warmup boolean,
    completion_status completion_status_enum
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.user_id,
        l.lift_type,
        l.performed_at,
        w.weight_value,
        w.weight_unit,
        l.reps,
        l.warmup,
        l.completion_status
    FROM public.lifts l
    JOIN public.weights w ON l.weight_id = w.id
    WHERE l.user_id = p_user_id
      AND l.lift_type = p_lift_type
    ORDER BY l.performed_at DESC NULLS LAST
    LIMIT 30;
END;
$$ LANGUAGE plpgsql STABLE;
