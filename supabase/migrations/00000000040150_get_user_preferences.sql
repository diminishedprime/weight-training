DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_preferences_row') THEN
    CREATE TYPE public.user_preferences_row AS (
      preferred_weight_unit weight_unit_enum,
      default_rest_time integer,
      available_plates_lbs numeric[],
      available_dumbbells_lbs numeric[],
      available_kettlebells_lbs numeric[],
      user_id uuid,
      created_at timestamptz,
      updated_at timestamptz
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_user_preferences (p_user_id uuid) RETURNS user_preferences_row AS $$
DECLARE
  result user_preferences_row;
BEGIN
  SELECT preferred_weight_unit, default_rest_time, available_plates_lbs, available_dumbbells_lbs, available_kettlebells_lbs, user_id, created_at, updated_at
    INTO result
    FROM public.user_preferences
    WHERE user_id = p_user_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
