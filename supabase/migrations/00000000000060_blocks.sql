CREATE TABLE IF NOT EXISTS public.exercise_block (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  name text NULL,
  notes text NULL,
  active_exercise_id uuid NULL,
  completion_status completion_status_enum NOT NULL DEFAULT 'not_completed',
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

CREATE TABLE IF NOT EXISTS public.wendler_metadata (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  block_id uuid NOT NULL,
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
  CONSTRAINT wendler_metadata_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.exercise_block (id) ON DELETE CASCADE,
  CONSTRAINT wendler_metadata_block_id_unique UNIQUE (block_id),
  CONSTRAINT wendler_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users (id) ON DELETE CASCADE
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_block_with_wendler_row') THEN
    CREATE TYPE public.exercise_block_with_wendler_row AS (
      id uuid,
      user_id uuid,
      name text,
      notes text,
      active_exercise_id uuid,
      created_at timestamptz,
      updated_at timestamptz,
      total_exercises integer,
      current_exercise_index integer,
      -- Wendler metadata fields (nullable)
      wendler_id uuid,
      training_max_value numeric,
      training_max_unit weight_unit_enum,
      increase_amount_value numeric,
      increase_amount_unit weight_unit_enum,
      cycle_type wendler_cycle_type_enum,
      exercise_type exercise_type_enum
    );
  END IF;
END$$;

-- This index is to optimize the sub-selects in the get_exercise_blocks_for_user
-- function
CREATE INDEX IF NOT EXISTS idx_exercise_block_exercises_blockid_exerciseid_order ON exercise_block_exercises (block_id, exercise_id, exercise_order);

CREATE OR REPLACE FUNCTION public.get_exercise_blocks_for_user (p_user_id uuid, p_page integer DEFAULT 1) RETURNS SETOF public.exercise_block_with_wendler_row AS $$
DECLARE
  v_limit integer := 10;
  v_offset integer := (GREATEST(p_page, 1) - 1) * 10;
BEGIN
  RETURN QUERY
  SELECT
    exercise_block.id,
    exercise_block.user_id,
    exercise_block.name,
    exercise_block.notes,
    exercise_block.active_exercise_id,
    exercise_block.created_at,
    exercise_block.updated_at,
    (
      SELECT COUNT(*)::integer
      FROM exercise_block_exercises
      WHERE exercise_block_exercises.block_id = exercise_block.id
    ) AS total_exercises,
    (
      SELECT (exercise_block_exercises.exercise_order - 1)::integer
      FROM exercise_block_exercises
      WHERE exercise_block_exercises.block_id = exercise_block.id AND exercise_block_exercises.exercise_id = exercise_block.active_exercise_id
      LIMIT 1
    ) AS current_exercise_index,
    wendler_metadata.id AS wendler_id,
    wendler_metadata.training_max_value,
    wendler_metadata.training_max_unit,
    wendler_metadata.increase_amount_value,
    wendler_metadata.increase_amount_unit,
    wendler_metadata.cycle_type,
    wendler_metadata.exercise_type
  FROM exercise_block
  LEFT JOIN wendler_metadata ON wendler_metadata.block_id = exercise_block.id
  WHERE exercise_block.user_id = p_user_id
  ORDER BY exercise_block.created_at DESC, exercise_block.id DESC
  LIMIT v_limit OFFSET v_offset;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.get_next_exercise_in_block (p_block_id uuid, p_exercise_id uuid) RETURNS uuid AS $$
DECLARE
  v_next_exercise_id uuid;
BEGIN
  SELECT ebe2.exercise_id INTO v_next_exercise_id
  FROM exercise_block_exercises ebe1
  JOIN exercise_block_exercises ebe2 ON ebe1.block_id = ebe2.block_id
  WHERE ebe1.block_id = p_block_id
    AND ebe1.exercise_id = p_exercise_id
    AND ebe2.exercise_order = ebe1.exercise_order + 1
  LIMIT 1;
  RETURN v_next_exercise_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- TODO: for functions like this, we actually want a separate namespace so they
-- don't pollute the RPCs that have types generated. This already is set up to
-- work for _trigger, but we probably want a different namespace for these.
CREATE OR REPLACE FUNCTION public.set_active_exercise_or_complete_block (
  p_block_id uuid,
  p_user_id uuid,
  p_current_exercise_id uuid
) RETURNS void AS $$
DECLARE
  v_next_exercise_id uuid;
BEGIN
  v_next_exercise_id := get_next_exercise_in_block(p_block_id, p_current_exercise_id);
  IF v_next_exercise_id IS NOT NULL THEN
    UPDATE exercise_block
    SET active_exercise_id = v_next_exercise_id
    WHERE id = p_block_id AND user_id = p_user_id;
  ELSE
    UPDATE exercise_block
    SET active_exercise_id = NULL, completion_status = 'completed'
    WHERE id = p_block_id AND user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.skip_block_row (
  p_user_id uuid,
  p_block_id uuid,
  p_exercise_id uuid,
  p_notes text DEFAULT NULL
) RETURNS void AS $$
DECLARE
BEGIN
  UPDATE exercises e
  SET completion_status = 'not_completed',
      notes = COALESCE(p_notes, e.notes),
      performed_at = now()
  FROM exercise_block_exercises ebe
  JOIN exercise_block b ON ebe.block_id = b.id
  WHERE e.id = ebe.exercise_id
    AND ebe.block_id = p_block_id
    AND ebe.exercise_id = p_exercise_id
    AND b.user_id = p_user_id;
  PERFORM set_active_exercise_or_complete_block(p_block_id, p_user_id, p_exercise_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.fail_block_row (
  p_user_id uuid,
  p_block_id uuid,
  p_exercise_id uuid,
  p_reps integer DEFAULT NULL,
  p_actual_weight_value numeric DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS void AS $$
DECLARE
BEGIN
  UPDATE exercises e
  SET completion_status = 'failed',
      reps = COALESCE(p_reps, e.reps),
      actual_weight_value = COALESCE(p_actual_weight_value, e.actual_weight_value),
      notes = COALESCE(p_notes, e.notes),
      performed_at = now()
  FROM exercise_block_exercises ebe
  JOIN exercise_block b ON ebe.block_id = b.id
  WHERE e.id = ebe.exercise_id
    AND ebe.block_id = p_block_id
    AND ebe.exercise_id = p_exercise_id
    AND b.user_id = p_user_id;
  PERFORM set_active_exercise_or_complete_block(p_block_id, p_user_id, p_exercise_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.finish_block_row (
  p_user_id uuid,
  p_block_id uuid,
  p_exercise_id uuid,
  p_reps integer DEFAULT NULL,
  p_actual_weight_value numeric DEFAULT NULL,
  p_relative_effort relative_effort_enum DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS void AS $$
DECLARE
BEGIN
  UPDATE exercises e
  SET completion_status = 'completed',
      reps = COALESCE(p_reps, e.reps),
      actual_weight_value = COALESCE(p_actual_weight_value, e.actual_weight_value),
      relative_effort = COALESCE(p_relative_effort, e.relative_effort),
      notes = COALESCE(p_notes, e.notes),
      performed_at = now()
  FROM exercise_block_exercises ebe
  JOIN exercise_block b ON ebe.block_id = b.id
  WHERE e.id = ebe.exercise_id
    AND ebe.block_id = p_block_id
    AND ebe.exercise_id = p_exercise_id
    AND b.user_id = p_user_id;
  PERFORM set_active_exercise_or_complete_block(p_block_id, p_user_id, p_exercise_id);
END;
$$ LANGUAGE plpgsql;
