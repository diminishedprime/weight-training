-- -----------------------------------------------------------------------------
-- Function: public.create_wendler_exercise_block
--
-- Purpose: Template for creating an exercise block for a Wendler 5/3/1 cycle.
--
-- Arguments:
--   p_user_id UUID - The user for whom the block is being created.
--   p_exercise_type exercise_type_enum - The exercise type (e.g., 'bench_press').
--   p_cycle_type wendler_cycle_type_enum - The Wendler cycle type ('5', '3', '1', 'deload').
--   p_block_order INTEGER - The order of the block in the superblock/workout.
--
-- Returns:
--   UUID - The ID of the created exercise block.
--
-- This is a template function. Implementation to be completed.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_wendler_exercise_block (
  p_user_id UUID,
  p_exercise_type exercise_type_enum,
  p_cycle_type wendler_cycle_type_enum,
  p_block_order INTEGER,
  p_increase_amount_value NUMERIC,
  p_increase_amount_unit weight_unit_enum
) RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
    v_block_id UUID;
    v_exercise_id UUID;
    v_set_order INTEGER := 1;
    v_wendler_metadata_id UUID;
    v_training_max_value NUMERIC;
    v_training_max_unit weight_unit_enum;
BEGIN
    -- Look up the user's current training max for this exercise using get_target_max
    SELECT value, unit
      INTO v_training_max_value, v_training_max_unit
      FROM public.get_target_max(p_user_id, p_exercise_type);
    IF v_training_max_value IS NULL OR v_training_max_unit IS NULL THEN
        RAISE EXCEPTION 'No training max (target max) found for user % and exercise %', p_user_id, p_exercise_type;
    END IF;

    -- Always insert a new wendler_metadata row for this user/exercise/cycle
    INSERT INTO wendler_metadata (
        user_id,
        training_max_value,
        training_max_unit,
        increase_amount_value,
        increase_amount_unit,
        cycle_type,
        exercise_type
    ) VALUES (
        p_user_id,
        v_training_max_value,
        v_training_max_unit,
        p_increase_amount_value,
        p_increase_amount_unit,
        p_cycle_type,
        p_exercise_type
    ) RETURNING id INTO v_wendler_metadata_id;

    -- Insert the exercise block, linking to wendler_metadata
    INSERT INTO exercise_block (
        user_id,
        wendler_metadata_id,
        block_order,
        name
    ) VALUES (
        p_user_id,
        v_wendler_metadata_id,
        p_block_order,
        CONCAT('Wendler ', p_exercise_type)
    ) RETURNING id INTO v_block_id;

    -- 1. Empty bar set (8 reps)
    v_exercise_id := public.create_exercise(
        p_user_id,
        p_exercise_type,
        'barbell',
        public.normalize_bar_weight_pounds(0),
        8,
        v_training_max_unit,
        NULL,
        TRUE,
        'not_completed',
        NULL
    );
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
                p_user_id,
                p_exercise_type,
                'barbell',
                public.round_to_nearest_5(v_training_max_value * warmup_fractions[i]),
                warmup_reps[i],
                v_training_max_unit,
                NULL,
                TRUE,
                'not_completed',
                NULL
            );
            INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
            VALUES (v_block_id, v_exercise_id, v_set_order);
            v_set_order := v_set_order + 1;
        END LOOP;
    END;

    -- 5-7. Working sets (fractions and reps depend on cycle type)
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
                p_user_id,
                p_exercise_type,
                'barbell',
                public.round_to_nearest_5(v_training_max_value * working_fractions[i]),
                working_reps[i],
                v_training_max_unit,
                NULL,
                FALSE,
                'not_completed',
                NULL
            );
            INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
            VALUES (v_block_id, v_exercise_id, v_set_order);
            v_set_order := v_set_order + 1;
        END LOOP;
    END;

    RETURN v_block_id;
END;
$$;
