CREATE OR REPLACE FUNCTION quick_superblock (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_equipment_type equipment_type_enum,
  p_target_weight numeric,
  p_weight_unit weight_unit_enum,
  p_reps integer,
  p_sets integer,
  p_superblock_name text,
  p_block_name text
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
    superblock_id uuid;
    block_id uuid;
    exercise_id uuid;
BEGIN
    -- Create superblock
    INSERT INTO exercise_superblock (id, user_id, name, completion_status)
    VALUES (uuid_generate_v4(), p_user_id, p_superblock_name, 'not_started')
    RETURNING id INTO superblock_id;

    -- Create block
    INSERT INTO exercise_block (id, user_id, name, exercise_type, equipment_type, completion_status)
    VALUES (uuid_generate_v4(), p_user_id, p_block_name, p_exercise_type, p_equipment_type, 'not_started')
    RETURNING id INTO block_id;

    -- Link block to superblock
    INSERT INTO exercise_superblock_blocks (superblock_id, block_id, superblock_order)
    VALUES (superblock_id, block_id, 1);

    -- Create exercises in block
    FOR i IN 1..p_sets LOOP
        INSERT INTO exercises (
            id, user_id, exercise_type, equipment_type, target_weight_value, weight_unit, reps, is_warmup, is_amrap, completion_status
        ) VALUES (
            uuid_generate_v4(), p_user_id, p_exercise_type, p_equipment_type, p_target_weight, p_weight_unit, p_reps, false, false, 'not_started'
        ) RETURNING id INTO exercise_id;
        -- Link exercise to block
        INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
        VALUES (block_id, exercise_id, i);
        -- Set first exercise as active_exercise_id
        IF i = 1 THEN
            UPDATE exercise_block SET active_exercise_id = exercise_id WHERE id = block_id;
        END IF;
    END LOOP;

    RETURN superblock_id;
END;
$$;
