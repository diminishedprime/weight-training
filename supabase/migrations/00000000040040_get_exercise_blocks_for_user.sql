DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_block_with_wendler_row') THEN
    CREATE TYPE public.exercise_block_with_wendler_row AS (
      id uuid,
      user_id uuid,
      name text,
      notes text,
      active_exercise_id uuid,
      started_at timestamptz,
      completed_at timestamptz,
      total_exercises integer,
      current_exercise_index integer,
      -- Wendler metadata fields (nullable)
      wendler_id uuid,
      training_max_value numeric,
      training_max_unit weight_unit_enum,
      increase_amount_value numeric,
      increase_amount_unit weight_unit_enum,
      cycle_type wendler_cycle_type_enum,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'get_exercise_blocks_result') THEN
    CREATE TYPE public.get_exercise_blocks_result AS (
      blocks public.exercise_block_with_wendler_row[],
      page_count integer
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_exercise_blocks (p_user_id uuid, p_page integer DEFAULT 1) RETURNS public.get_exercise_blocks_result AS $$
DECLARE
  v_limit integer := 10;
  v_offset integer := (GREATEST(p_page, 1) - 1) * v_limit;
  v_blocks public.exercise_block_with_wendler_row[];
  v_page_count integer;
BEGIN
  SELECT ARRAY(
    SELECT ROW(
      exercise_block.id,
      exercise_block.user_id,
      exercise_block.name,
      exercise_block.notes,
      exercise_block.active_exercise_id,
      exercise_block.started_at,
      exercise_block.completed_at,
      (
        SELECT COUNT(*)::integer
        FROM exercise_block_exercises
        WHERE exercise_block_exercises.block_id = exercise_block.id
      ),
      (
        SELECT (exercise_block_exercises.exercise_order - 1)::integer
        FROM exercise_block_exercises
        WHERE exercise_block_exercises.block_id = exercise_block.id AND exercise_block_exercises.exercise_id = exercise_block.active_exercise_id
        LIMIT 1
      ),
      wendler_metadata.id,
      wendler_metadata.training_max_value,
      wendler_metadata.training_max_unit,
      wendler_metadata.increase_amount_value,
      wendler_metadata.increase_amount_unit,
      wendler_metadata.cycle_type,
      exercise_block.exercise_type,
      exercise_block.equipment_type
    )::public.exercise_block_with_wendler_row
    FROM exercise_block
    LEFT JOIN wendler_metadata ON wendler_metadata.block_id = exercise_block.id
    WHERE exercise_block.user_id = p_user_id
      AND exercise_block.started_at IS NOT NULL
    ORDER BY exercise_block.started_at DESC, exercise_block.id DESC
    LIMIT v_limit OFFSET v_offset
  ) INTO v_blocks;

  SELECT CEIL(COUNT(*)::numeric / v_limit)::integer INTO v_page_count
  FROM exercise_block
  WHERE exercise_block.user_id = p_user_id;

  RETURN (
    v_blocks,
    v_page_count
  );
END;
$$ LANGUAGE plpgsql STABLE;
