-- TODO this needs to be updated to account for the new user-metadata, but I
-- haven't gotten there yet.

CREATE OR REPLACE FUNCTION public.new_leg_day(
    target_max numeric(6,2),
    target_max_weight_unit weight_unit_enum,
    user_id uuid,
    wendler_type wendler_cycle_type_enum,
    increase_amount numeric(5,2) DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wendler_metadata_id uuid;
    v_main_block_id uuid;
    v_accessory_block_id uuid;
    v_superblock_id uuid;
    v_exercise_id uuid;
    v_weight_id uuid;
    v_training_max_weight_id uuid;
    v_increase_amount_weight_id uuid;
    v_ratios numeric[];
    v_reps integer[];
    v_is_warmup boolean[];
    v_idx integer := 1;
    v_working_weight numeric;
    v_bar_weight numeric := 45; -- Standard barbell weight (45 lbs)
BEGIN
    -- Only support pounds for now
    IF target_max_weight_unit != 'pounds' THEN
        RAISE EXCEPTION 'Kilogram support not yet implemented';
    END IF;
    
    -- 1. Get or insert weight record for training max
    v_training_max_weight_id := public.get_weight(target_max, target_max_weight_unit);
    
    -- 2. Get or insert weight record for increase amount if provided
    IF increase_amount IS NOT NULL THEN
        v_increase_amount_weight_id := public.get_weight(increase_amount, target_max_weight_unit);
    END IF;
    
    -- 3. Create wendler metadata
    INSERT INTO public.wendler_metadata (
        user_id, training_max_weight_id, increase_amount_weight_id, cycle_type, exercise_type, created_at, updated_at
    ) VALUES (
        user_id, v_training_max_weight_id, v_increase_amount_weight_id, wendler_type, 'barbell_back_squat', timezone('utc', now()), timezone('utc', now())
    ) RETURNING id INTO v_wendler_metadata_id;

    -- 4. Create main exercise block for barbell_back_squat with warmup
    INSERT INTO public.exercise_block (
        user_id, wendler_metadata_id, block_order, name, notes, created_at, updated_at
    ) VALUES (
        user_id, v_wendler_metadata_id, 0, 'Main Exercise - Barbell Back Squat', 'Wendler ' || wendler_type || ' progression with warmup', timezone('utc', now()), timezone('utc', now())
    ) RETURNING id INTO v_main_block_id;

    -- Define ratios and reps for warmups and work sets based on cycle type
    IF wendler_type = '5' THEN
        -- Standard Wendler 5s: warmups then work sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6, 0.65, 0.75, 0.85];
        v_reps := ARRAY[5, 5, 3, 2, 5, 5, 5];
        v_is_warmup := ARRAY[true, true, true, true, false, false, false];
    ELSIF wendler_type = '3' THEN
        -- Standard Wendler 3s: warmups then work sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        v_reps := ARRAY[5, 5, 3, 2, 3, 3, 3];
        v_is_warmup := ARRAY[true, true, true, true, false, false, false];
    ELSIF wendler_type = '1' THEN
        -- Standard Wendler 5/3/1: warmups then work sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6, 0.75, 0.85, 0.95];
        v_reps := ARRAY[5, 5, 3, 2, 5, 3, 1];
        v_is_warmup := ARRAY[true, true, true, true, false, false, false];
    ELSIF wendler_type = 'deload' THEN
        -- Standard Wendler deload: warmups then light sets
        v_ratios := ARRAY[0, 0.4, 0.5, 0.6];
        v_reps := ARRAY[5, 5, 5, 5];
        v_is_warmup := ARRAY[true, true, true, false];
    ELSE
        RAISE EXCEPTION 'Unknown cycle type: %', wendler_type;
    END IF;

    -- Create main exercise sets
    FOR v_idx IN 1..array_length(v_ratios, 1) LOOP
        v_exercise_id := uuid_generate_v4();
        IF v_ratios[v_idx] = 0 THEN
            v_working_weight := v_bar_weight;
        ELSE
            v_working_weight := public.normalize_bar_weight_pounds(round(target_max * v_ratios[v_idx]));
        END IF;
        
        -- Get or insert weight row
        v_weight_id := public.get_weight(v_working_weight, target_max_weight_unit);
        
        -- Insert exercise
        INSERT INTO public.exercises (
            id, user_id, exercise_type, equipment_type, performed_at, weight_id, reps, warmup, completion_status
        ) VALUES (
            v_exercise_id, user_id, 'barbell_back_squat', 'barbell', NULL, v_weight_id, v_reps[v_idx], v_is_warmup[v_idx], 'not_completed'
        );
        
        -- Link to exercise block
        INSERT INTO public.exercise_block_exercises (
            block_id, exercise_id, exercise_order
        ) VALUES (
            v_main_block_id, v_exercise_id, v_idx - 1
        );
    END LOOP;

    -- 5. Create superblock to group main and accessory blocks
    INSERT INTO public.exercise_superblock (
        user_id, name, notes, created_at, updated_at
    ) VALUES (
        user_id, 
        'Leg Day - Wendler ' || wendler_type || ' Cycle',
        'Complete leg workout with wendler progression on back squat and accessory work',
        timezone('utc', now()), timezone('utc', now())
    ) RETURNING id INTO v_superblock_id;

    -- Link main block to superblock
    INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
    VALUES (v_superblock_id, v_main_block_id, 0);

    -- 6. Create individual accessory exercise blocks
    v_idx := 0;
    FOR v_exercise_id IN 
        SELECT uuid_generate_v4() FROM generate_series(1, 6)
    LOOP
        v_idx := v_idx + 1;
        
        -- Create individual exercise block for each accessory
        INSERT INTO public.exercise_block (
            user_id, wendler_metadata_id, block_order, name, notes, created_at, updated_at
        ) VALUES (
            user_id, v_wendler_metadata_id, v_idx, 
            CASE v_idx
                WHEN 1 THEN 'Barbell Front Squat'
                WHEN 2 THEN 'Machine Leg Press'
                WHEN 3 THEN 'Machine Leg Extension'
                WHEN 4 THEN 'Machine Abdominal'
                WHEN 5 THEN 'Machine Seated Leg Curl'
                WHEN 6 THEN 'Plate Stack Calf Raise'
            END,
            CASE 
                WHEN wendler_type = 'deload' THEN 'Higher reps with lower weight for recovery - weights are suggested starting points'
                WHEN wendler_type = '1' THEN 'Lower reps with higher weight for strength - weights are suggested starting points'
                ELSE 'Moderate reps and weight to support main lift - weights are suggested starting points'
            END, 
            timezone('utc', now()), timezone('utc', now())
        ) RETURNING id INTO v_accessory_block_id;
        
        -- Calculate intelligent default weight based on exercise type and main lift
        v_working_weight := CASE v_idx
            WHEN 1 THEN public.normalize_bar_weight_pounds(round(target_max * 0.75)) -- Front squat ~75% of back squat
            WHEN 2 THEN round(target_max * 1.5) -- Leg press ~150% of back squat (machine advantage)
            WHEN 3 THEN round(target_max * 0.4) -- Leg extension ~40% of back squat
            WHEN 4 THEN round(target_max * 0.3) -- Abdominal ~30% of back squat
            WHEN 5 THEN round(target_max * 0.35) -- Leg curl ~35% of back squat
            WHEN 6 THEN round(target_max * 0.5) -- Calf raise ~50% of back squat
        END;
        
        -- Create weight record with intelligent default
        v_weight_id := public.get_weight(v_working_weight, target_max_weight_unit);
        
        -- Insert exercise with intelligent default weight (user can modify)
        INSERT INTO public.exercises (
            id, user_id, exercise_type, equipment_type, performed_at, weight_id, reps, warmup, completion_status
        ) VALUES (
            v_exercise_id, 
            user_id, 
            CASE v_idx
                WHEN 1 THEN 'barbell_front_squat'::exercise_type_enum
                WHEN 2 THEN 'machine_leg_press'::exercise_type_enum
                WHEN 3 THEN 'machine_leg_extension'::exercise_type_enum
                WHEN 4 THEN 'machine_abdominal'::exercise_type_enum
                WHEN 5 THEN 'machine_seated_leg_curl'::exercise_type_enum
                WHEN 6 THEN 'plate_stack_calf_raise'::exercise_type_enum
            END,
            CASE v_idx
                WHEN 1 THEN 'barbell'::equipment_type_enum
                WHEN 6 THEN 'plate_stack'::equipment_type_enum
                ELSE 'machine'::equipment_type_enum
            END,
            NULL, -- performed_at
            v_weight_id, -- intelligent default weight (user can modify)
            CASE 
                WHEN wendler_type = 'deload' THEN 12
                WHEN wendler_type = '1' THEN 6
                ELSE 8
            END, -- suggested reps
            false, -- not warmup
            'not_completed'
        );
        
        -- Link to individual accessory block (exercise_order is 0 since each block has one exercise)
        INSERT INTO public.exercise_block_exercises (
            block_id, exercise_id, exercise_order
        ) VALUES (
            v_accessory_block_id, v_exercise_id, 0
        );
        
        -- Link block to superblock
        INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
        VALUES (v_superblock_id, v_accessory_block_id, v_idx);
    END LOOP;

    -- Return the superblock ID
    RETURN v_superblock_id;
END;
$$;
