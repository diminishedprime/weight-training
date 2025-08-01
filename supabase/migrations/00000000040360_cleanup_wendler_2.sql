CREATE OR REPLACE FUNCTION _system.cleanup_wendler_2 () RETURNS void AS $$
DECLARE
    v_rec RECORD;
    v_rec_inner RECORD;
    v_cycle RECORD;
    v_block_id uuid;
    v_cycle_type wendler_cycle_type_enum;
    v_exercise_type exercise_type_enum;
    v_exercise_id uuid;
    v_actual_weight numeric;
    v_new_target_max numeric;
    v_target_max_arr numeric[];
    v_median_target_max numeric;
    v_rounded_target_max numeric;
    v_training_max_value numeric;
    v_cycle_types wendler_cycle_type_enum[] := ARRAY['5', '3', '1', 'deload'];
    v_exercise_types exercise_type_enum[] := ARRAY['barbell_deadlift', 'barbell_back_squat', 'barbell_overhead_press', 'barbell_bench_press'];
    v_user_id uuid := '97097295-6eb1-4824-8bfa-8984cf9bea6b';
    v_target_weight_value numeric;
BEGIN
    RAISE NOTICE 'Starting _system.cleanup_wendler_2 for user_id: %', v_user_id;
    -- For each Wendler program cycle movement, recalculate target max for each cycle
    FOR v_rec IN (
        SELECT wpcm.id AS movement_id, wpcm.user_id, wpcm.exercise_type, wpcm.wendler_program_cycle_id, wpc.cycle_type, wpcm.block_id, wpc.wendler_program_id
        FROM public.wendler_program_cycle_movement wpcm
        JOIN public.wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id
        WHERE wpcm.user_id = v_user_id
    ) LOOP
        v_target_max_arr := ARRAY[]::numeric[];
        -- For this movement, collect only the last (highest exercise_order) COALESCE(actual_weight_value, target_weight_value) for each block for this program/exercise_type
        FOR v_rec_inner IN (
            SELECT COALESCE(e.actual_weight_value, e.target_weight_value) AS base_weight, wpc.cycle_type
            FROM public.wendler_program_cycle_movement wpcm2
            JOIN public.exercise_block eb ON wpcm2.block_id = eb.id
            JOIN LATERAL (
                SELECT ebe2.exercise_id, ebe2.exercise_order
                FROM public.exercise_block_exercises ebe2
                JOIN public.exercises e2 ON ebe2.exercise_id = e2.id
                WHERE ebe2.block_id = eb.id AND e2.user_id = v_user_id
                ORDER BY ebe2.exercise_order DESC
                LIMIT 1
            ) last_ex ON TRUE
            JOIN public.exercises e ON last_ex.exercise_id = e.id
            JOIN public.wendler_program_cycle wpc ON wpcm2.wendler_program_cycle_id = wpc.id
            WHERE wpcm2.user_id = v_user_id
              AND wpc.wendler_program_id = v_rec.wendler_program_id
              AND wpcm2.exercise_type = v_rec.exercise_type
              AND COALESCE(e.actual_weight_value, e.target_weight_value) IS NOT NULL
        ) LOOP
            IF v_rec_inner.base_weight IS NULL THEN
                CONTINUE;
            END IF;
            IF v_rec_inner.cycle_type = '5' THEN
                v_new_target_max := v_rec_inner.base_weight / 0.9 / 0.85;
            ELSIF v_rec_inner.cycle_type = '3' THEN
                v_new_target_max := v_rec_inner.base_weight / 0.9 / 0.9;
            ELSIF v_rec_inner.cycle_type = '1' THEN
                v_new_target_max := v_rec_inner.base_weight / 0.9 / 0.95;
            ELSIF v_rec_inner.cycle_type = 'deload' THEN
                v_new_target_max := v_rec_inner.base_weight / 0.9 / 0.50;
            ELSE
                RAISE EXCEPTION 'Unknown cycle_type: %', v_rec_inner.cycle_type;
            END IF;
            v_target_max_arr := array_append(v_target_max_arr, v_new_target_max);
        END LOOP;
        IF array_length(v_target_max_arr, 1) IS NULL OR array_length(v_target_max_arr, 1) = 0 THEN
            RAISE EXCEPTION 'No valid actual_weight or target_weight found for movement_id=%, exercise_type=%', v_rec.movement_id, v_rec.exercise_type;
        END IF;
        -- Median calculation
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY val) INTO v_median_target_max
        FROM unnest(v_target_max_arr) val;
        -- Round to nearest 5
        v_rounded_target_max := round(v_median_target_max / 5.0) * 5.0;
        -- Update the movement's training_max_value
        UPDATE public.wendler_program_cycle_movement
        SET training_max_value = v_rounded_target_max
        WHERE id = v_rec.movement_id AND user_id = v_user_id;
    END LOOP;

    -- Set is_amrap = true for the last exercise in each block (except deload)
    FOR v_block_id, v_cycle_type IN SELECT wpcm.block_id, wpc.cycle_type FROM public.wendler_program_cycle_movement wpcm JOIN public.wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id JOIN public.exercise_block eb ON wpcm.block_id = eb.id WHERE eb.user_id = v_user_id AND wpc.cycle_type != 'deload' LOOP
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
    RAISE NOTICE 'Finished _system.cleanup_wendler_2 for user_id: %', v_user_id;

    -- Calculate and update increase_amount_value for each movement
    FOR v_rec IN (
        SELECT wpcm.id AS movement_id, wpcm.user_id, wpcm.exercise_type, wpcm.wendler_program_cycle_id, wpc.cycle_type, wpc.wendler_program_id
        FROM public.wendler_program_cycle_movement wpcm
        JOIN public.wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id
        WHERE wpcm.user_id = v_user_id
    ) LOOP
        -- Calculate increase_amount_value using LAG on training_max_value, sorted by block started_at
        FOR v_rec_inner IN (
            SELECT wpcm2.id AS v_movement_id,
                   wpcm2.training_max_value AS v_before_value,
                   LAG(wpcm2.training_max_value) OVER (PARTITION BY wpcm2.exercise_type ORDER BY eb2.started_at DESC) AS v_lag_value,
                   wpcm2.exercise_type AS v_exercise_type,
                   eb2.started_at AS v_started_at
            FROM public.wendler_program_cycle_movement wpcm2
            JOIN public.wendler_program_cycle wpc2 ON wpcm2.wendler_program_cycle_id = wpc2.id
            JOIN public.exercise_block eb2 ON wpcm2.block_id = eb2.id
            WHERE wpcm2.user_id = v_user_id AND wpcm2.exercise_type = v_rec.exercise_type AND wpc2.wendler_program_id = v_rec.wendler_program_id
            ORDER BY eb2.started_at DESC
        ) LOOP
            UPDATE public.wendler_program_cycle_movement
            SET increase_amount_value = CASE WHEN v_rec_inner.v_lag_value IS NULL THEN v_rec_inner.v_before_value ELSE v_rec_inner.v_before_value - v_rec_inner.v_lag_value END
            WHERE id = v_rec_inner.v_movement_id AND user_id = v_user_id;
        END LOOP;
    END LOOP;

    FOR v_rec IN (
        SELECT wp.id AS program_id
        FROM public.wendler_program wp
        WHERE wp.user_id = v_user_id
    ) LOOP
        -- Ensure all cycles exist for this program
        FOREACH v_cycle_type IN ARRAY v_cycle_types LOOP
            IF NOT EXISTS (
                SELECT 1 FROM public.wendler_program_cycle
                WHERE wendler_program_id = v_rec.program_id
                  AND user_id = v_user_id
                  AND cycle_type = v_cycle_type
            ) THEN
                INSERT INTO public.wendler_program_cycle (wendler_program_id, user_id, cycle_type)
                VALUES (v_rec.program_id, v_user_id, v_cycle_type);
            END IF;
        END LOOP;

        -- Hardcoded exercise types for now
        FOR v_exercise_type IN SELECT unnest(v_exercise_types) LOOP
            FOR v_cycle IN (
                SELECT id, cycle_type FROM public.wendler_program_cycle
                WHERE wendler_program_id = v_rec.program_id
                  AND user_id = v_user_id
            ) LOOP
                IF NOT EXISTS (
                    SELECT 1 FROM public.wendler_program_cycle_movement
                    WHERE wendler_program_cycle_id = v_cycle.id
                      AND user_id = v_user_id
                      AND exercise_type = v_exercise_type
                ) THEN
                    RAISE NOTICE 'Creating exercise_block for user_id: %, exercise_type: %', v_user_id, v_exercise_type;
                    -- TODO: this should also create a corresponding superblock.
                    INSERT INTO public.exercise_block (user_id, exercise_type, equipment_type, completion_status, name)
                    VALUES (
                        v_user_id, 
                        v_exercise_type, 
                        'barbell', 
                        'not_completed', 
                        'Wendler ' || _system.exercise_type_ui_string_brief(v_exercise_type) || ' ' || v_cycle.cycle_type::text
                        )
                    RETURNING id INTO v_block_id;

                    RAISE NOTICE 'Attempting to insert wendler_program_cycle_movement: cycle_id=%, user_id=%, exercise_type=%, block_id=%', v_cycle.id, v_user_id, v_exercise_type, v_block_id;
                    -- Query any existing training_max_value for this exercise_type and program
                    SELECT training_max_value INTO v_training_max_value
                    FROM public.wendler_program_cycle_movement wpcm2
                    JOIN public.wendler_program_cycle wpc2 ON wpcm2.wendler_program_cycle_id = wpc2.id
                    WHERE wpcm2.user_id = v_user_id
                      AND wpc2.wendler_program_id = v_rec.program_id
                      AND wpcm2.exercise_type = v_exercise_type
                      AND wpcm2.training_max_value IS NOT NULL
                    LIMIT 1;
                    IF v_training_max_value IS NULL THEN
                        RAISE EXCEPTION 'No valid training_max_value found for new movement: cycle_id=%, exercise_type=%', v_cycle.id, v_exercise_type;
                    END IF;
                    INSERT INTO public.wendler_program_cycle_movement (
                        wendler_program_cycle_id, user_id, exercise_type, training_max_value, increase_amount_value, weight_unit, block_id
                    ) VALUES (
                        v_cycle.id, v_user_id, v_exercise_type,
                        v_training_max_value,
                        0, 'pounds', v_block_id
                    );
                ELSE
                    SELECT block_id INTO v_block_id
                    FROM public.wendler_program_cycle_movement
                    WHERE wendler_program_cycle_id = v_cycle.id
                      AND user_id = v_user_id
                      AND exercise_type = v_exercise_type;
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM public.exercise_block_exercises ebe
                    JOIN public.exercises e ON ebe.exercise_id = e.id
                    WHERE ebe.block_id = v_block_id AND e.user_id = v_user_id
                ) THEN
                    -- Get the target_max from a corresponding movement for this exercise_type and program
                    SELECT training_max_value INTO v_training_max_value
                    FROM public.wendler_program_cycle_movement wpcm2
                    JOIN public.wendler_program_cycle wpc2 ON wpcm2.wendler_program_cycle_id = wpc2.id
                    WHERE wpcm2.user_id = v_user_id
                      AND wpc2.wendler_program_id = v_rec.program_id
                      AND wpcm2.exercise_type = v_exercise_type
                      AND wpcm2.training_max_value IS NOT NULL
                    LIMIT 1;
                    IF v_training_max_value IS NULL THEN
                        RAISE EXCEPTION 'No valid training_max_value found for exercise insert: cycle_id=%, exercise_type=%', v_cycle.id, v_exercise_type;
                    END IF;
                    -- Apply cycle-specific calculation
                    IF v_cycle.cycle_type = '5' THEN
                        v_target_weight_value := v_training_max_value * 0.9 * 0.85;
                    ELSIF v_cycle.cycle_type = '3' THEN
                        v_target_weight_value := v_training_max_value * 0.9 * 0.9;
                    ELSIF v_cycle.cycle_type = '1' THEN
                        v_target_weight_value := v_training_max_value * 0.9 * 0.95;
                    ELSIF v_cycle.cycle_type = 'deload' THEN
                        v_target_weight_value := v_training_max_value * 0.9 * 0.5;
                    ELSE
                        RAISE EXCEPTION 'Unknown cycle_type for exercise insert: %', v_cycle.cycle_type;
                    END IF;
                    INSERT INTO public.exercises (
                        user_id, 
                        exercise_type, 
                        equipment_type, 
                        target_weight_value, 
                        weight_unit, 
                        reps, 
                        is_warmup, 
                        is_amrap, 
                        completion_status
                    ) VALUES (
                        v_user_id, 
                        v_exercise_type, 
                        'barbell',
                        v_target_weight_value,
                        'pounds',
                        CASE v_cycle.cycle_type
                            WHEN '5' THEN 5
                            WHEN '3' THEN 3
                            WHEN '1' THEN 1
                            WHEN 'deload' THEN 5
                            ELSE 5
                        END,
                        false, 
                        false, 
                        'not_completed'
                    )
                    RETURNING id INTO v_exercise_id;

                    INSERT INTO public.exercise_block_exercises (block_id, exercise_id, exercise_order)
                    VALUES (v_block_id, v_exercise_id, 1);
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Finished _system.cleanup_wendler_2 for user_id: %', v_user_id;
END;
$$ LANGUAGE plpgsql;
