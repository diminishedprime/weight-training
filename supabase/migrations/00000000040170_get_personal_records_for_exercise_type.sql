DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'personal_record_history_row') THEN
    CREATE TYPE public.personal_record_history_row AS (
      id uuid,
      weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      recorded_at timestamptz,
      source update_source_enum,
      notes text,
      exercise_id uuid,
      previous_recorded_at timestamptz,
      increase_weight_value numeric
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_personal_records_for_exercise_type (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_reps integer DEFAULT NULL,
  p_end_time timestamptz DEFAULT NULL
) RETURNS SETOF personal_record_history_row AS $$
DECLARE
  v_end_time timestamptz;
BEGIN
  v_end_time := COALESCE(p_end_time, timezone('utc', now()));
  
  RETURN QUERY
  WITH ordered_records AS (
    SELECT 
      h.id,
      h.weight_value,
      h.weight_unit,
      h.reps,
      h.recorded_at,
      h.source,
      h.notes,
      h.exercise_id,
      -- Previous record timestamp for the same rep count
      LAG(h.recorded_at) OVER (
        PARTITION BY h.reps 
        ORDER BY h.recorded_at ASC
      ) AS previous_recorded_at,
      -- Increase in weight_value from previous record (for first, use weight_value itself)
      COALESCE(
        h.weight_value - LAG(h.weight_value) OVER (
          PARTITION BY h.reps 
          ORDER BY h.recorded_at ASC
        ),
        h.weight_value
      ) AS increase_weight_value
    FROM public.personal_record_history h
    WHERE h.user_id = p_user_id
      AND h.exercise_type = p_exercise_type
      AND h.recorded_at <= v_end_time
      AND (p_reps IS NULL OR h.reps = p_reps)
  )
  SELECT 
    or_data.id,
    or_data.weight_value,
    or_data.weight_unit,
    or_data.reps,
    or_data.recorded_at,
    or_data.source,
    or_data.notes,
    or_data.exercise_id,
    or_data.previous_recorded_at,
    or_data.increase_weight_value
  FROM ordered_records or_data
  ORDER BY or_data.reps ASC, or_data.recorded_at DESC
  -- Completely arbitrary. I probably should eventually support "from and to"
  -- ranges, but I didn't want to bother with the UI necessary to get the right
  -- start time, yet.
  LIMIT 1000;
END;
$$ LANGUAGE plpgsql STABLE;
