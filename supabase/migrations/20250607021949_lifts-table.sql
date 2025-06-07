-- Enums used by lifts table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lift_type_enum') THEN
    CREATE TYPE public.lift_type_enum AS ENUM (
      'deadlift',
      'squat',
      'bench_press',
      'overhead_press',
      'row'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'completion_status_enum') THEN
    CREATE TYPE public.completion_status_enum AS ENUM (
      'Completed',
      'Not Completed',
      'Failed',
      'Skipped'
    );
  END IF;
END$$;

-- Create lifts table
CREATE TABLE IF NOT EXISTS public.lifts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    lift_type lift_type_enum NOT NULL,
    performed_at timestamp with time zone NULL,
    weight_id uuid NOT NULL,
    reps integer NOT NULL,
    warmup boolean NOT NULL DEFAULT false,
    completion_status completion_status_enum NOT NULL DEFAULT 'Not Completed',
    notes text NULL,
    CONSTRAINT lifts_id_pkey PRIMARY KEY (id),
    CONSTRAINT lifts_weight_id_fkey FOREIGN KEY (weight_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT lifts_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
