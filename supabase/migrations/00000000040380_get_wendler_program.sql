DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'p_wendler_movement_row') THEN
    CREATE TYPE public.p_wendler_movement_row AS (
      id uuid,
      exercise_type exercise_type_enum,
      training_max_value numeric,
      increase_amount_value numeric,
      weight_unit weight_unit_enum,
      block_id uuid,
      superblock_id uuid,
      equipment_type equipment_type_enum,
      started_at timestamptz,
      completed_at timestamptz,
      notes text,
      heaviest_weight_value numeric,
      reps_of_last_set numeric
    );
    CREATE TYPE public.p_wendler_cycle_row AS (
      id uuid,
      cycle_type wendler_cycle_type_enum,
      started_at timestamptz,
      completed_at timestamptz,
      movements public.p_wendler_movement_row[]
    );
    CREATE TYPE public.get_wendler_program_result AS (
      id uuid,
      user_id uuid,
      name text,
      started_at timestamptz,
      completed_at timestamptz,
      notes text,
      cycles public.p_wendler_cycle_row[]
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_wendler_program (p_user_id uuid, p_program_id uuid) RETURNS public.get_wendler_program_result AS $$
DECLARE
  v_program public.get_wendler_program_result;
BEGIN
  SELECT
    wp.id,
    wp.user_id,
    wp.name,
    (
      SELECT MIN(eb.started_at)
      FROM public.wendler_program_cycle wpc
      JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpc.wendler_program_id = wp.id AND eb.started_at IS NOT NULL
    ),
    -- Program completed_at: latest completed_at of all blocks, but only if all blocks have completed_at
    (
      SELECT CASE WHEN COUNT(*) FILTER (WHERE eb.completed_at IS NULL) = 0 AND COUNT(*) > 0
        THEN MAX(eb.completed_at)
        ELSE NULL END
      FROM public.wendler_program_cycle wpc
      JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
      JOIN public.exercise_block eb ON wpcm.block_id = eb.id
      WHERE wpc.wendler_program_id = wp.id
    ),
    wp.notes,
    (
      SELECT ARRAY(
        SELECT ROW(
          wpc.id,
          wpc.cycle_type,
          -- Cycle started_at: earliest started_at of any block connected to any movement in this cycle
          (
            SELECT MIN(eb.started_at)
            FROM public.wendler_program_cycle_movement wpcm
            JOIN public.exercise_block eb ON wpcm.block_id = eb.id
            WHERE wpcm.wendler_program_cycle_id = wpc.id AND eb.started_at IS NOT NULL
          ),
          -- Cycle completed_at: latest completed_at of all blocks, but only if all blocks have completed_at
          (
            SELECT CASE WHEN COUNT(*) FILTER (WHERE eb.completed_at IS NULL) = 0 AND COUNT(*) > 0
              THEN MAX(eb.completed_at)
              ELSE NULL END
            FROM public.wendler_program_cycle_movement wpcm
            JOIN public.exercise_block eb ON wpcm.block_id = eb.id
            WHERE wpcm.wendler_program_cycle_id = wpc.id
          ),
          (
            SELECT ARRAY(
              SELECT ROW(
                wpcm.id,
                wpcm.exercise_type,
                wpcm.training_max_value,
                wpcm.increase_amount_value,
                wpcm.weight_unit,
                wpcm.block_id,
                (
                  SELECT esb.superblock_id
                  FROM public.exercise_superblock_blocks esb
                  WHERE esb.block_id = eb.id
                  LIMIT 1
                ),
                eb.equipment_type,
                eb.started_at,
                eb.completed_at,
                eb.notes,
                (
                  SELECT MAX(COALESCE(ex.actual_weight_value, ex.target_weight_value))
                  FROM public.exercise_block_exercises ebe
                  JOIN public.exercises ex ON ebe.exercise_id = ex.id
                  WHERE ebe.block_id = eb.id AND ex.is_warmup = false
                ),
                (
                  SELECT MAX(ex.reps)
                  FROM public.exercise_block_exercises ebe
                  JOIN public.exercises ex ON ebe.exercise_id = ex.id
                  WHERE ebe.block_id = eb.id AND ex.is_warmup = false
                )
              )::public.p_wendler_movement_row
              FROM public.wendler_program_cycle_movement wpcm
              JOIN public.exercise_block eb ON wpcm.block_id = eb.id
              LEFT JOIN public.exercise_superblock_blocks esb ON eb.id = esb.block_id
              WHERE wpcm.wendler_program_cycle_id = wpc.id
              ORDER BY wpcm.exercise_type
            )
          )
        )::public.p_wendler_cycle_row
        FROM public.wendler_program_cycle wpc
        WHERE wpc.wendler_program_id = wp.id
        ORDER BY (
          SELECT MIN(eb.started_at)
          FROM public.wendler_program_cycle_movement wpcm
          JOIN public.exercise_block eb ON wpcm.block_id = eb.id
          WHERE wpcm.wendler_program_cycle_id = wpc.id AND eb.started_at IS NOT NULL
        ) ASC NULLS LAST
      )
    )
  INTO v_program
  FROM public.wendler_program wp
  WHERE wp.user_id = p_user_id AND wp.id = p_program_id;

  RETURN v_program;
END;
$$ LANGUAGE plpgsql STABLE;
