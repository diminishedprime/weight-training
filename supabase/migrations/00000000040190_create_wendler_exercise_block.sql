-- TODO: I want to add in some wendler preferences such as the default bar to
-- use, and then make those be optional parameters here that use the default
-- value via coalesce.
CREATE OR REPLACE FUNCTION public.create_wendler_exercise_block (
  p_user_id UUID,
  p_exercise_type exercise_type_enum,
  p_cycle_type wendler_cycle_type_enum,
  p_block_name TEXT
) RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
    v_block_id UUID;
    v_exercise_id UUID;
    v_set_order INTEGER := 1;
    v_wendler_metadata_id UUID;
    v_training_max_value NUMERIC;
    v_training_max_unit weight_unit_enum;
    v_prev_training_max_value NUMERIC;
    v_prev_training_max_unit weight_unit_enum;
    v_increase_amount_value NUMERIC;
    v_increase_amount_unit weight_unit_enum;
BEGIN
    SELECT weight_value, weight_unit
      INTO v_training_max_value, v_training_max_unit
      FROM public.get_target_max(p_user_id, p_exercise_type);
    IF v_training_max_value IS NULL OR v_training_max_unit IS NULL THEN
        RAISE EXCEPTION 'No training max (target max) found for user % and exercise %', p_user_id, p_exercise_type;
    END IF;

    SELECT training_max_value, training_max_unit
      INTO v_prev_training_max_value, v_prev_training_max_unit
      FROM wendler_metadata
     WHERE user_id = p_user_id AND exercise_type = p_exercise_type
     ORDER BY created_at DESC
     LIMIT 1;

    IF v_prev_training_max_value IS NOT NULL THEN
        IF v_prev_training_max_unit IS DISTINCT FROM v_training_max_unit THEN
            RAISE EXCEPTION 'Unit mismatch: previous training max unit % does not match current unit % for user % and exercise %', v_prev_training_max_unit, v_training_max_unit, p_user_id, p_exercise_type;
        END IF;
    END IF;

    v_increase_amount_value := COALESCE(v_training_max_value - v_prev_training_max_value, v_training_max_value);
    v_increase_amount_unit := v_training_max_unit;

    INSERT INTO exercise_block (
        user_id,
        name,
        active_exercise_id
    ) VALUES (
        p_user_id,
        p_block_name,
        NULL -- will update after creating first exercise
    ) RETURNING id INTO v_block_id;

    -- 1. Empty bar set (8 reps)
    v_exercise_id := public.create_exercise(
        p_user_id => p_user_id::uuid,
        p_exercise_type => p_exercise_type::exercise_type_enum,
        p_equipment_type => 'barbell'::equipment_type_enum,
        -- TODO: this should use _sytem.normalize_bar_weight_pounds 
        --
        -- TODO: And really it shouldn't be normalizing at all since we're
        -- fancy.
        p_target_weight_value => public.normalize_bar_weight_pounds(0)::numeric,
        p_actual_weight_value => NULL,
        p_reps => 8::integer,
        p_weight_unit => v_training_max_unit::weight_unit_enum,
        p_performed_at => NULL::timestamptz,
        p_warmup => TRUE::boolean,
        p_is_amrap => FALSE::boolean,
        p_completion_status => 'not_completed'::completion_status_enum,
        p_perceived_effort => NULL::perceived_effort_enum,
        p_notes => NULL
    );

    -- Update exercise_block with the first active exercise
    UPDATE exercise_block SET active_exercise_id = v_exercise_id WHERE id = v_block_id;

    INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
    VALUES (v_block_id, v_exercise_id, v_set_order);
    v_set_order := v_set_order + 1;

    -- 2-4. Warm up sets: fractions and reps depend on cycle type
    DECLARE
        warmup_fractions NUMERIC[];
        warmup_reps INTEGER[];
    BEGIN
        IF p_cycle_type = '5' THEN
            warmup_fractions := ARRAY[0.35, 0.45, 0.55];
            warmup_reps := ARRAY[5, 4, 3];
        ELSIF p_cycle_type = '3' THEN
            warmup_fractions := ARRAY[0.4, 0.5, 0.6];
            warmup_reps := ARRAY[5, 4, 3];
        ELSIF p_cycle_type = '1' THEN
            warmup_fractions := ARRAY[0.45, 0.55, 0.65];
            warmup_reps := ARRAY[5, 4, 3];
        ELSE -- deload
            warmup_fractions := ARRAY[0.1, 0.2, 0.3];
            warmup_reps := ARRAY[5, 5, 5];
        END IF;
        FOR i IN 1..3 LOOP
            v_exercise_id := public.create_exercise(
                p_user_id => p_user_id::uuid,
                p_exercise_type => p_exercise_type::exercise_type_enum,
                p_equipment_type => 'barbell'::equipment_type_enum,
                p_target_weight_value => _system.round_to_nearest_5(v_training_max_value * warmup_fractions[i])::numeric,
                p_actual_weight_value => NULL,
                p_reps => warmup_reps[i]::integer,
                p_weight_unit => v_training_max_unit::weight_unit_enum,
                p_performed_at => NULL::timestamptz,
                p_warmup => TRUE::boolean,
                p_is_amrap => FALSE::boolean,
                p_completion_status => 'not_completed'::completion_status_enum,
                p_perceived_effort => NULL::perceived_effort_enum,
                p_notes => NULL
            );
            INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
            VALUES (v_block_id, v_exercise_id, v_set_order);
            v_set_order := v_set_order + 1;
        END LOOP;
    END;

    -- 5-7. Working sets (fractions and reps also depend on cycle type)
    DECLARE
        working_fractions NUMERIC[];
        working_reps INTEGER[];
    BEGIN
        IF p_cycle_type = '5' THEN
            working_fractions := ARRAY[0.65, 0.75, 0.85];
            working_reps := ARRAY[5, 5, 5];
        ELSIF p_cycle_type = '3' THEN
            working_fractions := ARRAY[0.70, 0.80, 0.90];
            working_reps := ARRAY[3, 3, 3];
        ELSIF p_cycle_type = '1' THEN
            working_fractions := ARRAY[0.75, 0.85, 0.95];
            working_reps := ARRAY[5, 3, 1];
        ELSE -- deload
            working_fractions := ARRAY[0.4, 0.5, 0.6];
            working_reps := ARRAY[5, 5, 5];
        END IF;
        FOR i IN 1..3 LOOP
            v_exercise_id := public.create_exercise(
                p_user_id => p_user_id::uuid,
                p_exercise_type => p_exercise_type::exercise_type_enum,
                p_equipment_type => 'barbell'::equipment_type_enum,
                p_target_weight_value => _system.round_to_nearest_5(v_training_max_value * working_fractions[i])::numeric,
                p_actual_weight_value => NULL,
                p_reps => working_reps[i]::integer,
                p_weight_unit => v_training_max_unit::weight_unit_enum,
                p_performed_at => NULL::timestamptz,
                p_warmup => FALSE::boolean,
                p_is_amrap => (i = 3)::boolean,
                p_completion_status => 'not_completed'::completion_status_enum,
                p_perceived_effort => NULL::perceived_effort_enum,
                p_notes => NULL
            );
            INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
            VALUES (v_block_id, v_exercise_id, v_set_order);
            v_set_order := v_set_order + 1;
        END LOOP;
    END;

    -- Now insert wendler_metadata with the block_id
    INSERT INTO wendler_metadata (
        block_id,
        user_id,
        training_max_value,
        training_max_unit,
        increase_amount_value,
        increase_amount_unit,
        cycle_type,
        exercise_type
    ) VALUES (
        v_block_id,
        p_user_id,
        v_training_max_value,
        v_training_max_unit,
        v_increase_amount_value,
        v_increase_amount_unit,
        p_cycle_type,
        p_exercise_type
    ) RETURNING id INTO v_wendler_metadata_id;

    RETURN v_block_id;
END;
$$;
