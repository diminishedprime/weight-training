-- Enums used by wendler_metadata table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cycle_type_enum') THEN
    CREATE TYPE public.cycle_type_enum AS ENUM (
      '5',
      '3',
      '1',
      'deload'
    );
  END IF;
END$$;

-- Create wendler_metadata table
CREATE TABLE IF NOT EXISTS public.wendler_metadata
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    training_max_id uuid NOT NULL,
    increase_amount_id uuid NOT NULL,
    cycle_type cycle_type_enum NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    CONSTRAINT wendler_metadata_training_max_id_fkey FOREIGN KEY (training_max_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT wendler_metadata_increase_amount_id_fkey FOREIGN KEY (increase_amount_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT wendler_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
