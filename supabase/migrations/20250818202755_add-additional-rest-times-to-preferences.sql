DROP FUNCTION IF EXISTS public.get_user_preferences;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_preferences_row') THEN
    DROP TYPE public.user_preferences_row;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_preferences_row') THEN
    CREATE TYPE public.user_preferences_row AS (
      preferred_weight_unit weight_unit_enum,
      default_rest_time integer,
      available_plates_lbs numeric[],
      available_dumbbells_lbs numeric[],
      available_kettlebells_lbs numeric[],
      user_id uuid,
      theme_options jsonb,
      pushover_api_token text,
      pushover_user_key text,
      equipment_rest_times p_equipment_rest_time[],
      exercise_rest_times p_exercise_rest_time[]
    );
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_user_preferences (p_user_id uuid) RETURNS public.user_preferences_row LANGUAGE plpgsql AS $$
DECLARE
  result user_preferences_row;
  v_equipment_rest_rows p_equipment_rest_time[] := ARRAY[]::p_equipment_rest_time[];
  v_exercise_rest_rows p_exercise_rest_time[] := ARRAY[]::p_exercise_rest_time[];
BEGIN
  SELECT ARRAY_AGG(ROW(equipment_type, rest_time)::p_equipment_rest_time)
    INTO v_equipment_rest_rows
    FROM equipment_rest_time
    WHERE user_id = p_user_id;

  SELECT ARRAY_AGG(ROW(exercise_type, rest_time)::p_exercise_rest_time)
    INTO v_exercise_rest_rows
    FROM exercise_rest_time
    WHERE user_id = p_user_id;

  SELECT preferred_weight_unit, default_rest_time, available_plates_lbs, available_dumbbells_lbs, available_kettlebells_lbs, user_id, theme_options, pushover_api_token, pushover_user_key,
    v_equipment_rest_rows, v_exercise_rest_rows
    INTO result
    FROM public.user_preferences
    WHERE user_id = p_user_id;
  RETURN result;
END;
$$;
