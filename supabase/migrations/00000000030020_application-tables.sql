CREATE TABLE IF NOT EXISTS public.exercises (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  equipment_type equipment_type_enum NOT NULL DEFAULT 'barbell',
  performed_at timestamp with time zone NULL,
  -- I think for doing actual vs target weight, I may want to do the join
  -- on a separate wendler-specific exercises table or something like that since
  -- so many exercises don't need a separation between actual and target weight?
  --
  -- I guess it's not really specifically a wendler thing, but anything that may
  -- come from a block that tries to do fractional weight based on some other
  -- value.
  --
  -- That being the case, maybe it's that there's some join tables that exist
  -- when the block itself is trying to calculate a weight based on some
  -- fractions?
  actual_weight_value numeric NULL,
  target_weight_value numeric NOT NULL,
  weight_unit weight_unit_enum NOT NULL,
  reps integer NOT NULL,
  is_warmup boolean NOT NULL DEFAULT false,
  is_amrap boolean NOT NULL DEFAULT false,
  completion_status completion_status_enum NOT NULL DEFAULT 'not_completed',
  notes text NULL,
  perceived_effort perceived_effort_enum NULL,
  CONSTRAINT exercises_id_pkey PRIMARY KEY (id)
  -- TODO: Re-enable this constraint once Steph & Matt exist in production database
  -- The constraint is temporarily disabled to allow seeding imported exercise data
  -- without pre-creating user records, since some auth fields can't be determined ahead of time
  -- CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.exercise_block (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  name text NULL,
  notes text NULL,
  exercise_type exercise_type_enum NOT NULL,
  equipment_type equipment_type_enum NOT NULL,
  active_exercise_id uuid NULL,
  completion_status completion_status_enum NOT NULL DEFAULT 'not_completed',
  started_at timestamp with time zone NULL,
  completed_at timestamp with time zone NULL,
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT exercise_block_pkey PRIMARY KEY (id),
  CONSTRAINT exercise_block_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT exercise_block_active_exercise_id_fkey FOREIGN KEY (active_exercise_id) REFERENCES public.exercises (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.exercise_block_exercises (
  block_id uuid NOT NULL,
  exercise_id uuid NOT NULL,
  exercise_order integer NOT NULL,
  CONSTRAINT exercise_block_exercises_pkey PRIMARY KEY (block_id, exercise_order),
  CONSTRAINT fk_block FOREIGN KEY (block_id) REFERENCES public.exercise_block (id) ON DELETE CASCADE,
  CONSTRAINT fk_exercise FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.exercise_superblock (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  name text NULL,
  notes text NULL,
  started_at timestamp with time zone NULL,
  completed_at timestamp with time zone NULL,
  -- TODO: here and throughout, remove created_at and updated_at
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT exercise_superblock_pkey PRIMARY KEY (id),
  CONSTRAINT exercise_superblock_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.exercise_superblock_blocks (
  superblock_id uuid NOT NULL,
  block_id uuid NOT NULL,
  superblock_order integer NOT NULL,
  CONSTRAINT exercise_superblock_blocks_pkey PRIMARY KEY (superblock_id, block_id),
  CONSTRAINT fk_superblock FOREIGN KEY (superblock_id) REFERENCES public.exercise_superblock (id) ON DELETE CASCADE,
  CONSTRAINT fk_block FOREIGN KEY (block_id) REFERENCES public.exercise_block (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.wendler_program (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  name text NOT NULL,
  notes text NULL,
  CONSTRAINT wendler_program_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Table for Cycles within a Wendler Program
CREATE TABLE IF NOT EXISTS public.wendler_program_cycle (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  wendler_program_id uuid NOT NULL,
  user_id uuid NOT NULL,
  cycle_type wendler_cycle_type_enum NOT NULL,
  CONSTRAINT fk_wendler_program FOREIGN KEY (wendler_program_id) REFERENCES public.wendler_program (id) ON DELETE CASCADE,
  CONSTRAINT wendler_program_cycle_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Table for Movements within a Cycle
CREATE TABLE IF NOT EXISTS public.wendler_program_cycle_movement (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  wendler_program_cycle_id uuid NOT NULL,
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  training_max_value numeric NOT NULL,
  increase_amount_value numeric NOT NULL,
  weight_unit weight_unit_enum NOT NULL,
  block_id uuid NOT NULL,
  CONSTRAINT fk_wendler_program_cycle FOREIGN KEY (wendler_program_cycle_id) REFERENCES public.wendler_program_cycle (id) ON DELETE CASCADE,
  CONSTRAINT wendler_program_cycle_movement_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT fk_block FOREIGN KEY (block_id) REFERENCES public.exercise_block (id) ON DELETE CASCADE
);

-- Table for Blocks within a Movement
-- Removed: Each movement now has exactly one block via block_id
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  preferred_weight_unit weight_unit_enum DEFAULT 'pounds',
  default_rest_time integer DEFAULT 120,
  available_plates_lbs numeric[] DEFAULT ARRAY[]::numeric[],
  available_dumbbells_lbs numeric[] DEFAULT ARRAY[]::numeric[],
  available_kettlebells_lbs numeric[] DEFAULT ARRAY[]::numeric[],
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT user_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_preferences_user_unique UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.personal_record_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  weight_value numeric NOT NULL,
  weight_unit weight_unit_enum NOT NULL,
  reps integer NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT timezone ('utc', now()),
  source update_source_enum NOT NULL DEFAULT 'manual',
  notes text,
  exercise_id uuid NULL,
  CONSTRAINT personal_record_history_pkey PRIMARY KEY (id),
  -- TODO: Re-enable this constraint once Steph & Matt exist in production database
  -- CONSTRAINT personal_record_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT personal_record_history_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.target_max_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  weight_value numeric NOT NULL,
  weight_unit weight_unit_enum NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT timezone ('utc', now()),
  source update_source_enum NOT NULL DEFAULT 'manual',
  notes text,
  CONSTRAINT target_max_history_pkey PRIMARY KEY (id),
  CONSTRAINT target_max_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.form_drafts (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  page_path text NOT NULL,
  form_data jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone ('utc', now()),
  expires_at timestamp with time zone NOT NULL DEFAULT timezone ('utc', now()) + INTERVAL '7 days',
  CONSTRAINT form_drafts_pkey PRIMARY KEY (id),
  CONSTRAINT form_drafts_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT form_drafts_user_page_unique UNIQUE (user_id, page_path)
);
