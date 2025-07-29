CREATE OR REPLACE FUNCTION _system.cleanup_wendler_2 () RETURNS void AS $$
DECLARE
    v_rec RECORD;
    v_rec_inner RECORD;
    v_cycle RECORD;
    v_block_id uuid;
    v_cycle_type wendler_cycle_type_enum;
    v_actual_weight numeric;
    v_new_target_max numeric;
    v_target_max_arr numeric[];
    v_median_target_max numeric;
    v_rounded_target_max numeric;
    v_cycle_types wendler_cycle_type_enum[] := ARRAY['5', '3', '1', 'deload'];
    v_user_id uuid := '97097295-6eb1-4824-8bfa-8984cf9bea6b';
BEGIN
    -- For each Wendler program movement, recalculate target max for each cycle
    FOR v_rec IN (
        SELECT wpm.id AS movement_id, wpm.user_id, wpm.exercise_type, wpm.wendler_program_id
        FROM public.wendler_program_movement wpm
        WHERE wpm.user_id = v_user_id
    ) LOOP
        -- Array to hold up to 3 calculated target max values
        v_target_max_arr := ARRAY[]::numeric[];
        FOR v_cycle IN SELECT unnest(v_cycle_types) AS cycle_type LOOP
            -- Find the block for this movement and cycle
            SELECT wpm_block.block_id INTO v_block_id
            FROM public.wendler_program_movement_block wpm_block
            JOIN public.exercise_block eb ON wpm_block.block_id = eb.id
            WHERE wpm_block.movement_id = v_rec.movement_id
              AND wpm_block.cycle_type = v_cycle.cycle_type
              AND eb.user_id = v_user_id;

            -- Find the last exercise in the block (by performed_at)
            SELECT e.actual_weight_value INTO v_actual_weight
            FROM public.exercise_block_exercises ebe
            JOIN public.exercises e ON ebe.exercise_id = e.id
            JOIN public.exercise_block eb ON ebe.block_id = eb.id
            WHERE ebe.block_id = v_block_id
              AND e.actual_weight_value IS NOT NULL
              AND e.user_id = v_user_id
            ORDER BY e.performed_at DESC NULLS LAST, ebe.exercise_order DESC
            LIMIT 1;

            -- Only add if actual_weight is not null
            IF v_actual_weight IS NOT NULL THEN
                IF v_cycle.cycle_type = '5' THEN
                    v_new_target_max := v_actual_weight / 0.9 / 0.85;
                ELSIF v_cycle.cycle_type = '3' THEN
                    v_new_target_max := v_actual_weight / 0.9 / 0.9;
                ELSIF v_cycle.cycle_type = '1' THEN
                    v_new_target_max := v_actual_weight / 0.9 / 0.95;
                ELSIF v_cycle.cycle_type = 'deload' THEN
                    v_new_target_max := v_actual_weight / 0.9 / 0.50;
                END IF;
                v_target_max_arr := array_append(v_target_max_arr, v_new_target_max);
            END IF;
        END LOOP;
    -- Set is_amrap = true for the last exercise in each block (except deload)
    FOR v_block_id, v_cycle_type IN SELECT wpm_block.block_id, wpm_block.cycle_type FROM public.wendler_program_movement_block wpm_block JOIN public.exercise_block eb ON wpm_block.block_id = eb.id WHERE eb.user_id = v_user_id AND wpm_block.cycle_type != 'deload' LOOP
        UPDATE public.exercises e
        SET is_amrap = true
        WHERE e.id = (
            SELECT ebe.exercise_id
            FROM public.exercise_block_exercises ebe
            JOIN public.exercises ex ON ebe.exercise_id = ex.id
            WHERE ebe.block_id = v_block_id AND ex.user_id = v_user_id
            ORDER BY ex.performed_at DESC NULLS LAST, ebe.exercise_order DESC
            LIMIT 1
        );
    END LOOP;

        -- If we have at least one value, find the median and round to nearest 5
        IF array_length(v_target_max_arr, 1) > 0 THEN
            -- Median calculation
            SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY val) INTO v_median_target_max
            FROM unnest(v_target_max_arr) val;

            -- Round to nearest 5
            v_rounded_target_max := round(v_median_target_max / 5.0) * 5.0;

            -- Update the movement's training_max_value
            UPDATE public.wendler_program_movement
            SET training_max_value = v_rounded_target_max
            WHERE id = v_rec.movement_id AND user_id = v_user_id;
        END IF;
    END LOOP;
    -- Calculate and update increase_amount_value for each movement
    FOR v_rec IN (
        SELECT wpm.id AS movement_id, wpm.user_id, wpm.exercise_type, wpm.wendler_program_id
        FROM public.wendler_program_movement wpm
        WHERE wpm.user_id = v_user_id
    ) LOOP
        -- Calculate increase_amount_value using LEAD on training_max_value, sorted by started_at
        FOR v_rec_inner IN (
            SELECT wpm2.id AS v_movement_id,
                   wpm2.training_max_value AS v_before_value,
                   LAG(wpm2.training_max_value) OVER (PARTITION BY wpm2.exercise_type ORDER BY wp.started_at DESC) AS v_lag_value,
                   wpm2.exercise_type AS v_exercise_type,
                   wp.started_at AS v_started_at
            FROM public.wendler_program_movement wpm2
            JOIN public.wendler_program wp ON wpm2.wendler_program_id = wp.id
            WHERE wpm2.user_id = v_user_id AND wpm2.exercise_type = v_rec.exercise_type
            ORDER BY wp.started_at DESC
        ) LOOP
            UPDATE public.wendler_program_movement
            SET increase_amount_value = CASE WHEN v_rec_inner.v_lag_value IS NULL THEN v_rec_inner.v_before_value ELSE v_rec_inner.v_before_value - v_rec_inner.v_lag_value END
            WHERE id = v_rec_inner.v_movement_id AND user_id = v_user_id;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
