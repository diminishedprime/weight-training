DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'get_exercises_by_type_row'
  ) THEN
    CREATE TYPE public.get_exercises_by_type_row AS (
      exercise_id uuid,
      user_id uuid,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      performed_at timestamptz,
      actual_weight_value numeric,
      target_weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      warmup boolean,
      completion_status completion_status_enum,
      notes text,
      perceived_effort perceived_effort_enum,
      personal_record boolean
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'get_exercises_by_type_result'
  ) THEN
    CREATE TYPE public.get_exercises_by_type_result AS (
      rows public.get_exercises_by_type_row[],
      page_count integer
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_exercises_by_type (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_page_num integer
) RETURNS public.get_exercises_by_type_result AS $$
DECLARE
    rows public.get_exercises_by_type_row[];
    page_size integer := 30;
    total_rows integer;
BEGIN
    SELECT ARRAY(
        SELECT (
            e.id::uuid,
            e.user_id::uuid,
            e.exercise_type::exercise_type_enum,
            e.equipment_type::equipment_type_enum,
            e.performed_at::timestamptz,
            e.actual_weight_value::numeric,
            e.target_weight_value::numeric,
            e.weight_unit::weight_unit_enum,
            e.reps::integer,
            e.warmup::boolean,
            e.completion_status::completion_status_enum,
            e.notes::text,
            e.perceived_effort::perceived_effort_enum,
            EXISTS (
                SELECT 1
                FROM public.personal_record_history prh
                WHERE prh.exercise_id = e.id
                  AND prh.user_id = e.user_id
                  AND prh.exercise_type = e.exercise_type
                  AND prh.reps = e.reps
                LIMIT 1
            )::boolean
        )::public.get_exercises_by_type_row
        FROM public.exercises e
        WHERE e.user_id = p_user_id
            AND e.exercise_type = p_exercise_type
            AND e.performed_at IS NOT NULL
            AND e.actual_weight_value IS NOT NULL
        ORDER BY e.performed_at DESC, e.id DESC
        LIMIT page_size OFFSET ((p_page_num - 1) * page_size)
    ) INTO rows;

    SELECT CEIL(COUNT(*)::numeric / page_size)::integer INTO total_rows FROM public.exercises e WHERE e.user_id = p_user_id AND e.exercise_type = p_exercise_type;

    RETURN (
        rows,
        total_rows
    );
END;
$$ LANGUAGE plpgsql STABLE;
