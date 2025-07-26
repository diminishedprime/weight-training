DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_block_exercise_row') THEN
    CREATE TYPE public.wendler_block_exercise_row AS (
      block_id uuid,
      exercise_id uuid,
      user_id uuid,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      performed_at timestamptz,
      actual_weight_value numeric,
      target_weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      is_warmup boolean,
      is_amrap boolean,
      completion_status completion_status_enum,
      notes text,
      perceived_effort perceived_effort_enum
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_wendler_block (p_block_id UUID, p_user_id UUID) RETURNS SETOF public.wendler_block_exercise_row LANGUAGE sql STABLE AS $$
  SELECT
    b.id AS block_id,
    e.id AS exercise_id,
    b.user_id,
    e.exercise_type,
    e.equipment_type,
    e.performed_at,
    e.actual_weight_value,
    e.target_weight_value,
    e.weight_unit,
    e.reps,
    e.is_warmup,
    e.is_amrap,
    e.completion_status,
    e.notes,
    e.perceived_effort
  FROM public.exercise_block_exercises ebe
  JOIN public.exercises e ON ebe.exercise_id = e.id
  JOIN public.exercise_block b ON ebe.block_id = b.id
  WHERE ebe.block_id = p_block_id
    AND b.user_id = p_user_id
  ORDER BY ebe.exercise_order ASC;
$$;
