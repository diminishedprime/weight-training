DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_type_enum') THEN
    CREATE TYPE public.exercise_type_enum AS ENUM (
      'barbell_deadlift',
      'barbell_squat',
      'barbell_bench_press',
      'barbell_overhead_press',
      'barbell_row',
      'dumbbell_row'
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
      'bodyweight'
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
    CONSTRAINT exercises_id_pkey PRIMARY KEY (id),
    CONSTRAINT exercises_weight_id_fkey FOREIGN KEY (weight_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
