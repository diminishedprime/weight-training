-- Function: add_exercise_block
-- Creates an exercise_block and populates it with N sets of M reps for a given exercise_type and weight
CREATE OR REPLACE FUNCTION public.add_exercise_block(
    p_user_id uuid,
    p_exercise_type exercise_type_enum,
    p_equipment_type equipment_type_enum,
    p_weight numeric,
    p_sets integer,
    p_reps integer,
    p_name text
) RETURNS uuid AS $$
DECLARE
    v_block_id uuid := uuid_generate_v4();
    v_exercise_id uuid;
    v_weight_id uuid;
    v_set_idx integer;
BEGIN
    -- Insert exercise block
    INSERT INTO public.exercise_block (
        id, user_id, block_order, name, created_at, updated_at
    ) VALUES (
        v_block_id, p_user_id, 0, p_name, timezone('utc', now()), timezone('utc', now())
    );

    -- Insert weight row
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (p_weight, 'pounds') RETURNING id INTO v_weight_id;

    -- Insert exercises and link to block
    FOR v_set_idx IN 1..p_sets LOOP
        v_exercise_id := uuid_generate_v4();
        INSERT INTO public.exercises (
            id, user_id, exercise_type, equipment_type, performed_at, weight_id, reps, warmup, completion_status
        ) VALUES (
            v_exercise_id, p_user_id, p_exercise_type, p_equipment_type, NULL, v_weight_id, p_reps, false, 'not_completed'
        );
        INSERT INTO public.exercise_block_exercises (
            block_id, exercise_id, exercise_order
        ) VALUES (
            v_block_id, v_exercise_id, v_set_idx - 1
        );
    END LOOP;

    RETURN v_block_id;
END;
$$ LANGUAGE plpgsql;
