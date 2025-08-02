DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'p_exercise_row') THEN
    CREATE TYPE public.p_exercise_row AS (
      id uuid,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      actual_weight_value numeric,
      target_weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      is_warmup boolean,
      is_amrap boolean,
      completion_status completion_status_enum,
      notes text,
      perceived_effort perceived_effort_enum,
      performed_at timestamptz,
      next_performed_at timestamptz
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'p_wendler_details') THEN
    CREATE TYPE public.p_wendler_details AS (
      id uuid,
      wendler_program_cycle_id uuid,
      user_id uuid,
      exercise_type exercise_type_enum,
      training_max_value numeric,
      increase_amount_value numeric,
      weight_unit weight_unit_enum,
      block_id uuid,
      cycle_type wendler_cycle_type_enum
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'p_block_row') THEN
    CREATE TYPE public.p_block_row AS (
      id uuid,
      name text,
      notes text,
      started_at timestamptz,
      completed_at timestamptz,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      active_exercise_id uuid,
      exercises public.p_exercise_row[],
      wendler_details public.p_wendler_details
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'get_perform_superblock_result') THEN
    CREATE TYPE public.get_perform_superblock_result AS (
      id uuid,
      name text,
      notes text,
      started_at timestamptz,
      completed_at timestamptz,
      active_block_id uuid,
      blocks public.p_block_row[]
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_perform_superblock (p_user_id uuid, p_superblock_id uuid) RETURNS public.get_perform_superblock_result AS $$
DECLARE
  v_superblock public.get_perform_superblock_result;
BEGIN
  -- Fetch the superblock and its blocks (with exercises and Wendler details)
  SELECT
    esb.id,
    esb.name,
    esb.notes,
    esb.started_at,
    esb.completed_at,
    esb.active_block_id,
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
            LEAD(ex.performed_at) OVER (PARTITION BY ebe.block_id ORDER BY ebe.exercise_order)
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
