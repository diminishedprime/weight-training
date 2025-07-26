-- Returns a brief UI string for a given exercise_type_enum value
CREATE OR REPLACE FUNCTION _system.exercise_type_ui_string_brief (type public.exercise_type_enum) RETURNS text AS $$
BEGIN
  CASE type
    -- barbell
    WHEN 'barbell_deadlift' THEN RETURN 'Deadlift';
    WHEN 'barbell_back_squat' THEN RETURN 'Back Squat';
    WHEN 'barbell_front_squat' THEN RETURN 'Front Squat';
    WHEN 'barbell_bench_press' THEN RETURN 'Bench Press';
    WHEN 'barbell_row' THEN RETURN 'Row';
    WHEN 'barbell_overhead_press' THEN RETURN 'Overhead Press';
    WHEN 'barbell_incline_bench_press' THEN RETURN 'Incline Bench Press';
    WHEN 'barbell_romanian_deadlift' THEN RETURN 'Romanian Deadlift';
    WHEN 'barbell_snatch' THEN RETURN 'Snatch';
    WHEN 'barbell_clean_and_jerk' THEN RETURN 'Clean and Jerk';
    WHEN 'barbell_hip_thrust' THEN RETURN 'Hip Thrust';
    WHEN 'barbell_single_leg_squat' THEN RETURN 'Single Leg Squat';
    -- dumbbell
    WHEN 'dumbbell_row' THEN RETURN 'Row';
    WHEN 'dumbbell_bench_press' THEN RETURN 'Bench Press';
    WHEN 'dumbbell_incline_bench_press' THEN RETURN 'Incline Bench Press';
    WHEN 'dumbbell_overhead_press' THEN RETURN 'Overhead Press';
    WHEN 'dumbbell_bicep_curl' THEN RETURN 'Bicep Curl';
    WHEN 'dumbbell_hammer_curl' THEN RETURN 'Hammer Curl';
    WHEN 'dumbbell_wrist_curl' THEN RETURN 'Wrist Curl';
    WHEN 'dumbbell_fly' THEN RETURN 'Fly';
    WHEN 'dumbbell_lateral_raise' THEN RETURN 'Lateral Raise';
    WHEN 'dumbbell_skull_crusher' THEN RETURN 'Skull Crusher';
    WHEN 'dumbbell_preacher_curl' THEN RETURN 'Preacher Curl';
    WHEN 'dumbbell_front_raise' THEN RETURN 'Front Raise';
    WHEN 'dumbbell_shoulder_press' THEN RETURN 'Shoulder Press';
    WHEN 'dumbbell_split_squat' THEN RETURN 'Split Squat';
    -- kettlebell
    WHEN 'kettlebell_row' THEN RETURN 'Kettlebell Row';
    WHEN 'kettlebell_swings' THEN RETURN 'Kettlebell Swings';
    WHEN 'kettlebell_front_squat' THEN RETURN 'Kettlebell Front Squat';
    -- bodyweight
    WHEN 'bodyweight_pushup' THEN RETURN 'Push Up';
    WHEN 'bodyweight_situp' THEN RETURN 'Sit Up';
    WHEN 'bodyweight_pullup' THEN RETURN 'Pull Up';
    WHEN 'bodyweight_chinup' THEN RETURN 'Chin Up';
    WHEN 'bodyweight_dip' THEN RETURN 'Dip';
    -- machine
    WHEN 'machine_converging_chest_press' THEN RETURN 'Converging Chest Press';
    WHEN 'machine_diverging_lat_pulldown' THEN RETURN 'Diverging Lat Pulldown';
    WHEN 'machine_diverging_low_row' THEN RETURN 'Diverging Low Row';
    WHEN 'machine_converging_shoulder_press' THEN RETURN 'Converging Shoulder Press';
    WHEN 'machine_lateral_raise' THEN RETURN 'Lateral Raise';
    WHEN 'machine_abdominal' THEN RETURN 'Abdominal';
    WHEN 'machine_leg_extension' THEN RETURN 'Leg Extension';
    WHEN 'machine_seated_leg_curl' THEN RETURN 'Leg Curl';
    WHEN 'machine_leg_press' THEN RETURN 'Leg Press';
    WHEN 'machine_pec_fly' THEN RETURN 'Pec Fly';
    WHEN 'machine_back_extension' THEN RETURN 'Back Extension';
    WHEN 'machine_inner_thigh' THEN RETURN 'Inner Thigh';
    WHEN 'machine_outer_thigh' THEN RETURN 'Outer Thigh';
    WHEN 'machine_triceps_extension' THEN RETURN 'Triceps Extension';
    WHEN 'machine_biceps_curl' THEN RETURN 'Biceps Curl';
    WHEN 'machine_rear_delt' THEN RETURN 'Rear Delt';
    WHEN 'machine_assissted_chinup' THEN RETURN 'Assisted Chin Up';
    WHEN 'machine_assissted_pullup' THEN RETURN 'Assisted Pull Up';
    WHEN 'machine_assissted_dip' THEN RETURN 'Assisted Dip';
    WHEN 'machine_cable_triceps_pushdown' THEN RETURN 'Cable Triceps Pushdown';
    -- plate_stack
    WHEN 'plate_stack_calf_raise' THEN RETURN 'Calf Raise';
    ELSE
      RETURN type;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
