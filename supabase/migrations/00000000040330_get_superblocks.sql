DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'superblock_row') THEN
    CREATE TYPE public.block_detail_row AS (
      id uuid,
      exercise_type exercise_type_enum
    );
    CREATE TYPE public.superblock_row AS (
      id uuid,
      user_id uuid,
      name text,
      notes text,
      started_at timestamptz,
      completed_at timestamptz,
      block_details public.block_detail_row[],
      training_volume numeric
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'get_superblocks_result') THEN
    CREATE TYPE public.get_superblocks_result AS (
      superblocks public.superblock_row[],
      page_count integer
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_superblocks (p_user_id uuid, p_page_num integer) RETURNS public.get_superblocks_result AS $$
DECLARE
  p_limit integer := 10;
  -- Note: p_page_num is 1-indexed (page 1 is the first page)
  v_offset integer := (p_page_num - 1) * p_limit;
  v_superblocks public.superblock_row[];
  v_page_count integer;
BEGIN
  -- Raise exception if any set in any block in the superblock is not in pounds
  IF EXISTS (
    SELECT 1
    FROM public.exercise_superblock_blocks superblock_junction
    JOIN public.exercise_block block ON block.id = superblock_junction.block_id
    JOIN public.exercise_block_exercises block_junction ON block_junction.block_id = block.id
    JOIN public.exercises exercises ON exercises.id = block_junction.exercise_id
    WHERE superblock_junction.superblock_id IN (
      SELECT id FROM public.exercise_superblock WHERE user_id = p_user_id
    )
    AND exercises.weight_unit != 'pounds'
  ) THEN
    RAISE EXCEPTION 'Non-pound units found in exercises for this user''s superblocks. Only pounds are supported.';
  END IF;

  SELECT ARRAY(
    SELECT ROW(
      superblock.id,
      superblock.user_id,
      superblock.name,
      superblock.notes,
      superblock.started_at,
      superblock.completed_at,
      (
        SELECT ARRAY(
          SELECT ROW(
            superblock_junction.block_id,
            block.exercise_type
          )::public.block_detail_row
          FROM public.exercise_superblock_blocks superblock_junction
          JOIN public.exercise_block block ON block.id = superblock_junction.block_id
          WHERE superblock_junction.superblock_id = superblock.id
          ORDER BY superblock_junction.superblock_order
        )
      ),
      (
        -- Calculate training_volume for this superblock
        SELECT COALESCE(SUM(COALESCE(exercises.actual_weight_value, 0) * exercises.reps), 0)
        FROM public.exercise_superblock_blocks superblock_junction
        JOIN public.exercise_block block ON block.id = superblock_junction.block_id
        JOIN public.exercise_block_exercises block_junction ON block_junction.block_id = block.id
        JOIN public.exercises exercises ON exercises.id = block_junction.exercise_id
        WHERE superblock_junction.superblock_id = superblock.id
          AND exercises.weight_unit = 'pounds'
      )
    )::public.superblock_row
    FROM public.exercise_superblock superblock
    WHERE superblock.user_id = p_user_id
    ORDER BY superblock.started_at DESC NULLS LAST
    LIMIT p_limit OFFSET v_offset
  ) INTO v_superblocks;

  SELECT CEIL(COUNT(*)::numeric / p_limit)::integer INTO v_page_count
  FROM public.exercise_superblock
  WHERE user_id = p_user_id;

  RETURN (
    v_superblocks,
    v_page_count
  );
END;
$$ LANGUAGE plpgsql STABLE;
