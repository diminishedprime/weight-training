-- Function: get_exercises_by_type_for_user
CREATE OR REPLACE FUNCTION public.get_exercises_by_type_for_user(
    p_user_id uuid,
    p_exercise_type exercise_type_enum
)
RETURNS TABLE (
    exercise_id uuid,
    user_id uuid,
    exercise_type exercise_type_enum,
    equipment_type equipment_type_enum,
    performed_at timestamptz,
    weight_value numeric,
    weight_unit weight_unit_enum,
    reps integer,
    warmup boolean,
    completion_status completion_status_enum,
    notes text
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.user_id,
        e.exercise_type,
        e.equipment_type,
        e.performed_at,
        w.weight_value,
        w.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.notes
    FROM public.exercises e
    JOIN public.weights w ON e.weight_id = w.id
    WHERE e.user_id = p_user_id
      AND e.exercise_type = p_exercise_type
    ORDER BY e.performed_at DESC NULLS LAST
    LIMIT 30;
END;
$$ LANGUAGE plpgsql STABLE;
