-- This migration adds pushover_api_token and pushover_user_key to user preferences and updates/recreates
-- relevant stored-procs accordingly.
ALTER TABLE public.user_preferences
ADD COLUMN pushover_api_token text NULL,
ADD COLUMN pushover_user_key text NULL;

DROP FUNCTION IF EXISTS public.get_user_preferences (uuid);

DROP FUNCTION IF EXISTS public.set_user_preferences (
  uuid,
  weight_unit_enum,
  integer,
  numeric[],
  numeric[],
  numeric[],
  jsonb
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_preferences_row') THEN
    DROP TYPE public.user_preferences_row;
  END IF;
END$$;

CREATE TYPE public.user_preferences_row AS (
  preferred_weight_unit weight_unit_enum,
  default_rest_time integer,
  available_plates_lbs numeric[],
  available_dumbbells_lbs numeric[],
  available_kettlebells_lbs numeric[],
  user_id uuid,
  theme_options jsonb,
  pushover_api_token text,
  pushover_user_key text
);

CREATE OR REPLACE FUNCTION public.get_user_preferences (p_user_id uuid) RETURNS user_preferences_row AS $$
DECLARE
  result user_preferences_row;
BEGIN
  SELECT preferred_weight_unit, default_rest_time, available_plates_lbs, available_dumbbells_lbs, available_kettlebells_lbs, user_id, theme_options, pushover_api_token, pushover_user_key
    INTO result
    FROM public.user_preferences
    WHERE user_id = p_user_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.set_user_preferences (
  p_user_id uuid,
  p_preferred_weight_unit weight_unit_enum,
  p_default_rest_time integer,
  p_available_plates_lbs numeric[],
  p_available_dumbbells_lbs numeric[],
  p_available_kettlebells_lbs numeric[],
  p_theme_options jsonb,
  p_pushover_api_token text DEFAULT NULL,
  p_pushover_user_key text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id, preferred_weight_unit, default_rest_time, available_plates_lbs, available_dumbbells_lbs, available_kettlebells_lbs, theme_options, pushover_api_token, pushover_user_key)
    VALUES (p_user_id, p_preferred_weight_unit, p_default_rest_time, p_available_plates_lbs, p_available_dumbbells_lbs, p_available_kettlebells_lbs, p_theme_options, p_pushover_api_token, p_pushover_user_key)
    ON CONFLICT (user_id) DO UPDATE
      SET preferred_weight_unit = EXCLUDED.preferred_weight_unit,
          default_rest_time = EXCLUDED.default_rest_time,
          available_plates_lbs = EXCLUDED.available_plates_lbs,
          available_dumbbells_lbs = EXCLUDED.available_dumbbells_lbs,
          available_kettlebells_lbs = EXCLUDED.available_kettlebells_lbs,
          theme_options = EXCLUDED.theme_options,
          pushover_api_token = EXCLUDED.pushover_api_token,
          pushover_user_key = EXCLUDED.pushover_user_key;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS _system.create_test_user (uuid, text, boolean);

CREATE OR REPLACE FUNCTION _system.create_test_user (
  p_id uuid,
  p_email text,
  p_create_preferences boolean
) RETURNS void AS $$
BEGIN
  INSERT INTO next_auth.users (id, name, email, "emailVerified", image)
  VALUES (p_id, p_email, p_email, NOW(), 'https://example.com/avatar.png');

  IF p_create_preferences THEN
    PERFORM public.set_user_preferences (
      p_user_id => p_id,
      p_preferred_weight_unit => 'pounds',
      p_default_rest_time => 120,
      p_available_plates_lbs => ARRAY[45, 35, 25, 10, 5, 2.5]::numeric[],
      p_available_dumbbells_lbs => ARRAY[10, 20, 30, 40, 50]::numeric[],
      p_available_kettlebells_lbs => ARRAY[18, 26, 35, 44, 53]::numeric[],
      p_theme_options => NULL,
      p_pushover_api_token => NULL,
      p_pushover_user_key => NULL
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
