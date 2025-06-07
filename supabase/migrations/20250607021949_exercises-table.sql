DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_type_enum') THEN
    CREATE TYPE public.exercise_type_enum AS ENUM (
      -- Barbell Exercises
      'barbell_deadlift',
      'barbell_squat',
      'barbell_bench_press',
      'barbell_overhead_press',
      'barbell_row',
      -- Dumbell Exercises
      'dumbbell_row',
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
      -- Bodyweight Exercises
      'pushup',
      'situp',
      'pullup',
      'chinup',
      -- Weird corner case exercises
      'plate_stack_calf_raise'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'completion_status_enum') THEN
    CREATE TYPE public.completion_status_enum AS ENUM (
      'completed',
      'not_completed',
      'failed',
      'skipped'
    );
  END IF;
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
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relative_effort_enum') THEN
    CREATE TYPE public.relative_effort_enum AS ENUM (
      'easy',
      'okay',
      'hard'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.exercises
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    equipment_type equipment_type_enum NOT NULL DEFAULT 'barbell',
    performed_at timestamp with time zone NULL,
    weight_id uuid NOT NULL,
    reps integer NOT NULL,
    warmup boolean NOT NULL DEFAULT false,
    completion_status completion_status_enum NOT NULL DEFAULT 'not_completed',
    notes text NULL,
    relative_effort relative_effort_enum NULL,
    CONSTRAINT exercises_id_pkey PRIMARY KEY (id),
    CONSTRAINT exercises_weight_id_fkey FOREIGN KEY (weight_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
