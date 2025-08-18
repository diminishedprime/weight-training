CREATE TABLE IF NOT EXISTS exercise_rest_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_preferences_id UUID NOT NULL REFERENCES user_preferences (id) ON DELETE CASCADE,
  exercise_type exercise_type_enum NOT NULL,
  rest_time INTEGER NOT NULL,
  UNIQUE (user_id, exercise_type)
);

CREATE TABLE IF NOT EXISTS equipment_rest_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_preferences_id UUID NOT NULL REFERENCES user_preferences (id) ON DELETE CASCADE,
  equipment_type equipment_type_enum NOT NULL,
  rest_time INTEGER NOT NULL,
  UNIQUE (user_id, equipment_type)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'p_exercise_rest_time') THEN
    CREATE TYPE public.p_exercise_rest_time AS (exercise_type exercise_type_enum, rest_time INTEGER);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'p_equipment_rest_time') THEN
    CREATE TYPE public.p_equipment_rest_time AS (equipment_type equipment_type_enum, rest_time INTEGER);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hydrate_rest_times_result') THEN
    CREATE TYPE public.hydrate_rest_times_result AS (
      user_id uuid,
      user_preferences_id uuid,
      equipment_rest_times p_equipment_rest_time[],
      exercise_rest_times p_exercise_rest_time[]
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION hydrate_rest_times (p_user_id uuid) RETURNS hydrate_rest_times_result AS $$
DECLARE
  v_user_preferences_id UUID;
  v_equipment_rest_rows p_equipment_rest_time[] := ARRAY[]::p_equipment_rest_time[];
  v_exercise_rest_rows p_exercise_rest_time[] := ARRAY[]::p_exercise_rest_time[];
BEGIN
  SELECT id INTO v_user_preferences_id FROM user_preferences WHERE user_id = p_user_id;

  SELECT ARRAY_AGG(ROW(equipment_type, rest_time)::p_equipment_rest_time)
  INTO v_equipment_rest_rows
  FROM equipment_rest_time
  WHERE user_id = p_user_id;

  SELECT ARRAY_AGG(ROW(exercise_type, rest_time)::p_exercise_rest_time)
  INTO v_exercise_rest_rows
  FROM exercise_rest_time
  WHERE user_id = p_user_id;

  RETURN (
    p_user_id,
    v_user_preferences_id,
    v_equipment_rest_rows,
    v_exercise_rest_rows
  )::hydrate_rest_times_result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_rest_times (
  p_user_id UUID,
  p_equipment_rests p_equipment_rest_time[],
  p_exercise_rests p_exercise_rest_time[]
) RETURNS hydrate_rest_times_result AS $$
DECLARE
  v_equipment_rest_time_rec p_equipment_rest_time;
  v_exercise_rest_time_rec p_exercise_rest_time;
  v_user_preferences_id UUID;
BEGIN

  -- It may be better to add arguments to set_rest_times for the explicit ones
  -- to delete? Idk yet.
  DELETE FROM equipment_rest_time
  WHERE user_id = p_user_id
    AND equipment_rest_time.equipment_type NOT IN (
      SELECT rest.equipment_type FROM unnest(p_equipment_rests) AS rest
    );

  DELETE FROM exercise_rest_time
  WHERE user_id = p_user_id
    AND exercise_rest_time.exercise_type NOT IN (
      SELECT rest.exercise_type FROM unnest(p_exercise_rests) AS rest
    );

  SELECT id INTO v_user_preferences_id FROM user_preferences WHERE user_id = p_user_id;

  FOREACH v_equipment_rest_time_rec IN ARRAY p_equipment_rests
  LOOP
    INSERT INTO equipment_rest_time (user_id, user_preferences_id, equipment_type, rest_time)
    VALUES (
      p_user_id,
      v_user_preferences_id,
      v_equipment_rest_time_rec.equipment_type,
      v_equipment_rest_time_rec.rest_time
    )
    ON CONFLICT (user_id, equipment_type)
    DO UPDATE SET rest_time = EXCLUDED.rest_time;
  END LOOP;

  FOREACH v_exercise_rest_time_rec IN ARRAY p_exercise_rests
  LOOP
    INSERT INTO exercise_rest_time (user_id, user_preferences_id, exercise_type, rest_time)
    VALUES (
      p_user_id,
      v_user_preferences_id,
      v_exercise_rest_time_rec.exercise_type,
      v_exercise_rest_time_rec.rest_time
    )
    ON CONFLICT (user_id, exercise_type)
    DO UPDATE SET rest_time = EXCLUDED.rest_time;
  END LOOP;

  RETURN hydrate_rest_times(p_user_id);
END;
$$ LANGUAGE plpgsql;
