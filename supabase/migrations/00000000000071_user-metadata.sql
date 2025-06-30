DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'target_max_row') THEN
    CREATE TYPE public.target_max_row AS (
      value numeric,
      unit weight_unit_enum,
      recorded_at timestamptz
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS target_max_row AS $$
DECLARE
  result target_max_row;
BEGIN
  SELECT h.value, h.unit, h.recorded_at
    INTO result
    FROM public.target_max_history h
    WHERE h.user_id = p_user_id
      AND h.exercise_type = p_exercise_type
    ORDER BY h.recorded_at DESC, h.id DESC
    LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.set_target_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_value numeric,
  p_unit weight_unit_enum,
  p_recorded_at timestamptz DEFAULT NULL,
  p_source update_source_enum DEFAULT 'manual'
) RETURNS void AS $$
DECLARE
  v_now timestamptz;
BEGIN
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));
  INSERT INTO public.target_max_history (
    user_id, exercise_type, value, unit, recorded_at, source
  ) VALUES (
    p_user_id, p_exercise_type, p_value, p_unit, v_now, p_source
  );
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'one_rep_max_row') THEN
    CREATE TYPE public.one_rep_max_row AS (
      value numeric,
      unit weight_unit_enum,
      recorded_at timestamptz
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS one_rep_max_row AS $$
DECLARE
  result one_rep_max_row;
BEGIN
  SELECT h.value, h.unit, h.recorded_at
    INTO result
    FROM public.one_rep_max_history h
    WHERE h.user_id = p_user_id
      AND h.exercise_type = p_exercise_type
    ORDER BY h.recorded_at DESC, h.id DESC
    LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.set_one_rep_max (
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_value numeric,
  p_unit weight_unit_enum,
  p_recorded_at timestamptz DEFAULT NULL,
  p_source update_source_enum DEFAULT 'manual'
) RETURNS void AS $$
DECLARE
  v_now timestamptz;
BEGIN
  v_now := COALESCE(p_recorded_at, timezone('utc', now()));
  INSERT INTO public.one_rep_max_history (
    user_id, exercise_type, value, unit, recorded_at, source
  ) VALUES (
    p_user_id, p_exercise_type, p_value, p_unit, v_now, p_source
  );
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_maxes_row') THEN
    CREATE TYPE public.wendler_maxes_row AS (
      target_max_value numeric,
      target_max_unit weight_unit_enum,
      target_max_recorded_at timestamptz,
      one_rep_max_value numeric,
      one_rep_max_unit weight_unit_enum,
      one_rep_max_recorded_at timestamptz
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_wendler_maxes (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS wendler_maxes_row AS $$
DECLARE
  tmax target_max_row;
  orm one_rep_max_row;
  result wendler_maxes_row;
BEGIN
  tmax := get_target_max(p_user_id, p_exercise_type);
  orm := get_one_rep_max(p_user_id, p_exercise_type);
  result.target_max_value := tmax.value;
  result.target_max_unit := tmax.unit;
  result.target_max_recorded_at := tmax.recorded_at;
  result.one_rep_max_value := orm.value;
  result.one_rep_max_unit := orm.unit;
  result.one_rep_max_recorded_at := orm.recorded_at;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_preferences_row') THEN
    CREATE TYPE public.user_preferences_row AS (
      preferred_weight_unit weight_unit_enum,
      default_rest_time integer,
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
  SELECT preferred_weight_unit, default_rest_time, user_id, created_at, updated_at
    INTO result
    FROM public.user_metadata
    WHERE user_id = p_user_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.set_user_preferences (
  p_user_id uuid,
  p_preferred_weight_unit weight_unit_enum,
  p_default_rest_time integer
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_metadata (user_id, preferred_weight_unit, default_rest_time)
    VALUES (p_user_id, p_preferred_weight_unit, p_default_rest_time)
    ON CONFLICT (user_id) DO UPDATE
      SET preferred_weight_unit = EXCLUDED.preferred_weight_unit,
          default_rest_time = EXCLUDED.default_rest_time,
          updated_at = timezone('utc', now());
END;
$$ LANGUAGE plpgsql;
