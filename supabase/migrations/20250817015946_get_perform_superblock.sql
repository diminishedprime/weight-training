-- Update get_perform_superblock to use previous exercises outside of the block
-- for last_performed_at if they're present and it's the first exercise of the
-- block.
CREATE OR REPLACE FUNCTION public.get_perform_superblock (p_user_id uuid, p_superblock_id uuid) RETURNS public.get_perform_superblock_result AS $$
DECLARE
  v_superblock public.get_perform_superblock_result;
BEGIN
  SELECT
    esb.id,
    esb.name,
    esb.notes,
    esb.started_at,
    esb.completed_at,
    esb.active_block_id,
    esb.completion_status,
    ARRAY(
      SELECT ROW(
        eb.id,
        eb.name,
        eb.notes,
        eb.started_at,
        eb.completed_at,
        eb.exercise_type,
        eb.equipment_type,
        eb.active_exercise_id,
        eb.completion_status,
        ARRAY(
          SELECT ROW(
            ex.id,
            ex.exercise_type,
            ex.equipment_type,
            ex.actual_weight_value,
            ex.target_weight_value,
            ex.weight_unit,
            ex.reps,
            ex.is_warmup,
            ex.is_amrap,
            ex.completion_status,
            ex.notes,
            ex.perceived_effort,
            ex.performed_at,
              COALESCE(
                LAG(ex.performed_at) OVER (PARTITION BY ebe.block_id ORDER BY ebe.exercise_order),
                CASE
                  WHEN ebe.exercise_order = 1
                  THEN (
                    SELECT ex2.performed_at
                    FROM public.exercise_block_exercises ebe2
                    JOIN public.exercises ex2 ON ex2.id = ebe2.exercise_id
                    JOIN public.exercise_superblock_blocks esbb2 ON esbb2.block_id = ebe2.block_id
                    WHERE esbb2.superblock_id = esb.id
                      AND ex2.performed_at IS NOT NULL
                      AND ex2.id <> ex.id
                    ORDER BY ex2.performed_at DESC
                    LIMIT 1
                  )
                  ELSE NULL
                END
              )
          )::public.p_exercise_row
          FROM public.exercise_block_exercises ebe
          JOIN public.exercises ex ON ex.id = ebe.exercise_id
          WHERE ebe.block_id = eb.id
          ORDER BY ebe.exercise_order
        ),
        (
          SELECT ROW(
            wpcm.id,
            wpcm.wendler_program_cycle_id,
            wpcm.user_id,
            wpcm.exercise_type,
            wmm.target_max_value,
            wmm.increase_amount_value,
            wmm.weight_unit,
            wpcm.block_id,
            wpc.cycle_type
          )::public.p_wendler_details
          FROM public.wendler_program_cycle_movement wpcm
          JOIN public.wendler_program_cycle wpc ON wpc.id = wpcm.wendler_program_cycle_id
          JOIN public.wendler_movement_max wmm ON wmm.id = wpcm.movement_max_id
          WHERE wpcm.block_id = eb.id AND wpcm.user_id = p_user_id
          LIMIT 1
        )
      )::public.p_block_row
      FROM public.exercise_superblock_blocks esbb
      JOIN public.exercise_block eb ON eb.id = esbb.block_id
      WHERE esbb.superblock_id = esb.id
      ORDER BY esbb.superblock_order
    )
  INTO v_superblock
  FROM public.exercise_superblock esb
  WHERE esb.id = p_superblock_id AND esb.user_id = p_user_id;

  RETURN v_superblock;
END;
$$ LANGUAGE plpgsql STABLE;
