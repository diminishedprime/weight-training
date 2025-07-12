-- -----------------------------------------------------------------------------
-- Function: public.create_wendler_exercise_block
--
-- Purpose: Creates an exercise block for a Wendler 5/3/1 cycle, and records the
--          cycle metadata.
--
-- Requirements & Important Notes:
--   - The user's target max (see get_target_max) for the given exercise must be
--     set to the new value BEFORE calling this function.
--     This function will use the current target max as the new training max for
--     the cycle.
--   - The increase amount is calculated automatically as the difference between
--     the new target max and the previous cycle's training max.  The user does
--     NOT provide the increase amount directly.
--   - If this is the first cycle for the user/exercise, the increase amount
--     will be set to the current target max value.
--   - If the most recent previous cycle uses a different unit (e.g., kg vs lb),
--     the function will throw an exception.
--
-- Arguments:
--   p_user_id UUID - The user for whom the block is being created.
--   p_exercise_type exercise_type_enum - The exercise type (e.g., 'bench_press').
--   p_cycle_type wendler_cycle_type_enum - The Wendler cycle type ('5', '3', '1', 'deload').
--
-- Returns:
--   UUID - The ID of the created exercise block.
--
-- This is a template function. Implementation to be completed.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_wendler_exercise_block (
  p_user_id UUID,
  p_exercise_type exercise_type_enum,
  p_cycle_type wendler_cycle_type_enum,
  p_block_name TEXT
) RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
    v_block_id UUID;
    v_exercise_id UUID;
    v_set_order INTEGER := 1;
    v_wendler_metadata_id UUID;
    v_training_max_value NUMERIC;
    v_training_max_unit weight_unit_enum;
    v_prev_training_max_value NUMERIC;
    v_prev_training_max_unit weight_unit_enum;
    v_increase_amount_value NUMERIC;
    v_increase_amount_unit weight_unit_enum;
BEGIN

    -- Look up the user's current training max for this exercise using get_target_max
    SELECT value, unit
      INTO v_training_max_value, v_training_max_unit
      FROM public.get_target_max(p_user_id, p_exercise_type);
    IF v_training_max_value IS NULL OR v_training_max_unit IS NULL THEN
        RAISE EXCEPTION 'No training max (target max) found for user % and exercise %', p_user_id, p_exercise_type;
    END IF;


    SELECT training_max_value, training_max_unit
      INTO v_prev_training_max_value, v_prev_training_max_unit
      FROM wendler_metadata
     WHERE user_id = p_user_id AND exercise_type = p_exercise_type
     ORDER BY created_at DESC
     LIMIT 1;

    -- Check that the most recent lift has the same unit type
    IF v_prev_training_max_value IS NOT NULL THEN
        IF v_prev_training_max_unit IS DISTINCT FROM v_training_max_unit THEN
            RAISE EXCEPTION 'Unit mismatch: previous training max unit % does not match current unit % for user % and exercise %', v_prev_training_max_unit, v_training_max_unit, p_user_id, p_exercise_type;
        END IF;
    END IF;

    v_increase_amount_value := COALESCE(v_training_max_value - v_prev_training_max_value, v_training_max_value);
    v_increase_amount_unit := v_training_max_unit;

    INSERT INTO wendler_metadata (
        user_id,
        training_max_value,
        training_max_unit,
        increase_amount_value,
        increase_amount_unit,
        cycle_type,
        exercise_type
    ) VALUES (
        p_user_id,
        v_training_max_value,
        v_training_max_unit,
        v_increase_amount_value,
        v_increase_amount_unit,
        p_cycle_type,
        p_exercise_type
    ) RETURNING id INTO v_wendler_metadata_id;

    -- 1. Empty bar set (8 reps)
    v_exercise_id := public.create_exercise(
        p_user_id::uuid, -- user_id
        p_exercise_type::exercise_type_enum, -- exercise_type
        'barbell'::equipment_type_enum, -- equipment_type
        public.normalize_bar_weight_pounds(0)::numeric, -- weight_value (rounded)
        public.normalize_bar_weight_pounds(0)::numeric, -- actual_weight_value (actual, same as rounded for empty bar)
        8::integer, -- reps
        v_training_max_unit::weight_unit_enum, -- weight_unit
        NULL::timestamptz, -- performed_at
        TRUE::boolean, -- warmup
        FALSE::boolean, -- is_amrap
        'not_completed'::completion_status_enum, -- completion_status
        NULL::relative_effort_enum, -- relative_effort
        NULL -- notes
    );

    -- Insert exercise_block with the empty bar set as the first active exercise
    INSERT INTO exercise_block (
        user_id,
        wendler_metadata_id,
        name,
        active_exercise_id
    ) VALUES (
        p_user_id,
        v_wendler_metadata_id,
        p_block_name,
        v_exercise_id
    ) RETURNING id INTO v_block_id;

    INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
    VALUES (v_block_id, v_exercise_id, v_set_order);
    v_set_order := v_set_order + 1;

    -- 2-4. Warm up sets: fractions and reps depend on cycle type
    DECLARE
        warmup_fractions NUMERIC[];
        warmup_reps INTEGER[];
    BEGIN
        IF p_cycle_type = '5' THEN
            warmup_fractions := ARRAY[0.35, 0.45, 0.55];
            warmup_reps := ARRAY[5, 4, 3];
        ELSIF p_cycle_type = '3' THEN
            warmup_fractions := ARRAY[0.4, 0.5, 0.6];
            warmup_reps := ARRAY[5, 4, 3];
        ELSIF p_cycle_type = '1' THEN
            warmup_fractions := ARRAY[0.45, 0.55, 0.65];
            warmup_reps := ARRAY[5, 4, 3];
        ELSE -- deload
            warmup_fractions := ARRAY[0.1, 0.2, 0.3];
            warmup_reps := ARRAY[5, 5, 5];
        END IF;
        FOR i IN 1..3 LOOP
            v_exercise_id := public.create_exercise(
                p_user_id::uuid, -- user_id
                p_exercise_type::exercise_type_enum, -- exercise_type
                'barbell'::equipment_type_enum, -- equipment_type
                public.round_to_nearest_5(v_training_max_value * warmup_fractions[i])::numeric, -- weight_value (rounded)
                public.round_to_1_decimal(v_training_max_value * warmup_fractions[i])::numeric, -- actual_weight_value
                warmup_reps[i]::integer, -- reps
                v_training_max_unit::weight_unit_enum, -- weight_unit
                NULL::timestamptz, -- performed_at
                TRUE::boolean, -- warmup
                FALSE::boolean, -- is_amrap
                'not_completed'::completion_status_enum, -- completion_status
                NULL::relative_effort_enum, -- relative_effort
                NULL -- notes
            );
            INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
            VALUES (v_block_id, v_exercise_id, v_set_order);
            v_set_order := v_set_order + 1;
        END LOOP;
    END;

    -- 5-7. Working sets (fractions and reps also depend on cycle type)
    DECLARE
        working_fractions NUMERIC[];
        working_reps INTEGER[];
    BEGIN
        IF p_cycle_type = '5' THEN
            working_fractions := ARRAY[0.65, 0.75, 0.85];
            working_reps := ARRAY[5, 5, 5];
        ELSIF p_cycle_type = '3' THEN
            working_fractions := ARRAY[0.70, 0.80, 0.90];
            working_reps := ARRAY[3, 3, 3];
        ELSIF p_cycle_type = '1' THEN
            working_fractions := ARRAY[0.75, 0.85, 0.95];
            working_reps := ARRAY[5, 3, 1];
        ELSE -- deload
            working_fractions := ARRAY[0.4, 0.5, 0.6];
            working_reps := ARRAY[5, 5, 5];
        END IF;
        FOR i IN 1..3 LOOP
            v_exercise_id := public.create_exercise(
                p_user_id::uuid, -- user_id
                p_exercise_type::exercise_type_enum, -- exercise_type
                'barbell'::equipment_type_enum, -- equipment_type
                public.round_to_nearest_5(v_training_max_value * working_fractions[i])::numeric, -- weight_value (rounded)
                public.round_to_1_decimal(v_training_max_value * working_fractions[i])::numeric, -- actual_weight_value
                working_reps[i]::integer, -- reps
                v_training_max_unit::weight_unit_enum, -- weight_unit
                NULL::timestamptz, -- performed_at
                FALSE::boolean, -- warmup
                (i = 3)::boolean, -- is_amrap: true for last set
                'not_completed'::completion_status_enum, -- completion_status
                NULL::relative_effort_enum, -- relative_effort
                NULL -- notes
            );
            INSERT INTO exercise_block_exercises (block_id, exercise_id, exercise_order)
            VALUES (v_block_id, v_exercise_id, v_set_order);
            v_set_order := v_set_order + 1;
        END LOOP;
    END;

    RETURN v_block_id;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_block_prereq_error_enum') THEN
    CREATE TYPE public.wendler_block_prereq_error_enum AS ENUM (
      'no_target_max',
      'unit_mismatch'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_block_prereqs_row') THEN
    CREATE TYPE public.wendler_block_prereqs_row AS (
      is_target_max_set BOOLEAN,
      is_prev_cycle_unit_match BOOLEAN,
      has_no_target_max BOOLEAN,
      has_unit_mismatch BOOLEAN,
      prev_cycle_unit weight_unit_enum,
      current_unit weight_unit_enum,
      prev_training_max NUMERIC,
      current_training_max NUMERIC
    );
  END IF;
END$$;

-- -----------------------------------------------------------------------------
-- Function: public.check_wendler_block_prereqs
--
-- Purpose: Checks if all required values for creating a Wendler 5/3/1 block are set for a user/exercise.
--          Returns a single row with booleans and details for UI to display actionable feedback.
--
-- Arguments:
--   p_user_id UUID - The user to check.
--   p_exercise_type exercise_type_enum - The exercise type (e.g., 'bench_press').
--
-- Returns:
--   wendler_block_prereqs_row
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_wendler_block_prereqs (
  p_user_id UUID,
  p_exercise_type exercise_type_enum
) RETURNS wendler_block_prereqs_row LANGUAGE plpgsql AS $$
DECLARE
  v_current_training_max NUMERIC;
  v_current_unit weight_unit_enum;
  v_prev_training_max NUMERIC;
  v_prev_unit weight_unit_enum;
  result wendler_block_prereqs_row;
  has_no_target_max BOOLEAN := FALSE;
  has_unit_mismatch BOOLEAN := FALSE;
BEGIN
  -- Check if target max is set
  SELECT value, unit INTO v_current_training_max, v_current_unit
    FROM public.get_target_max(p_user_id, p_exercise_type);
  IF v_current_training_max IS NULL OR v_current_unit IS NULL THEN
    has_no_target_max := TRUE;
  END IF;

  -- Get previous cycle's training max and unit
  SELECT training_max_value, training_max_unit INTO v_prev_training_max, v_prev_unit
    FROM wendler_metadata
   WHERE user_id = p_user_id AND exercise_type = p_exercise_type
   ORDER BY created_at DESC
   LIMIT 1;

  IF v_prev_training_max IS NOT NULL AND v_prev_unit IS DISTINCT FROM v_current_unit THEN
    has_unit_mismatch := TRUE;
  END IF;

  result.is_target_max_set := v_current_training_max IS NOT NULL AND v_current_unit IS NOT NULL;
  result.is_prev_cycle_unit_match := (v_prev_training_max IS NULL) OR (v_prev_unit = v_current_unit);
  result.has_no_target_max := has_no_target_max;
  result.has_unit_mismatch := has_unit_mismatch;
  result.prev_cycle_unit := v_prev_unit;
  result.current_unit := v_current_unit;
  result.prev_training_max := v_prev_training_max;
  result.current_training_max := v_current_training_max;
  RETURN result;
END;
$$;

-- -----------------------------------------------------------------------------
-- Composite type: wendler_block_exercise_row
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_block_exercise_row') THEN
    CREATE TYPE public.wendler_block_exercise_row AS (
      exercise_id uuid,
      exercise_type exercise_type_enum,
      equipment_type equipment_type_enum,
      performed_at timestamptz,
      weight_value numeric,
      actual_weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      warmup boolean,
      is_amrap boolean,
      completion_status completion_status_enum,
      notes text,
      relative_effort relative_effort_enum
    );
  END IF;
END$$;

-- Function: public.get_wendler_block
-- Purpose: Given a Wendler block ID and user ID, returns all exercises in the block (ordered) for that user.
-- Arguments:
--   p_block_id UUID - The Wendler block ID (exercise_block.id, assumed to be a Wendler block).
--   p_user_id UUID - The user ID (for security/multi-tenancy).
-- Returns:
--   SETOF wendler_block_exercise_row (ordered by exercise_order)
CREATE OR REPLACE FUNCTION public.get_wendler_block (p_block_id UUID, p_user_id UUID) RETURNS SETOF public.wendler_block_exercise_row LANGUAGE sql STABLE AS $$
  SELECT
    e.id AS exercise_id,
    e.exercise_type,
    e.equipment_type,
    e.performed_at,
    e.weight_value,
    e.actual_weight_value,
    e.weight_unit,
    e.reps,
    e.warmup,
    e.is_amrap,
    e.completion_status,
    e.notes,
    e.relative_effort
  FROM public.exercise_block_exercises ebe
  JOIN public.exercises e ON ebe.exercise_id = e.id
  JOIN public.exercise_block b ON ebe.block_id = b.id
  WHERE ebe.block_id = p_block_id
    AND b.user_id = p_user_id
  ORDER BY ebe.exercise_order ASC;
$$;

-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wendler_metadata_row') THEN
    CREATE TYPE public.wendler_metadata_row AS (
      id uuid,
      user_id uuid,
      training_max_value numeric,
      training_max_unit weight_unit_enum,
      increase_amount_value numeric,
      increase_amount_unit weight_unit_enum,
      cycle_type wendler_cycle_type_enum,
      exercise_type exercise_type_enum,
      created_at timestamptz,
      updated_at timestamptz,
      block_id uuid,
      block_name text,
      block_notes text,
      block_created_at timestamptz,
      block_updated_at timestamptz,
      active_exercise_id uuid
    );
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_wendler_metadata (p_block_id UUID, p_user_id UUID) RETURNS public.wendler_metadata_row LANGUAGE sql STABLE AS $$
  SELECT
    wm.id,
    wm.user_id,
    wm.training_max_value,
    wm.training_max_unit,
    wm.increase_amount_value,
    wm.increase_amount_unit,
    wm.cycle_type,
    wm.exercise_type,
    wm.created_at,
    wm.updated_at,
    b.id AS block_id,
    b.name AS block_name,
    b.notes AS block_notes,
    b.created_at AS block_created_at,
    b.updated_at AS block_updated_at,
    b.active_exercise_id
  FROM public.exercise_block b
  JOIN public.wendler_metadata wm ON b.wendler_metadata_id = wm.id
  WHERE b.id = p_block_id
    AND b.user_id = p_user_id
  LIMIT 1;
$$;
