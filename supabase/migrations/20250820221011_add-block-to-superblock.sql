DROP FUNCTION IF EXISTS add_block_to_superblock;

CREATE OR REPLACE FUNCTION public.add_block_to_superblock (
  p_user_id uuid,
  p_superblock_id uuid,
  p_name text,
  p_equipment_type equipment_type_enum,
  p_exercise_type exercise_type_enum,
  p_sets integer,
  p_reps integer,
  p_weight_value integer,
  p_weight_unit weight_unit_enum
) RETURNS public.get_perform_superblock_result LANGUAGE plpgsql AS $$
DECLARE
    v_block_id uuid := uuid_generate_v4();
    v_exercise_id uuid;
    v_first_exercise_id uuid := NULL;
    v_order integer := 1;
BEGIN
    INSERT INTO public.exercise_block (
        id, 
        user_id,
        name,
        notes,
        exercise_type,
        equipment_type,
        completion_status
    ) VALUES (
        v_block_id,
        p_user_id,
        p_name,
        -- notes
        NULL, 
        p_exercise_type,
        p_equipment_type,
        'not_started'
    );

    INSERT INTO public.exercise_superblock_blocks (
        superblock_id,
        block_id,
        superblock_order
    ) VALUES (
        p_superblock_id,
        v_block_id,
        (
            SELECT COALESCE(MAX(superblock_order), 0) + 1
            FROM public.exercise_superblock_blocks
            WHERE superblock_id = p_superblock_id
        )
    );

    FOR v_order IN 1..p_sets LOOP
        v_exercise_id := uuid_generate_v4();
        IF v_order = 1 THEN
            v_first_exercise_id := v_exercise_id;
        END IF;
        INSERT INTO public.exercises (
            id,
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
            v_exercise_id,
            p_user_id,
            p_exercise_type,
            p_equipment_type,
            p_weight_value,
            p_weight_unit,
            p_reps,
            -- is_warmup
            false,
            -- is_amrap
            false,
            'not_started'
        );

        INSERT INTO public.exercise_block_exercises (
            block_id,
            exercise_id,
            exercise_order
        ) VALUES (
            v_block_id,
            v_exercise_id,
            v_order
        );
    END LOOP;

    UPDATE public.exercise_block
    SET active_exercise_id = v_first_exercise_id
    WHERE id = v_block_id;
    
    RETURN public.get_perform_superblock(p_user_id => p_user_id, p_superblock_id => p_superblock_id);
END;
$$;
