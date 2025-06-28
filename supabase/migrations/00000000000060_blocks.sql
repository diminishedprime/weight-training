-- ========================================================================== --
--
-- Migration: 00000000000600_blocks.sql
--
-- Purpose: Defines core tables and enums for exercise blocks, superblocks, and
--          related metadata.
--
-- Strategy: Domain-driven, composable, and testable schema for fitness
--           tracking.
--
-- See: DATABASE_STRATEGY.md for philosophy and standards.
--
-- ========================================================================== --
--
-- Why blocks and superblocks?
-- ---------------------------------------------
-- Blocks represent a logical grouping of exercises that are performed together
-- as a unit—such as a set of sets/reps for a single exercise. They encapsulate
-- the details of a single training segment, including order, weight, reps, and
-- metadata. This is how you would track your squats or bench press which would
-- live within a superblock.
--
-- Superblocks are higher-level structures that organize multiple blocks into a
-- larger program, template, or workout session. A superblock can represent a
-- full workout, or a reusable template, and is composed of ordered blocks. This
-- separation allows for modular, reusable, and testable program design,
-- supporting both granular tracking and high-level planning. A superblock is
-- typically used for something like "push day" or "pull day" which would
-- contain many blocks of the specific exercises you're wanting to accomplish.
--
-- To make my life easier, we don't allow for "jagged" blocks, blocks containing
-- a heterogeneous mixing of exercises. Each block must contain a single type of
-- exercise.
-- 
-- In summary: a block is a single unit of work (e.g., "5 sets of 5 squats"),
-- while a superblock is a collection of blocks (e.g., "Monday workout").
-- ==============================================
--
-- Enum: wendler_cycle_type_enum
-- Purpose: Represents the type of Wendler training cycle (5/3/1/deload).
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

-- Table: wendler_metadata
--
-- Purpose: Stores Wendler cycle metadata for each user and exercise.
-- 
-- Why: The wendler_metadata table exists to support the 5/3/1 (Wendler)
--      strength training methodology, which requires tracking a user's training
--      max (the base weights used to calculate the training load) and cycle
--      type (week 1, 2, 3, or deload). This allows users to run multiple
--      cycles, adjust increments, and analyze progress over time for each
--      exercise, while keeping the core block/superblock structure generic and
--      extensible. The table links each user's Wendler-specific parameters to
--      their broader training data, supporting both templated and ad-hoc
--      programming.
-- 
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): FK to next_auth.users(id).
--   training_max_value (numeric): User's training max value.
--   training_max_unit (weight_unit_enum): User's training max unit.
--   increase_amount_value (numeric, nullable): Cycle increment value.
--   increase_amount_unit (weight_unit_enum, nullable): Cycle increment unit.
--   cycle_type (wendler_cycle_type_enum): Type of Wendler cycle.
--   exercise_type (exercise_type_enum): Exercise type for this cycle.
--   created_at, updated_at (timestamptz): Timestamps for record tracking.
CREATE TABLE IF NOT EXISTS public.wendler_metadata (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  training_max_value numeric NOT NULL,
  training_max_unit weight_unit_enum NOT NULL,
  increase_amount_value numeric NULL,
  increase_amount_unit weight_unit_enum NULL,
  cycle_type wendler_cycle_type_enum NOT NULL,
  exercise_type exercise_type_enum NOT NULL,
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT wendler_metadata_pkey PRIMARY KEY (id),
  CONSTRAINT wendler_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Table: exercise_block
-- Purpose: Represents a block of exercises (e.g., a set of sets/reps for a user).
--
-- Why: The exercise_block table is the core unit for tracking a group of
--      identical exercises performed together—such as "5 sets of 5 squats".
--      Each block contains only one exercise type, which simplifies analytics,
--      program design, and UI. This design avoids "jagged" or mixed-exercise
--      blocks, making it easy to reason about progress, completion, and
--      structure. Blocks are somewhat composable: with a bit of work they can
--      be reused, reordered, and included in superblocks to build larger
--      programs or templates. By isolating each block to a single exercise
--      type, we ensure data integrity, enable granular tracking, and support
--      flexible, testable flows for both templated and ad-hoc training.
--
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): FK to next_auth.users(id).
--   wendler_metadata_id (uuid, nullable): FK to wendler_metadata(id).
--   block_order (integer): Order of block in a superblock or program.
--   name, notes (text, nullable): Optional metadata.
--   created_at, updated_at (timestamptz): Timestamps for record tracking.
CREATE TABLE IF NOT EXISTS public.exercise_block (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  wendler_metadata_id uuid NULL,
  block_order integer NOT NULL,
  name text NULL,
  notes text NULL,
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT exercise_block_pkey PRIMARY KEY (id),
  CONSTRAINT exercise_block_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE,
  CONSTRAINT exercise_block_wendler_metadata_id_fkey FOREIGN KEY (wendler_metadata_id) REFERENCES public.wendler_metadata (id) ON DELETE SET NULL
);

-- Table: exercise_block_exercises (join table)
--
-- Purpose: Many-to-many join between exercise_block and exercises.
--
-- Why: The exercise_block_exercises table is a classic junction (join) table
--      that enables each block to contain multiple exercises (sets), and each
--      exercise to be reused in different blocks if needed. This design is
--      necessary because a block is composed of a sequence of individual
--      exercise records (e.g., each set of a "5x5" block is a separate row in
--      exercises), and we need to preserve both the association and the order
--      of those sets within the block. 
--
-- Columns:
--   block_id (uuid): FK to exercise_block(id).
--   exercise_id (uuid): FK to exercises(id).
--   exercise_order (integer): Order of exercise within the block.
CREATE TABLE IF NOT EXISTS public.exercise_block_exercises (
  block_id uuid NOT NULL,
  exercise_id uuid NOT NULL,
  exercise_order integer NOT NULL,
  CONSTRAINT exercise_block_exercises_pkey PRIMARY KEY (block_id, exercise_id),
  CONSTRAINT fk_block FOREIGN KEY (block_id) REFERENCES public.exercise_block (id) ON DELETE CASCADE,
  CONSTRAINT fk_exercise FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE
);

-- Table: exercise_superblock
-- Purpose: Represents a collection of exercise blocks (e.g., a workout program or template).
--
-- Why: The exercise_superblock table provides a high-level abstraction for
--      grouping multiple blocks into a single, ordered structure—such to
--      support the app need of a full training day, or reusable template for a
--      full training day. We intentionally use exactly two levels of
--      abstraction (block and superblock) rather than supporting arbitrary
--      nesting, to keep the schema simple, maintainable, and easy to reason
--      about. While we could have done this with more of a linked list setup,
--      This design covers the the real-world training flows we know we want to
--      support. For example, a "Push Day" would contain a
--      sequence of blocks (e.g., "Wendler Bench Press 3x5", "Wendler Overhead
--      Press 3x5", "Machine Chest Press", etc.).
-- 
--      Allowing deeper or arbitrary nesting would add significant complexity to
--      both the schema and application logic, with no (current) practical
--      benefit.
--
-- Columns:
--   id (uuid): Primary key.
--   user_id (uuid): FK to next_auth.users(id).
--   name, notes (text, nullable): Optional metadata.
--   created_at, updated_at (timestamptz): Timestamps for record tracking.
CREATE TABLE IF NOT EXISTS public.exercise_superblock (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  name text NULL,
  notes text NULL,
  created_at timestamp with time zone DEFAULT timezone ('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone ('utc', now()),
  CONSTRAINT exercise_superblock_pkey PRIMARY KEY (id),
  CONSTRAINT exercise_superblock_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Table: exercise_superblock_blocks (join table)
--
-- Purpose: Many-to-many join between exercise_superblock and exercise_block.
--
-- Why: The exercise_superblock_blocks table is a classic junction (join) table
--      that enables each superblock (e.g., a workout template or training day)
--      to contain an ordered sequence of blocks. This design is necessary
--      because a superblock is composed of a sequence of blocks (e.g., "Push
--      Day" is a sequence of "Wendler Bench Press 3x5", "Wendler Overhead Press
--      3x5", "Machine Chest Press"), and we need to preserve both the
--      association and the order of those blocks within the superblock. The
--      explicit superblock_order column ensures that the order of blocks within
--      a superblock is always preserved, which is critical for both analytics
--      and user experience. And also allows for reordering with some additional
--      work.
--
-- Columns:
--   superblock_id (uuid): FK to exercise_superblock(id).
--   block_id (uuid): FK to exercise_block(id).
--   superblock_order (integer): Order of block within the superblock.
CREATE TABLE IF NOT EXISTS public.exercise_superblock_blocks (
  superblock_id uuid NOT NULL,
  block_id uuid NOT NULL,
  superblock_order integer NOT NULL,
  CONSTRAINT exercise_superblock_blocks_pkey PRIMARY KEY (superblock_id, block_id),
  CONSTRAINT fk_superblock FOREIGN KEY (superblock_id) REFERENCES public.exercise_superblock (id) ON DELETE CASCADE,
  CONSTRAINT fk_block FOREIGN KEY (block_id) REFERENCES public.exercise_block (id) ON DELETE CASCADE
);

-- End of migration: 00000000000600_blocks.sql
