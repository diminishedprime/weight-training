-- Function: add_leg_day_superblock
-- Creates a superblock for leg day with a Wendler block and three machine blocks (5x15)
CREATE OR REPLACE FUNCTION public.add_leg_day_superblock (
  p_user_id uuid,
  p_training_max numeric,
  p_wendler_cycle wendler_cycle_type_enum
) RETURNS uuid AS $$
DECLARE
    v_superblock_id uuid := uuid_generate_v4();
    v_wendler_block_id uuid;
    v_leg_curl_block_id uuid;
    v_leg_extension_block_id uuid;
    v_calf_raise_block_id uuid;
    v_order integer := 0;
BEGIN
    -- Create superblock
    INSERT INTO public.exercise_superblock (
        id, user_id, name, notes, created_at, updated_at
    ) VALUES (
        v_superblock_id, p_user_id, 
        'Leg Day ' || p_wendler_cycle || 's (' || p_training_max || 'lbs TM)',
        NULL, timezone('utc', now()), timezone('utc', now())
    );

    -- Create Wendler block (barbell_squat)
    v_wendler_block_id := public.wendler_exercise_block(
      p_user_id,
      p_training_max,
      'barbell_squat',
      p_wendler_cycle,
      'barbell_squat ' || p_wendler_cycle || 's (' || p_training_max || 'lbs TM)'
    );
    INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
    VALUES (v_superblock_id, v_wendler_block_id, v_order);
    v_order := v_order + 1;

    -- Create machine_seated_leg_curl block (5x15)
    v_leg_curl_block_id := public.add_exercise_block(
      p_user_id,
      'machine_seated_leg_curl',
      'machine',
      0,
      5,
      15,
      'machine_seated_leg_curl 5x15 (75 reps)'
    );
    INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
    VALUES (v_superblock_id, v_leg_curl_block_id, v_order);
    v_order := v_order + 1;

    -- Create machine_leg_extension block (5x15)
    v_leg_extension_block_id := public.add_exercise_block(
      p_user_id,
      'machine_leg_extension',
      'machine',
      0,
      5,
      15,
      'machine_leg_extension 5x15 (75 reps)'
    );
    INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
    VALUES (v_superblock_id, v_leg_extension_block_id, v_order);
    v_order := v_order + 1;

    -- Create plate_stack_calf_raise block (5x15)
    v_calf_raise_block_id := public.add_exercise_block(
      p_user_id,
      'plate_stack_calf_raise',
      'plate_stack',
      0,
      5,
      15,
      'plate_stack_calf_raise 5x15 (75 reps)'
    );
    INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
    VALUES (v_superblock_id, v_calf_raise_block_id, v_order);

    RETURN v_superblock_id;
END;
$$ LANGUAGE plpgsql;
