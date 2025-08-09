-- Drop and recreate get_wendler_program function to use cycle_order for sorting
DROP FUNCTION IF EXISTS public.get_wendler_program (uuid, uuid);

CREATE OR REPLACE FUNCTION public.get_wendler_program (p_user_id uuid, p_program_id uuid) RETURNS public.get_wendler_program_result AS $$
DECLARE
  v_program public.get_wendler_program_result;
BEGIN
  SELECT
    wp.id,
    wp.user_id,
    wp.name,
    wp.started_at,
    wp.completed_at,
    wp.notes,
    (
      SELECT ARRAY(
        SELECT ROW(
          wpc.id,
          wpc.cycle_type,
          wpc.started_at,
          wpc.completed_at,
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
