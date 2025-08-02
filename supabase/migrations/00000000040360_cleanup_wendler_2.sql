CREATE OR REPLACE FUNCTION _system.cleanup_wendler_2 () RETURNS void AS $$
DECLARE
    v_rec RECORD;
    v_rec_inner RECORD;
    v_cycle RECORD;
    v_program RECORD;
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
    -- For increase_amount_value iterative calculation
    v_exercise_type_iter exercise_type_enum;
    v_program_order integer;
    v_prev_target_max numeric;
    v_curr_target_max numeric;
    v_curr_id uuid;
    v_prev_program_order integer;
BEGIN
    RAISE NOTICE 'Starting _system.cleanup_wendler_2 for user_id: %', v_user_id;

    RAISE NOTICE 'Updating public.wendler_movement_max.target_max_value';
    FOR v_rec IN (
        SELECT wpc.wendler_program_id, wpcm.exercise_type, wp.program_order
        FROM public.wendler_program_cycle_movement wpcm
        JOIN public.wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id
        JOIN public.wendler_program wp ON wpc.wendler_program_id = wp.id
        WHERE wpcm.user_id = v_user_id
        GROUP BY wpc.wendler_program_id, wpcm.exercise_type, wp.program_order
    ) LOOP
        RAISE NOTICE '  Fixing max for program order: %, exercise_type: %', v_rec.program_order, v_rec.exercise_type;
        v_target_max_arr := ARRAY[]::numeric[];
        -- Collect all relevant weights for this program/exercise_type
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
        RAISE NOTICE '  Values for calculating target max value: %', v_target_max_arr;
        -- Median calculation
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY val) INTO v_median_target_max
        FROM unnest(v_target_max_arr) val;
        -- Round to nearest 5
        v_rounded_target_max := round(v_median_target_max / 5.0) * 5.0;
        -- Update canonical value in wendler_movement_max; if no row exists, raise exception
        RAISE NOTICE '  Rounded target max value: %', v_rounded_target_max;
        UPDATE public.wendler_movement_max wmm
        SET target_max_value = v_rounded_target_max
        WHERE wmm.user_id = v_user_id
          AND wmm.id = (
            SELECT wpcm.movement_max_id
            FROM public.wendler_program_cycle_movement wpcm
            JOIN public.wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id
            WHERE wpc.wendler_program_id = v_rec.wendler_program_id
              AND wpcm.exercise_type = v_rec.exercise_type
              AND wpcm.user_id = v_user_id
            LIMIT 1
          );
        IF NOT FOUND THEN
            RAISE EXCEPTION 'No wendler_movement_max row found for user_id=%', v_user_id;
        END IF;
    END LOOP;


    RAISE NOTICE 'Updating last exercises in each block to set is_amrap = true (except deload)';
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

    RAISE NOTICE 'Updating public.wendler_movement_max.increase_amount_value';
    -- Only calculate increases for cycle_type = '5', since the data is normalized
    FOR v_exercise_type_iter IN SELECT unnest(v_exercise_types) LOOP
        v_prev_target_max := NULL;
        v_prev_program_order := NULL;
        RAISE NOTICE '  Calculating increases for exercise_type: %, cycle_type: 5 across all programs', v_exercise_type_iter;
        FOR v_rec IN (
            SELECT wmm.id, wp.program_order, wmm.target_max_value, wp.id as program_id
            FROM public.wendler_movement_max wmm
            JOIN public.wendler_program_cycle_movement wpcm ON wmm.id = wpcm.movement_max_id
            JOIN public.wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id
            JOIN public.wendler_program wp ON wpc.wendler_program_id = wp.id
            WHERE wmm.user_id = v_user_id
              AND wpcm.exercise_type = v_exercise_type_iter
              AND wpc.cycle_type = '5'
            ORDER BY wp.program_order ASC
        ) LOOP
            v_curr_id := v_rec.id;
            v_program_order := v_rec.program_order;
            v_curr_target_max := v_rec.target_max_value;
            IF v_prev_target_max IS NULL THEN
                RAISE NOTICE '    [program_order=%] No previous, setting increase_amount_value = %', v_program_order, v_curr_target_max;
                UPDATE public.wendler_movement_max
                SET increase_amount_value = v_curr_target_max
                WHERE id = v_curr_id;
            ELSE
                RAISE NOTICE '    [program_order=%] Previous target_max=%; setting increase_amount_value = % - % = %', v_program_order, v_prev_target_max, v_curr_target_max, v_prev_target_max, v_curr_target_max - v_prev_target_max;
                UPDATE public.wendler_movement_max
                SET increase_amount_value = v_curr_target_max - v_prev_target_max
                WHERE id = v_curr_id;
            END IF;
            v_prev_target_max := v_curr_target_max;
            v_prev_program_order := v_program_order;
        END LOOP;
    END LOOP;

    -- RAISE NOTICE 'Making sure all cycles exist for all programs.';
    -- TODO: Skipping for now because if I can launch after Saturday we won't need this.
    RAISE NOTICE 'Updating started_at and completed_at for all programs, cycles, and movements';

    RAISE NOTICE 'Syncing started_at and completed_at for wendler_program_cycle_movement from exercise_block...';
    UPDATE public.wendler_program_cycle_movement wpcm
    SET started_at = eb.started_at,
        completed_at = eb.completed_at
    FROM public.exercise_block eb
    WHERE wpcm.block_id = eb.id;

    RAISE NOTICE 'Aggregating started_at and completed_at for wendler_program_cycle from its movements...';
    UPDATE public.wendler_program_cycle wpc
    SET started_at = sub.min_started_at,
        completed_at = CASE WHEN sub.all_completed THEN sub.max_completed_at ELSE NULL END
    FROM (
      SELECT wpcm.wendler_program_cycle_id,
             MIN(wpcm.started_at) AS min_started_at,
             MAX(wpcm.completed_at) AS max_completed_at,
             BOOL_AND(wpcm.completed_at IS NOT NULL) AS all_completed
      FROM public.wendler_program_cycle_movement wpcm
      GROUP BY wpcm.wendler_program_cycle_id
    ) sub
    WHERE wpc.id = sub.wendler_program_cycle_id;

    RAISE NOTICE 'Aggregating started_at and completed_at for wendler_program from its cycles...';
    UPDATE public.wendler_program wp
    SET started_at = sub.min_started_at,
        completed_at = CASE WHEN sub.all_completed THEN sub.max_completed_at ELSE NULL END
    FROM (
      SELECT wpc.wendler_program_id,
             MIN(wpc.started_at) AS min_started_at,
             MAX(wpc.completed_at) AS max_completed_at,
             BOOL_AND(wpc.completed_at IS NOT NULL) AS all_completed
      FROM public.wendler_program_cycle wpc
      GROUP BY wpc.wendler_program_id
    ) sub
    WHERE wp.id = sub.wendler_program_id;
    RAISE NOTICE 'Finished _system.cleanup_wendler_2 for user_id: %', v_user_id;
END;
$$ LANGUAGE plpgsql;
