-- Function: wendler_exercise_block
-- Creates a wendler_metadata row and an exercise_block row, returning the new block id
CREATE OR REPLACE FUNCTION public.wendler_exercise_block(
    p_user_id uuid,
    p_training_max numeric,
    p_exercise_type exercise_type_enum,
    p_cycle_type wendler_cycle_type_enum,
    p_name text,
    p_increase_amount numeric DEFAULT 5.0
) RETURNS uuid AS $$
DECLARE
    v_wendler_metadata_id uuid := uuid_generate_v4();
    v_block_id uuid := uuid_generate_v4();
    v_exercise_ids uuid[] := ARRAY[]::uuid[];
    v_weight_ids uuid[] := ARRAY[]::uuid[];
    v_ratios numeric[];
    v_reps integer[];
    v_is_warmup boolean[];
    v_idx integer := 1;
    v_exercise_id uuid;
    v_weight_id uuid;
    v_bar_weight numeric := 45;
    v_working_weight numeric;
BEGIN
    -- Insert Wendler metadata
    INSERT INTO public.wendler_metadata (
        id, user_id, training_max, increase_amount, cycle_type, exercise_type, created_at, updated_at
    ) VALUES (
        v_wendler_metadata_id, p_user_id, p_training_max, p_increase_amount, p_cycle_type, p_exercise_type, timezone('utc', now()), timezone('utc', now())
    );

    -- Insert exercise block
    INSERT INTO public.exercise_block (
        id, user_id, wendler_metadata_id, block_order, name, created_at, updated_at
    ) VALUES (
        v_block_id, p_user_id, v_wendler_metadata_id, 0, p_name, timezone('utc', now()), timezone('utc', now())
    );

    -- Define ratios and reps for warmups and work sets based on cycle type
    IF p_cycle_type = '5' THEN
        -- Standard Wendler 5s: warmups then work sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6, 0.65, 0.75, 0.85];
        v_reps := ARRAY[5, 5, 3, 2, 5, 5, 5];
        v_is_warmup := ARRAY[true, true, true, true, false, false, false];
    ELSIF p_cycle_type = '3' THEN
        -- Standard Wendler 3s: warmups then work sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        v_reps := ARRAY[5, 5, 3, 2, 3, 3, 3];
        v_is_warmup := ARRAY[true, true, true, true, false, false, false];
    ELSIF p_cycle_type = '1' THEN
        -- Standard Wendler 5/3/1: warmups then work sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6, 0.75, 0.85, 0.95];
        v_reps := ARRAY[5, 5, 3, 2, 5, 3, 1];
        v_is_warmup := ARRAY[true, true, true, true, false, false, false];
    ELSIF p_cycle_type = 'deload' THEN
        -- Standard Wendler deload: warmups then light sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75];
        v_reps := ARRAY[5, 5, 5, 5, 5, 5, 5];
        v_is_warmup := ARRAY[true, true, true, true, false, false, false];
    ELSE
        RAISE EXCEPTION 'Unknown cycle type: %', p_cycle_type;
    END IF;

    FOR v_idx IN 1..array_length(v_ratios, 1) LOOP
        v_exercise_id := uuid_generate_v4();
        IF v_ratios[v_idx] = 0 THEN
            v_working_weight := v_bar_weight;
        ELSE
            v_working_weight := public.normalize_bar_weight_pounds(round(p_training_max * v_ratios[v_idx]));
        END IF;
        -- Get or insert weight row (if not null)
        IF v_working_weight IS NOT NULL THEN
            v_weight_id := public.get_weight(v_working_weight, 'pounds');
        ELSE
            v_weight_id := NULL;
        END IF;
        -- Insert exercise (no created_at field)
        INSERT INTO public.exercises (
            id, user_id, exercise_type, equipment_type, performed_at, weight_id, reps, warmup, completion_status
        ) VALUES (
            v_exercise_id, p_user_id, p_exercise_type, 'barbell', NULL, v_weight_id, v_reps[v_idx], v_is_warmup[v_idx], 'not_completed'
        );
        -- Insert into junction table
        INSERT INTO public.exercise_block_exercises (
            block_id, exercise_id, exercise_order
        ) VALUES (
            v_block_id, v_exercise_id, v_idx - 1
        );
    END LOOP;

    RETURN v_block_id;
END;
$$ LANGUAGE plpgsql;
