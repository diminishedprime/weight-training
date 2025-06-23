-- Wendler metadata table
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

CREATE TABLE IF NOT EXISTS public.wendler_metadata
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    training_max_weight_id uuid NOT NULL,
    increase_amount_weight_id uuid NULL,
    cycle_type wendler_cycle_type_enum NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    updated_at timestamp with time zone DEFAULT timezone('utc', now()),
    CONSTRAINT wendler_metadata_pkey PRIMARY KEY (id),
    CONSTRAINT wendler_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE,
    CONSTRAINT wendler_metadata_training_max_weight_id_fkey FOREIGN KEY (training_max_weight_id) REFERENCES public.weights(id) ON DELETE RESTRICT,
    CONSTRAINT wendler_metadata_increase_amount_weight_id_fkey FOREIGN KEY (increase_amount_weight_id) REFERENCES public.weights(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.exercise_block
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    wendler_metadata_id uuid NULL,
    block_order integer NOT NULL,
    name text NULL,
    notes text NULL,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    updated_at timestamp with time zone DEFAULT timezone('utc', now()),
    CONSTRAINT exercise_block_pkey PRIMARY KEY (id),
    CONSTRAINT exercise_block_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE,
    CONSTRAINT exercise_block_wendler_metadata_id_fkey FOREIGN KEY (wendler_metadata_id) REFERENCES public.wendler_metadata(id) ON DELETE SET NULL
);

-- Join table for exercise_block <-> exercises (many-to-many)
CREATE TABLE IF NOT EXISTS public.exercise_block_exercises
(
    block_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    exercise_order integer NOT NULL,
    CONSTRAINT exercise_block_exercises_pkey PRIMARY KEY (block_id, exercise_id),
    CONSTRAINT fk_block FOREIGN KEY (block_id) REFERENCES public.exercise_block(id) ON DELETE CASCADE,
    CONSTRAINT fk_exercise FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE
);
