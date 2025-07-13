-- Stored procedures for getting personal records data.
-- Type: personal_record_history_row
--
-- Purpose: Return type for personal record history queries.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'personal_record_history_row') THEN
    CREATE TYPE public.personal_record_history_row AS (
      id uuid,
      value numeric,
      unit weight_unit_enum,
      reps integer,
      recorded_at timestamptz,
      source update_source_enum,
      notes text,
      exercise_id uuid,
      days_since_last_record integer
    );
  END IF;
END$$;

-- Function: get_personal_records_for_exercise_type
--
-- Purpose: Get personal record history for a user and exercise type.
--
-- Parameters:
--   p_user_id: The user's UUID
--   p_exercise_type: The exercise type to get history for
--   p_reps: The number of reps to get history for (optional, gets all if null)
--   p_end_time: End of the timeframe (inclusive), defaults to current time
--
-- Returns: Array of personal_record_history_row ordered by reps ASC, recorded_at DESC (limited to 1000)
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
      h.value,
      h.unit,
      h.reps,
      h.recorded_at,
      h.source,
      h.notes,
      h.exercise_id,
      -- Calculate days since the previous record for the same rep count
      EXTRACT(days FROM (
        h.recorded_at - LAG(h.recorded_at) OVER (
          PARTITION BY h.reps 
          ORDER BY h.recorded_at ASC
        )
      ))::integer AS days_since_last_record
    FROM public.personal_record_history h
    WHERE h.user_id = p_user_id
      AND h.exercise_type = p_exercise_type
      AND h.recorded_at <= v_end_time
      AND (p_reps IS NULL OR h.reps = p_reps)
  )
  SELECT 
    or_data.id,
    or_data.value,
    or_data.unit,
    or_data.reps,
    or_data.recorded_at,
    or_data.source,
    or_data.notes,
    or_data.exercise_id,
    or_data.days_since_last_record
  FROM ordered_records or_data
  ORDER BY or_data.reps ASC, or_data.recorded_at DESC
  -- Completely arbitrary. I probably should eventually support "from and to"
  -- ranges, but I didn't want to bother with the UI necessary to get the right
  -- start time, yet.
  LIMIT 1000;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: get_personal_record_exercise_types
--
-- Purpose: Get all exercise types that have personal records for a user.
--
-- Parameters:
--   p_user_id: The user's UUID
--
-- Returns: Set of exercise_type_enum values that have personal records
CREATE OR REPLACE FUNCTION public.get_personal_record_exercise_types (p_user_id uuid) RETURNS SETOF exercise_type_enum AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT h.exercise_type
  FROM public.personal_record_history h
  WHERE h.user_id = p_user_id
  ORDER BY h.exercise_type;
END;
$$ LANGUAGE plpgsql STABLE;
