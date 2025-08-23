-- Started at and completed at should just be calculated directly.
ALTER TABLE public.wendler_program
DROP COLUMN IF EXISTS started_at;

ALTER TABLE public.wendler_program
DROP COLUMN IF EXISTS completed_at;

DROP FUNCTION IF EXISTS public.get_wendler_program;

CREATE OR REPLACE FUNCTION public.get_wendler_program (p_user_id uuid, p_program_id uuid) RETURNS public.get_wendler_program_result AS $$
DECLARE
  v_program public.get_wendler_program_result;
BEGIN
  WITH block_dates AS (
    SELECT
      MIN(eb.started_at) AS started_at,
      CASE
        WHEN COUNT(*) FILTER (WHERE eb.completion_status = 'completed') = COUNT(*)
          THEN MAX(eb.completed_at)
        ELSE NULL
      END AS completed_at
    FROM public.wendler_program_cycle wpc
    JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
    JOIN public.exercise_block eb ON wpcm.block_id = eb.id
    WHERE wpc.wendler_program_id = p_program_id
  ),
  ordered_cycles AS (
    SELECT
      wpc.id,
      wpc.cycle_order,
      CASE
        WHEN COUNT(*) FILTER (WHERE eb.completion_status IN ('completed', 'failed', 'skipped')) = COUNT(*) THEN 'completed'
        WHEN COUNT(*) FILTER (WHERE eb.completion_status IN ('in_progress', 'completed', 'failed', 'skipped')) > 0 THEN 'in_progress'
        ELSE 'not_started'
      END AS base_status,
      MAX(eb.completed_at) AS last_completed_at
    FROM public.wendler_program_cycle wpc
    JOIN public.wendler_program_cycle_movement wpcm ON wpc.id = wpcm.wendler_program_cycle_id
    JOIN public.exercise_block eb ON wpcm.block_id = eb.id
    WHERE wpc.wendler_program_id = p_program_id
    GROUP BY wpc.id, wpc.cycle_order
  ),
  cycle_statuses AS (
    SELECT
      id,
      base_status,
      last_completed_at,
      CASE
        WHEN base_status = 'completed' THEN 'completed'
        WHEN base_status = 'in_progress' THEN 'in_progress'
        WHEN lag(base_status) OVER (ORDER BY cycle_order) = 'completed' THEN 'in_progress'
        ELSE 'not_started'
      END AS completion_status
    FROM ordered_cycles
  )
  SELECT
    wp.id,
    wp.user_id,
    wp.name,
    (SELECT started_at FROM block_dates) AS started_at,
    (SELECT completed_at FROM block_dates) AS completed_at,
    (
      SELECT
        CASE
          WHEN COUNT(*) FILTER (WHERE cs.completion_status IN ('completed', 'failed', 'skipped')) = COUNT(*) THEN 'completed'
          WHEN COUNT(*) FILTER (WHERE cs.completion_status IN ('in_progress', 'completed', 'failed', 'skipped')) > 0 THEN 'in_progress'
          ELSE 'not_started'
        END
      FROM cycle_statuses cs
    ),
    wp.notes,
    (
      SELECT ARRAY(
        SELECT ROW(
          wpc.id,
          wpc.cycle_type,
          wpc.started_at,
          wpc.completed_at,
          cs.completion_status,
          (
            SELECT ARRAY(
              SELECT ROW(
                wpcm.id,
                wpcm.exercise_type,
                wmm.target_max_value,
                wmm.increase_amount_value,
                wmm.weight_unit,
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
                eb.completion_status,
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
              JOIN public.wendler_movement_max wmm ON wpcm.movement_max_id = wmm.id
              WHERE wpcm.wendler_program_cycle_id = wpc.id
              ORDER BY wpcm.exercise_type
            )
          )
        )::public.p_wendler_cycle_row
        FROM public.wendler_program_cycle wpc
        JOIN cycle_statuses cs ON wpc.id = cs.id
        WHERE wpc.wendler_program_id = wp.id
        ORDER BY wpc.cycle_order ASC
      )
    )
  INTO v_program
  FROM public.wendler_program wp
  WHERE wp.user_id = p_user_id AND wp.id = p_program_id;

  RETURN v_program;
END;
$$ LANGUAGE plpgsql STABLE;
