DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 's_exercise_row') THEN
    CREATE TYPE public.s_exercise_row AS (
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
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 's_wendler_details') THEN
    CREATE TYPE public.s_wendler_details AS (
      movement_id uuid,
      wendler_program_id uuid,
      training_max_value numeric,
      increase_amount_value numeric,
      weight_unit weight_unit_enum,
      cycle_type wendler_cycle_type_enum,
      exercise_type exercise_type_enum
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 's_block_row') THEN
    CREATE TYPE public.s_block_row AS (
      id uuid,
      name text,
      notes text,
      started_at timestamptz,
      completed_at timestamptz,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      exercises public.s_exercise_row[],
      wendler_details public.s_wendler_details
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'get_superblock_result') THEN
    CREATE TYPE public.get_superblock_result AS (
      id uuid,
      name text,
      notes text,
      started_at timestamptz,
      completed_at timestamptz,
      blocks public.s_block_row[]
    );
  END IF;
END$$;

-- RPC: get_superblock
-- Returns a single superblock and its blocks (with exercises) for a given user_id and superblock_id
CREATE OR REPLACE FUNCTION public.get_superblock (p_user_id uuid, p_superblock_id uuid) RETURNS public.get_superblock_result AS $$
DECLARE
  v_superblock public.get_superblock_result;
BEGIN
  -- Fetch the superblock and its blocks (with exercises and Wendler details)
  SELECT
    esb.id,
    esb.name,
    esb.notes,
    esb.started_at,
    esb.completed_at,
    ARRAY(
      SELECT ROW(
        eb.id,
        eb.name,
        eb.notes,
        eb.started_at,
        eb.completed_at,
        eb.exercise_type,
        eb.equipment_type,
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
          )::public.s_exercise_row
          FROM public.exercise_block_exercises ebe
          JOIN public.exercises ex ON ex.id = ebe.exercise_id
          WHERE ebe.block_id = eb.id
          ORDER BY ebe.exercise_order
        ),
        (
          SELECT ROW(
            wpm.id,
            wpm.wendler_program_id,
            wpm.training_max_value,
            wpm.increase_amount_value,
            wpm.weight_unit,
            wpmb.cycle_type,
            wpm.exercise_type
          )::public.s_wendler_details
          FROM public.wendler_program_movement_block wpmb
          JOIN public.wendler_program_movement wpm ON wpmb.movement_id = wpm.id
          WHERE wpmb.block_id = eb.id AND wpm.user_id = p_user_id
          LIMIT 1
        )
      )::public.s_block_row
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
