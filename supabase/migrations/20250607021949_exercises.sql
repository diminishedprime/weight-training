DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_type_enum') THEN
    CREATE TYPE public.exercise_type_enum AS ENUM (
      -- Barbell Exercises
      'barbell_deadlift',
      'barbell_back_squat',
      'barbell_front_squat',
      'barbell_bench_press',
      'barbell_overhead_press',
      'barbell_row',
      -- Dumbell Exercises
      'dumbbell_row',
      -- Machine Exercises
      'machine_converging_chest_press',
      'machine_diverging_lat_pulldown',
      'machine_diverging_low_row',
      'machine_converging_shoulder_press',
      'machine_lateral_raise',
      'machine_abdominal',
      'machine_back_extension',
      'machine_seated_leg_curl',
      'machine_leg_extension',
      'machine_leg_press',
      'machine_inner_thigh',
      'machine_outer_thigh',
      'machine_triceps_extension',
      'machine_biceps_curl',
      'machine_rear_delt',
      'machine_pec_fly',
      -- Bodyweight Exercises
      'pushup',
      'situp',
      'pullup',
      'chinup',
      -- Weird corner case exercises
      'plate_stack_calf_raise'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'completion_status_enum') THEN
    CREATE TYPE public.completion_status_enum AS ENUM (
      'completed',
      'not_completed',
      'failed',
      'skipped'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_type_enum') THEN
    CREATE TYPE public.equipment_type_enum AS ENUM (
      'barbell',
      'dumbbell',
      'kettlebell',
      'machine',
      'bodyweight',
      'plate_stack'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relative_effort_enum') THEN
    CREATE TYPE public.relative_effort_enum AS ENUM (
      'easy',
      'okay',
      'hard'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.exercises
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    equipment_type equipment_type_enum NOT NULL DEFAULT 'barbell',
    performed_at timestamp with time zone NULL,
    weight_id uuid NOT NULL,
    reps integer NOT NULL,
    warmup boolean NOT NULL DEFAULT false,
    completion_status completion_status_enum NOT NULL DEFAULT 'not_completed',
    notes text NULL,
    relative_effort relative_effort_enum NULL,
    CONSTRAINT exercises_id_pkey PRIMARY KEY (id),
    CONSTRAINT exercises_weight_id_fkey FOREIGN KEY (weight_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);


-- Function: create_exercise
CREATE OR REPLACE FUNCTION public.create_exercise(
    p_user_id uuid,
    p_exercise_type exercise_type_enum,
    p_equipment_type equipment_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'completed',
    p_relative_effort relative_effort_enum DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_weight_id uuid;
    v_exercise_id uuid;
BEGIN
    -- Get or insert weight and get its id
    v_weight_id := public.get_weight(p_weight_value, p_weight_unit);
    -- Insert exercise and get its id
    INSERT INTO public.exercises (
        user_id, exercise_type, equipment_type, performed_at, weight_id, reps, warmup, completion_status, relative_effort
    ) VALUES (
        p_user_id, p_exercise_type, p_equipment_type, p_performed_at, v_weight_id, p_reps, p_warmup, p_completion_status, p_relative_effort
    )
    RETURNING id INTO v_exercise_id;
    RETURN v_exercise_id;
END;
$$ LANGUAGE plpgsql;


-- Function: get_exercises_by_type_for_user
CREATE OR REPLACE FUNCTION public.get_exercises_by_type_for_user(
    p_user_id uuid,
    p_exercise_type exercise_type_enum
)
RETURNS TABLE (
    exercise_id uuid,
    user_id uuid,
    exercise_type exercise_type_enum,
    equipment_type equipment_type_enum,
    performed_at timestamptz,
    weight_value numeric,
    weight_unit weight_unit_enum,
    reps integer,
    warmup boolean,
    completion_status completion_status_enum,
    notes text,
    relative_effort relative_effort_enum
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.user_id,
        e.exercise_type,
        e.equipment_type,
        e.performed_at,
        w.weight_value,
        w.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.notes,
        e.relative_effort
    FROM public.exercises e
    JOIN public.weights w ON e.weight_id = w.id
    WHERE e.user_id = p_user_id
      AND e.exercise_type = p_exercise_type
    ORDER BY e.performed_at DESC NULLS LAST
    LIMIT 30;
END;
$$ LANGUAGE plpgsql STABLE;



-- Function: update_exercise_for_user
CREATE OR REPLACE FUNCTION public.update_exercise_for_user(
    p_exercise_id uuid,
    p_user_id uuid,
    p_exercise_type exercise_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'completed',
    p_notes text DEFAULT NULL,
    p_relative_effort relative_effort_enum DEFAULT NULL
) RETURNS void AS $$
DECLARE
    v_weight_id uuid;
BEGIN
    -- Get or insert new weight and get its id
    v_weight_id := public.get_weight(p_weight_value, p_weight_unit);
    -- Update the exercise row, only if it belongs to the user
    UPDATE public.exercises
    SET
        exercise_type = p_exercise_type,
        performed_at = p_performed_at,
        weight_id = v_weight_id,
        reps = p_reps,
        warmup = p_warmup,
        completion_status = p_completion_status,
        notes = p_notes,
        relative_effort = p_relative_effort
    WHERE id = p_exercise_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Composite type: exercise_row_type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_row_type') THEN
    CREATE TYPE public.exercise_row_type AS (
      exercise_id uuid,
      user_id uuid,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      performed_at timestamptz,
      weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      warmup boolean,
      completion_status completion_status_enum,
      notes text,
      relative_effort relative_effort_enum
    );
  END IF;
END$$;

-- Function: get_exercise_for_user
CREATE OR REPLACE FUNCTION public.get_exercise_for_user(
    p_user_id uuid,
    p_exercise_id uuid
)
RETURNS exercise_row_type AS $$
DECLARE
    result exercise_row_type;
BEGIN
    SELECT
        e.id,
        e.user_id,
        e.exercise_type,
        e.equipment_type,
        e.performed_at,
        w.weight_value,
        w.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.notes,
        e.relative_effort
    INTO result
    FROM public.exercises e
    JOIN public.weights w ON e.weight_id = w.id
    WHERE e.user_id = p_user_id
      AND e.id = p_exercise_id
    LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;