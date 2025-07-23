DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_maxes_row') THEN
    CREATE TYPE public.wendler_maxes_row AS (
      target_max_value numeric,
      target_max_unit weight_unit_enum,
      target_max_recorded_at timestamptz,
      personal_record_value numeric,
      personal_record_unit weight_unit_enum,
      personal_record_reps integer,
      personal_record_recorded_at timestamptz
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_wendler_maxes (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS wendler_maxes_row AS $$
DECLARE
  tmax target_max_row;
  pr personal_record_row;
  result wendler_maxes_row;
BEGIN
  tmax := get_target_max(p_user_id, p_exercise_type);
  pr := get_personal_record(p_user_id, p_exercise_type, 1); -- Get 1-rep max for Wendler
  result.target_max_value := tmax.weight_value;
  result.target_max_unit := tmax.weight_unit;
  result.target_max_recorded_at := tmax.recorded_at;
  result.personal_record_value := pr.weight_value;
  result.personal_record_unit := pr.weight_unit;
  result.personal_record_reps := pr.reps;
  result.personal_record_recorded_at := pr.recorded_at;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
