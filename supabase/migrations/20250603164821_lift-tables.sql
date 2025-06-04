--
-- Create weights table and necessary enums.
-- 
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weight_unit_enum') THEN
    CREATE TYPE public.weight_unit_enum AS ENUM (
      'pounds',
      'kilograms'
    );
  END IF;
END$$;
CREATE TABLE IF NOT EXISTS public.weights
(
    -- Unique identifier for each weight entry.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- The weight value, assuming nobody weighs over 999.99 lbs.
    weight_value numeric(5, 2) NOT NULL,
    -- should be either 'pounds' or 'kilograms'
    weight_unit weight_unit_enum NOT NULL DEFAULT 'pounds',

    CONSTRAINT weights_pkey PRIMARY KEY (id)
);

--
-- Create lifts table and necessary enums.
--
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
CREATE TABLE IF NOT EXISTS public.lifts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    lift_type lift_type_enum NOT NULL,
    -- The time that the lift was performed. The timestamp can be null
    -- because sometimes lifts are "recorded" before they actually happen, for
    -- example, when you're setting up the intended lifts for an exercise such
    -- as a 5s day.
    performed_at timestamp with time zone NULL,
    -- A pointer at a weight row which includes both the weight value and the unit
    weight_id uuid NOT NULL,
    -- How many repititions were performed for this lift.
    reps integer NOT NULL,
    -- Indicates if the lift is a warmup or not.
    warmup boolean NOT NULL DEFAULT false,
    -- completion_status
    completion_status completion_status_enum NOT NULL DEFAULT 'Not Completed',
    -- Free-form notes about the lift
    notes text NULL,

    CONSTRAINT lifts_id_pkey PRIMARY KEY (id),
    CONSTRAINT lifts_weight_id_fkey FOREIGN KEY (weight_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT lifts_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);

-- 
-- Create workout_session table
-- 
CREATE TABLE IF NOT EXISTS public.workout_session
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    -- Optional: a name or description for the workout session
    name text NULL,
    notes text NULL,

    CONSTRAINT workout_session_pkey PRIMARY KEY (id),
    CONSTRAINT workout_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);

--
-- Create lift_group table
--
CREATE TABLE IF NOT EXISTS public.lift_group 
(
    -- Unique identifier for each lift group.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    -- This is a pointer at the wendler_metadata table. This will be null unless
    -- the lift_group is a part of a wendler training program.
    wendler_id uuid NULL,

    CONSTRAINT lift_group_id_pkey PRIMARY KEY (id),
    CONSTRAINT lift_group_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);

-- 
-- Create wendler_metadata table and necessary enums.
--
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
CREATE TABLE IF NOT EXISTS public.wendler_metadata
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- The user who owns this metadata
    user_id uuid NOT NULL,
    -- The training max for this group. Training max is calculated as 90% of
    -- your current actual 1-rep max. It is a pointer at a weight row which
    -- includes both the weight value and the unit
    training_max_id uuid NOT NULL,
    increase_amount_id uuid NOT NULL,
    cycle_type cycle_type_enum NOT NULL,
    lift_type lift_type_enum NOT NULL,

    CONSTRAINT wendler_metadata_training_max_id_fkey FOREIGN KEY (training_max_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT wendler_metadata_increase_amount_id_fkey FOREIGN KEY (increase_amount_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT wendler_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);

-- 
-- Create exercise_block table
-- 
CREATE TABLE IF NOT EXISTS public.exercise_block
(
    -- Unique identifier for each record in the junction table.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- The user who owns this exercise block
    user_id uuid NOT NULL,
    -- Reference to the lift group.
    lift_group_id uuid NOT NULL,
    -- Reference to the lift.
    lift_id uuid NOT NULL,
    -- The order of the lift in the group.
    block_order integer,
    -- Optional: associate this exercise block with a workout session
    workout_session_id uuid NULL,

    CONSTRAINT exercise_block_lifts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_lift_group FOREIGN KEY (lift_group_id) REFERENCES public.lift_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_lift FOREIGN KEY (lift_id) REFERENCES public.lifts(id) ON DELETE CASCADE,
    CONSTRAINT exercise_block_workout_session_id_fkey FOREIGN KEY (workout_session_id) REFERENCES public.workout_session(id) ON DELETE SET NULL,
    CONSTRAINT exercise_block_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);