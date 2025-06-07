-- Function: create_wendler_exercise_session_5s
CREATE OR REPLACE FUNCTION public.create_wendler_exercise_session_5s(
    p_user_id uuid,
    p_training_max_lbs numeric(5,2),
    p_increase_amount_lbs numeric(5,2),
    p_exercise_type exercise_type_enum
) RETURNS uuid AS $$
DECLARE
    v_wendler_id uuid;
    v_exercise_group_id uuid := uuid_generate_v4();
    v_training_max_id uuid;
    v_increase_amount_id uuid;
    v_training_max numeric(5,2) := p_training_max_lbs;
    v_emptybar_weight_id uuid;
    v_weight_id uuid;
    v_exercise_id uuid;
    v_position integer := 1;
BEGIN
    -- Insert the training max as a weight (in pounds)
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_training_max_lbs, 'pounds')
    RETURNING id INTO v_training_max_id;
    -- Insert the increase amount as a weight (in pounds)
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_increase_amount_lbs, 'pounds')
    RETURNING id INTO v_increase_amount_id;
    -- Insert Wendler metadata
    INSERT INTO public.wendler_metadata (training_max_id, increase_amount_id, cycle_type, exercise_type)
    VALUES (v_training_max_id, v_increase_amount_id, '5', p_exercise_type)
    RETURNING id INTO v_wendler_id;
    -- Insert exercise group with Wendler metadata
    INSERT INTO public.exercise_group (id, user_id, wendler_id)
    VALUES (v_exercise_group_id, p_user_id, v_wendler_id);
    -- 1. Warmup: empty bar (45 lbs) for 8 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (45, 'pounds') RETURNING id INTO v_emptybar_weight_id;
    INSERT INTO public.exercises (user_id, exercise_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_exercise_type, NULL, v_emptybar_weight_id, 8, true, 'Not Completed')
    RETURNING id INTO v_exercise_id;
    INSERT INTO public.exercise_block (exercise_group_id, exercise_id, block_order) VALUES (v_exercise_group_id, v_exercise_id, v_position);
    v_position := v_position + 1;
    -- 2. Warmup: 0.3 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.3), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.exercises (user_id, exercise_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_exercise_type, NULL, v_weight_id, 5, true, 'Not Completed')
    RETURNING id INTO v_exercise_id;
    INSERT INTO public.exercise_block (exercise_group_id, exercise_id, block_order) VALUES (v_exercise_group_id, v_exercise_id, v_position);
    v_position := v_position + 1;
    -- 3. Warmup: 0.45 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.45), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.exercises (user_id, exercise_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_exercise_type, NULL, v_weight_id, 5, true, 'Not Completed')
    RETURNING id INTO v_exercise_id;
    INSERT INTO public.exercise_block (exercise_group_id, exercise_id, block_order) VALUES (v_exercise_group_id, v_exercise_id, v_position);
    v_position := v_position + 1;
    -- 4. Warmup: 0.55 * training max for 3 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.55), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.exercises (user_id, exercise_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_exercise_type, NULL, v_weight_id, 3, true, 'Not Completed')
    RETURNING id INTO v_exercise_id;
    INSERT INTO public.exercise_block (exercise_group_id, exercise_id, block_order) VALUES (v_exercise_group_id, v_exercise_id, v_position);
    v_position := v_position + 1;
    -- 5. Working set: 0.65 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.65), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.exercises (user_id, exercise_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_exercise_type, NULL, v_weight_id, 5, false, 'Not Completed')
    RETURNING id INTO v_exercise_id;
    INSERT INTO public.exercise_block (exercise_group_id, exercise_id, block_order) VALUES (v_exercise_group_id, v_exercise_id, v_position);
    v_position := v_position + 1;
    -- 6. Working set: 0.75 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.75), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.exercises (user_id, exercise_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_exercise_type, NULL, v_weight_id, 5, false, 'Not Completed')
    RETURNING id INTO v_exercise_id;
    INSERT INTO public.exercise_block (exercise_group_id, exercise_id, block_order) VALUES (v_exercise_group_id, v_exercise_id, v_position);
    v_position := v_position + 1;
    -- 7. Working set: 0.85 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.85), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.exercises (user_id, exercise_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_exercise_type, NULL, v_weight_id, 5, false, 'Not Completed')
    RETURNING id INTO v_exercise_id;
    INSERT INTO public.exercise_block (exercise_group_id, exercise_id, block_order) VALUES (v_exercise_group_id, v_exercise_id, v_position);
    RETURN v_exercise_group_id;
END;
$$ LANGUAGE plpgsql;
