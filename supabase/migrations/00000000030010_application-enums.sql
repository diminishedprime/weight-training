-- This file has all the application enums that are needed for the database.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_type_enum') THEN
    CREATE TYPE public.exercise_type_enum AS ENUM (
      -- Barbell Exercises
      'barbell_deadlift',
      'barbell_romanian_deadlift',
      'barbell_back_squat',
      'barbell_front_squat',
      'barbell_bench_press',
      'barbell_incline_bench_press',
      'barbell_overhead_press',
      'barbell_row',
      'barbell_hip_thrust',
      'barbell_single_leg_squat',
      -- Olympic Barbell Exercises
      'barbell_snatch',
      'barbell_clean_and_jerk',
      -- Dumbbell Exercises
      'dumbbell_row',
      'dumbbell_bench_press',
      'dumbbell_incline_bench_press',
      'dumbbell_overhead_press',
      'dumbbell_bicep_curl',
      'dumbbell_hammer_curl',
      'dumbbell_wrist_curl', -- Is that what this is called?
      'dumbbell_fly',
      'dumbbell_lateral_raise',
      'dumbbell_skull_crusher',
      'dumbbell_preacher_curl',
      'dumbbell_front_raise',
      'dumbbell_shoulder_press',
      'dumbbell_split_squat',
      -- Machine Exercises
      'machine_converging_chest_press',
      'machine_diverging_lat_pulldown',
      'machine_diverging_low_row',
      'machine_converging_shoulder_press',
      'machine_lateral_raise',
      'machine_abdominal',
      'machine_back_extension',
      'machine_seated_leg_curl',
      'machine_leg_extension',
      'machine_leg_press',
      'machine_inner_thigh',
      'machine_outer_thigh',
      'machine_triceps_extension',
      'machine_biceps_curl',
      'machine_rear_delt',
      'machine_pec_fly',
      'machine_assissted_chinup',
      'machine_assissted_pullup',
      'machine_assissted_dip',
      'machine_cable_triceps_pushdown',
      -- Bodyweight Exercises
      'bodyweight_pushup',
      'bodyweight_situp',
      'bodyweight_pullup',
      'bodyweight_chinup',
      'bodyweight_dip',
      -- Kettlebell Exercises
      'kettlebell_swings',
      'kettlebell_front_squat',
      'kettlebell_row',
      -- Corner Case Exercises
      'plate_stack_calf_raise'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'completion_status_enum') THEN
    CREATE TYPE public.completion_status_enum AS ENUM (
      'completed',
      'not_completed',
      'failed',
      'skipped'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_type_enum') THEN
    CREATE TYPE public.equipment_type_enum AS ENUM (
      'barbell',
      'dumbbell',
      'kettlebell',
      'machine',
      'bodyweight',
      'plate_stack'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relative_effort_enum') THEN
    CREATE TYPE public.relative_effort_enum AS ENUM (
      'easy',
      'okay',
      'hard'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weight_unit_enum') THEN
    CREATE TYPE public.weight_unit_enum AS ENUM (
      'pounds',
      'kilograms'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_cycle_type_enum') THEN
    CREATE TYPE public.wendler_cycle_type_enum AS ENUM (
      '5',
      '3',
      '1',
      'deload'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'update_source_enum') THEN
    CREATE TYPE public.update_source_enum AS ENUM (
      'manual',
      'system'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_block_prereq_error_enum') THEN
    CREATE TYPE public.wendler_block_prereq_error_enum AS ENUM (
      'no_target_max',
      'unit_mismatch'
    );
  END IF;
END$$;
