DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_metadata_row') THEN
    CREATE TYPE public.wendler_metadata_row AS (
      id uuid,
      user_id uuid,
      training_max_value numeric,
      training_max_unit weight_unit_enum,
      increase_amount_value numeric,
      increase_amount_unit weight_unit_enum,
      cycle_type wendler_cycle_type_enum,
      exercise_type exercise_type_enum,
      created_at timestamptz,
      updated_at timestamptz,
      block_id uuid,
      block_name text,
      block_notes text,
      block_created_at timestamptz,
      block_updated_at timestamptz,
      active_exercise_id uuid
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_wendler_metadata (p_block_id UUID, p_user_id UUID) RETURNS public.wendler_metadata_row LANGUAGE sql STABLE AS $$
  SELECT
    wm.id,
    wm.user_id,
    wm.training_max_value,
    wm.training_max_unit,
    wm.increase_amount_value,
    wm.increase_amount_unit,
    wm.cycle_type,
    wm.exercise_type,
    wm.created_at,
    wm.updated_at,
    b.id AS block_id,
    b.name AS block_name,
    b.notes AS block_notes,
    b.created_at AS block_created_at,
    b.updated_at AS block_updated_at,
    b.active_exercise_id
  FROM public.exercise_block b
  JOIN public.wendler_metadata wm ON wm.block_id = b.id
  WHERE b.id = p_block_id
    AND b.user_id = p_user_id
  LIMIT 1;
$$;
