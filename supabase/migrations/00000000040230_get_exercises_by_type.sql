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
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'get_exercises_by_type_result'
  ) THEN
    CREATE TYPE public.get_exercises_by_type_result AS (
      rows public.get_exercises_by_type_row[],
      day_start_exercise_id uuid,
      page_size integer,
      page_count integer
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION _impl.i_get_exercises_by_type (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_page_num integer,
  p_page_size integer,
  p_max_results integer
) RETURNS public.get_exercises_by_type_row[] AS $$
DECLARE
    result public.get_exercises_by_type_row[];
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
        ORDER BY e.performed_at DESC, e.id DESC
        LIMIT p_max_results OFFSET ((p_page_num - 1) * p_page_size)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.get_exercises_by_type (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_page_num integer,
  p_start_exercise_id uuid DEFAULT NULL
) RETURNS public.get_exercises_by_type_result AS $$
DECLARE
    after_rows public.get_exercises_by_type_row[];
    before_rows public.get_exercises_by_type_row[] := ARRAY[]::public.get_exercises_by_type_row[];
    next_page_start_exercise_id uuid := NULL;
    all_rows public.get_exercises_by_type_row[] := ARRAY[]::public.get_exercises_by_type_row[];
    page_size integer := 30;
    max_results integer := page_size + 1;
    start_idx integer;
    total_rows integer;
    page_count integer;
BEGIN
    after_rows := _impl.i_get_exercises_by_type(
        p_user_id => p_user_id::uuid,
        p_exercise_type => p_exercise_type::exercise_type_enum,
        p_page_num => p_page_num::integer,
        p_page_size => page_size,
        p_max_results => max_results
    );

    IF array_length(after_rows, 1) = max_results THEN
        IF date_trunc('day', after_rows[page_size].performed_at) = date_trunc('day', after_rows[max_results].performed_at) THEN
            next_page_start_exercise_id := after_rows[max_results].exercise_id;
        END IF;
    END IF;

    IF p_start_exercise_id IS NOT NULL THEN
        before_rows := _impl.i_get_exercises_by_type(
            p_user_id => p_user_id::uuid,
            p_exercise_type => p_exercise_type::exercise_type_enum,
            p_page_num => (p_page_num - 1)::integer,
            p_page_size => page_size,
            -- use page size to avoid an overlap with the last of "before_rows"
            -- with the 1st of "after_rows"
            p_max_results => page_size 
        );
        IF before_rows IS NOT NULL AND array_length(before_rows, 1) > 0 THEN
            start_idx := array_position(ARRAY(SELECT r.exercise_id FROM unnest(before_rows) AS r), p_start_exercise_id);
            IF start_idx IS NOT NULL THEN
                before_rows := before_rows[start_idx:array_length(before_rows, 1)];
            ELSE
                before_rows := ARRAY[]::public.get_exercises_by_type_row[];
            END IF;
        END IF;
    END IF;

    all_rows := before_rows || after_rows;

    SELECT COUNT(*) INTO total_rows FROM public.exercises e WHERE e.user_id = p_user_id AND e.exercise_type = p_exercise_type;
    IF total_rows = 0 THEN
        page_count := 0;
    ELSE
        page_count := CEIL(total_rows::numeric / page_size)::integer;
        IF page_count < 1 THEN
            page_count := 1;
        END IF;
    END IF;

    RETURN (
        all_rows,
        next_page_start_exercise_id,
        page_size,
        page_count
    );
END;
$$ LANGUAGE plpgsql STABLE;
