CREATE OR REPLACE FUNCTION _impl.add_exercise (
  p_user_id uuid,
  p_block_id uuid,
  p_exercise_type exercise_type_enum,
  p_equipment_type equipment_type_enum,
  p_target_weight_value numeric,
  p_weight_unit weight_unit_enum,
  p_reps integer,
  p_exercise_order integer,
  p_is_warmup boolean,
  p_is_amrap boolean
) RETURNS uuid AS $$
DECLARE
  v_exercise_id uuid;
BEGIN
  INSERT INTO public.exercises (
    user_id,
    exercise_type,
    equipment_type,
    target_weight_value,
    weight_unit,
    reps,
    is_warmup,
    is_amrap,
    notes
  ) VALUES (
    p_user_id::uuid,
    p_exercise_type::exercise_type_enum,
    p_equipment_type::equipment_type_enum,
    p_target_weight_value::numeric,
    p_weight_unit::weight_unit_enum,
    p_reps::integer,
    p_is_warmup::boolean,
    p_is_amrap::boolean,
    NULL -- Notes are typically set during the workout.
  ) RETURNING id INTO v_exercise_id;

  INSERT INTO public.exercise_block_exercises (
    block_id,
    exercise_id,
    exercise_order
  ) VALUES (
    p_block_id::uuid,
    v_exercise_id::uuid,
    p_exercise_order::integer
  );

  RETURN v_exercise_id;
END $$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION _impl.add_block (
  p_user_id uuid,
  p_cycle_id uuid,
  p_exercise_type exercise_type_enum,
  p_cycle_type public.wendler_cycle_type_enum,
  p_training_max_value numeric,
  p_weight_unit weight_unit_enum,
  p_increase_amount_value numeric
) RETURNS uuid AS $$
DECLARE
  v_block_id uuid;
  v_exercise_id uuid;
  v_block_order integer := 1;
  v_i integer;
  v_warmup_multiplicands numeric[];
  v_warmup_multipliers numeric[];
  v_warmup_reps numeric[];
  v_working_set_multipliers numeric[];
  v_working_set_reps numeric[];
BEGIN

  INSERT INTO public.exercise_block (
    user_id,
    exercise_type,
    equipment_type,
    completion_status
  ) VALUES (
    p_user_id::uuid,
    p_exercise_type::exercise_type_enum,
    'barbell'::equipment_type_enum,
    'not_completed'::completion_status_enum
  ) RETURNING id INTO v_block_id;

  -- Set warmup multiplicands based on cycle type
  CASE p_cycle_type
    WHEN '5' THEN
      v_warmup_multiplicands := ARRAY[45, p_training_max_value, p_training_max_value, p_training_max_value ];
      v_warmup_multipliers := ARRAY[1.0, 0.9*0.35, 0.9*0.45, 0.9*0.55];
      v_warmup_reps := ARRAY[8, 5, 4, 3];
      v_working_set_multipliers := ARRAY[0.9*0.65, 0.9*0.75, 0.9*0.85];
      v_working_set_reps := ARRAY[5, 5, 5];
    WHEN '3' THEN
      v_warmup_multiplicands := ARRAY[45, p_training_max_value, p_training_max_value, p_training_max_value ];
      v_warmup_multipliers := ARRAY[1.0, 0.9*0.40, 0.9*0.50, 0.9*0.60];
      v_warmup_reps := ARRAY[8, 5, 4, 3];
      v_working_set_multipliers := ARRAY[0.9*0.70, 0.9*0.80, 0.9*0.90];
      v_working_set_reps := ARRAY[3, 3, 3];
    WHEN '1' THEN
      v_warmup_multiplicands := ARRAY[45, p_training_max_value, p_training_max_value, p_training_max_value ];
      v_warmup_multipliers := ARRAY[1.0, 0.9*0.45, 0.9*0.55, 0.9*0.65];
      v_warmup_reps := ARRAY[8, 5, 4, 3];
      v_working_set_multipliers := ARRAY[0.9*0.75, 0.9*0.85, 0.9*0.95];
      v_working_set_reps := ARRAY[5, 3, 1];
    WHEN 'deload' THEN
      v_warmup_multiplicands := ARRAY[45, p_training_max_value, p_training_max_value, p_training_max_value ];
      v_warmup_multipliers := ARRAY[1.0, 0.9*0.10, 0.9*0.20, 0.9*0.30];
      v_warmup_reps := ARRAY[8, 5, 4, 3];
      v_working_set_multipliers := ARRAY[0.9*0.40, 0.9*0.50, 0.9*0.60];
      v_working_set_reps := ARRAY[5, 5, 5];
    ELSE
      -- this should never happen.
  END CASE;

  -- Add 4 warmup exercises
  FOR v_i IN 1..4 LOOP
    v_exercise_id := _impl.add_exercise(
      p_user_id => p_user_id::uuid,
      p_block_id => v_block_id::uuid,
      p_exercise_type => p_exercise_type::exercise_type_enum,
      p_equipment_type => 'barbell'::equipment_type_enum,
      p_target_weight_value => (v_warmup_multiplicands[v_i] * v_warmup_multipliers[v_i])::numeric,
      p_weight_unit => p_weight_unit::weight_unit_enum,
      p_reps => v_warmup_reps[v_i]::integer,
      p_exercise_order => v_block_order::integer,
      p_is_warmup => TRUE,
      p_is_amrap => FALSE
    );
    v_block_order := v_block_order + 1;
  END LOOP;

  -- Add in 3 working sets, last set should be AMRAP
  FOR v_i IN 1..3 LOOP
    v_exercise_id := _impl.add_exercise(
      p_user_id => p_user_id::uuid,
      p_block_id => v_block_id::uuid,
      p_exercise_type => p_exercise_type::exercise_type_enum,
      p_equipment_type => 'barbell'::equipment_type_enum,
      p_target_weight_value => (p_training_max_value * v_working_set_multipliers[v_i])::numeric,
      p_weight_unit => p_weight_unit::weight_unit_enum,
      p_reps => v_working_set_reps[v_i]::integer,
      p_exercise_order => v_block_order::integer,
      p_is_warmup => FALSE,
      p_is_amrap => (v_i = 3)
    );
    v_block_order := v_block_order + 1;
  END LOOP;

  INSERT INTO public.wendler_program_cycle_movement (
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    training_max_value,
    increase_amount_value,
    weight_unit,
    block_id
  ) VALUES (
    p_cycle_id,
    p_user_id,
    p_exercise_type,
    p_training_max_value,
    p_increase_amount_value,
    p_weight_unit,
    v_block_id
  );
  RETURN v_block_id;
END $$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION _impl.add_movement (
  p_user_id uuid,
  p_cycle_id uuid,
  p_cycle_type public.wendler_cycle_type_enum,
  p_movement_type exercise_type_enum,
  p_training_max_value numeric,
  p_weight_unit weight_unit_enum
) RETURNS void AS $$
DECLARE
  v_increase_amount_value numeric;
  v_block_id uuid;
  v_superblock_id uuid;
  v_superblock_name text;
BEGIN
  SELECT COALESCE(
    (
      SELECT wpcm.training_max_value
      FROM public.wendler_program_cycle_movement wpcm
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpcm.user_id = p_user_id::uuid
        AND wpcm.exercise_type = p_movement_type::exercise_type_enum
      ORDER BY eb.started_at DESC NULLS LAST
      LIMIT 1
    ), p_training_max_value::numeric
  ) INTO v_increase_amount_value;

  v_block_id := _impl.add_block(
    p_user_id => p_user_id::uuid,
    p_cycle_id => p_cycle_id::uuid,
    p_exercise_type => p_movement_type::exercise_type_enum,
    p_cycle_type => p_cycle_type::public.wendler_cycle_type_enum,
    p_training_max_value => p_training_max_value::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum,
    p_increase_amount_value => v_increase_amount_value
  );

  -- Determine superblock name based on movement type
  v_superblock_name := CASE p_movement_type
    WHEN 'barbell_deadlift' THEN 'Pull Day'
    WHEN 'barbell_back_squat' THEN 'Leg Day'
    WHEN 'barbell_bench_press' THEN 'Push Day'
    WHEN 'barbell_overhead_press' THEN 'Shoulder Day'
    ELSE 'Other Day'
  END;

  -- Create a superblock for this block
  INSERT INTO public.exercise_superblock (
    user_id,
    name
  ) VALUES (
    p_user_id::uuid,
    v_superblock_name
  ) RETURNING id INTO v_superblock_id;

  -- Associate the block with the superblock
  INSERT INTO public.exercise_superblock_blocks (
    superblock_id,
    block_id,
    superblock_order
  ) VALUES (
    v_superblock_id,
    v_block_id,
    1
  );
END $$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION _impl.add_cycle (
  p_user_id uuid,
  p_program_id uuid,
  p_cycle_type public.wendler_cycle_type_enum,
  p_squat_target_max numeric,
  p_deadlift_target_max numeric,
  p_overhead_press_target_max numeric,
  p_bench_press_target_max numeric,
  p_weight_unit weight_unit_enum
) RETURNS void AS $$
DECLARE
  v_cycle_id uuid;
BEGIN

  INSERT INTO public.wendler_program_cycle (
    wendler_program_id,
    user_id,
    cycle_type
  ) VALUES (
    p_program_id::uuid,
    p_user_id::uuid,
    p_cycle_type::public.wendler_cycle_type_enum
  ) RETURNING id INTO v_cycle_id;

  PERFORM _impl.add_movement(
    p_user_id => p_user_id::uuid,
    p_cycle_id => v_cycle_id::uuid,
    p_cycle_type => p_cycle_type::public.wendler_cycle_type_enum,
    p_movement_type => 'barbell_back_squat'::exercise_type_enum,
    p_training_max_value => p_squat_target_max::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum
  );
  PERFORM _impl.add_movement(
    p_user_id => p_user_id::uuid,
    p_cycle_id => v_cycle_id::uuid,
    p_cycle_type => p_cycle_type::public.wendler_cycle_type_enum,
    p_movement_type => 'barbell_deadlift'::exercise_type_enum,
    p_training_max_value => p_deadlift_target_max::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum
  );
  PERFORM _impl.add_movement(
    p_user_id => p_user_id::uuid,
    p_cycle_id => v_cycle_id::uuid,
    p_cycle_type => p_cycle_type::public.wendler_cycle_type_enum,
    p_movement_type => 'barbell_overhead_press'::exercise_type_enum,
    p_training_max_value => p_overhead_press_target_max::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum
  );
  PERFORM _impl.add_movement(
    p_user_id => p_user_id::uuid,
    p_cycle_id => v_cycle_id::uuid,
    p_cycle_type => p_cycle_type::public.wendler_cycle_type_enum,
    p_movement_type => 'barbell_bench_press'::exercise_type_enum,
    p_training_max_value => p_bench_press_target_max::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum
  );
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION public.add_wendler_program (
  p_user_id uuid,
  p_squat_target_max numeric,
  p_deadlift_target_max numeric,
  p_overhead_press_target_max numeric,
  p_bench_press_target_max numeric,
  p_weight_unit weight_unit_enum,
  p_include_deload boolean,
  p_program_name text,
  p_notes text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_program_id uuid;
BEGIN

  INSERT INTO public.wendler_program (
    user_id,
    name,
    notes
  ) VALUES (
    p_user_id::uuid,
    p_program_name::text,
    p_notes::text
  ) RETURNING id INTO v_program_id;

  PERFORM _impl.add_cycle(
    p_user_id => p_user_id::uuid,
    p_program_id => v_program_id::uuid,
    p_cycle_type => '5'::public.wendler_cycle_type_enum,
    p_squat_target_max => p_squat_target_max::numeric,
    p_deadlift_target_max => p_deadlift_target_max::numeric,
    p_overhead_press_target_max => p_overhead_press_target_max::numeric,
    p_bench_press_target_max => p_bench_press_target_max::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum
  );

  PERFORM _impl.add_cycle(
    p_user_id => p_user_id::uuid,
    p_program_id => v_program_id::uuid,
    p_cycle_type => '3'::public.wendler_cycle_type_enum,
    p_squat_target_max => p_squat_target_max::numeric,
    p_deadlift_target_max => p_deadlift_target_max::numeric,
    p_overhead_press_target_max => p_overhead_press_target_max::numeric,
    p_bench_press_target_max => p_bench_press_target_max::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum
  );

  PERFORM _impl.add_cycle(
    p_user_id => p_user_id::uuid,
    p_program_id => v_program_id::uuid,
    p_cycle_type => '1'::public.wendler_cycle_type_enum,
    p_squat_target_max => p_squat_target_max::numeric,
    p_deadlift_target_max => p_deadlift_target_max::numeric,
    p_overhead_press_target_max => p_overhead_press_target_max::numeric,
    p_bench_press_target_max => p_bench_press_target_max::numeric,
    p_weight_unit => p_weight_unit::weight_unit_enum
  );

  IF p_include_deload THEN
    PERFORM _impl.add_cycle(
      p_user_id => p_user_id::uuid,
      p_program_id => v_program_id::uuid,
      p_cycle_type => 'deload'::public.wendler_cycle_type_enum,
      p_squat_target_max => p_squat_target_max::numeric,
      p_deadlift_target_max => p_deadlift_target_max::numeric,
      p_overhead_press_target_max => p_overhead_press_target_max::numeric,
      p_bench_press_target_max => p_bench_press_target_max::numeric,
      p_weight_unit => p_weight_unit::weight_unit_enum
    );
  END IF;

  RETURN v_program_id;
END;
$$ LANGUAGE plpgsql VOLATILE;
