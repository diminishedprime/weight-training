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
