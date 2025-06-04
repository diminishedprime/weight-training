-- Helper function to round to nearest 5 lbs
CREATE OR REPLACE FUNCTION public.round_to_nearest_5(p_weight numeric)
RETURNS numeric AS $$
BEGIN
    RETURN ROUND(p_weight / 5.0) * 5;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function to normalize bar weight to at least 45 lbs and round to nearest 5 lbs
CREATE OR REPLACE FUNCTION public.normalize_bar_weight(p_weight numeric)
RETURNS numeric AS $$
BEGIN
    RETURN GREATEST(45, public.round_to_nearest_5(p_weight));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to create a new wendler lift session for a 5's day, using a training max in pounds.
CREATE OR REPLACE FUNCTION public.create_wendler_lift_session_5s(
    p_user_id uuid,
    p_training_max_lbs numeric(5,2),
    p_increase_amount_lbs numeric(5,2),
    p_lift_type lift_type_enum
) RETURNS uuid AS $$
DECLARE
    v_wendler_id uuid;
    v_lift_group_id uuid := uuid_generate_v4();
    v_training_max_id uuid;
    v_increase_amount_id uuid;
    v_training_max numeric(5,2) := p_training_max_lbs;
    v_emptybar_weight_id uuid;
    v_weight_id uuid;
    v_lift_id uuid;
    v_position integer := 1;
BEGIN
    -- Insert the training max as a weight (in pounds)
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_training_max_lbs, 'pounds')
    RETURNING id INTO v_training_max_id;

    -- Insert the increase amount as a weight (in pounds)
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_increase_amount_lbs, 'pounds')
    RETURNING id INTO v_increase_amount_id;

    -- Insert Wendler metadata
    INSERT INTO public.wendler_metadata (training_max_id, increase_amount_id, cycle_type, lift_type)
    VALUES (v_training_max_id, v_increase_amount_id, '5', p_lift_type)
    RETURNING id INTO v_wendler_id;

    -- Insert lift group with Wendler metadata
    INSERT INTO public.lift_group (id, user_id, wendler_id)
    VALUES (v_lift_group_id, p_user_id, v_wendler_id);

    -- 1. Warmup: empty bar (45 lbs) for 8 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (45, 'pounds') RETURNING id INTO v_emptybar_weight_id;
    INSERT INTO public.lifts (user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_lift_type, NULL, v_emptybar_weight_id, 8, true, 'Not Completed')
    RETURNING id INTO v_lift_id;
    INSERT INTO public.exercise_block (lift_group_id, lift_id, block_order) VALUES (v_lift_group_id, v_lift_id, v_position);
    v_position := v_position + 1;

    -- 2. Warmup: 0.3 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.3), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.lifts (user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_lift_type, NULL, v_weight_id, 5, true, 'Not Completed')
    RETURNING id INTO v_lift_id;
    INSERT INTO public.exercise_block (lift_group_id, lift_id, block_order) VALUES (v_lift_group_id, v_lift_id, v_position);
    v_position := v_position + 1;

    -- 3. Warmup: 0.45 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.45), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.lifts (user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_lift_type, NULL, v_weight_id, 5, true, 'Not Completed')
    RETURNING id INTO v_lift_id;
    INSERT INTO public.exercise_block (lift_group_id, lift_id, block_order) VALUES (v_lift_group_id, v_lift_id, v_position);
    v_position := v_position + 1;

    -- 4. Warmup: 0.55 * training max for 3 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.55), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.lifts (user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_lift_type, NULL, v_weight_id, 3, true, 'Not Completed')
    RETURNING id INTO v_lift_id;
    INSERT INTO public.exercise_block (lift_group_id, lift_id, block_order) VALUES (v_lift_group_id, v_lift_id, v_position);
    v_position := v_position + 1;

    -- 5. Working set: 0.65 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.65), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.lifts (user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_lift_type, NULL, v_weight_id, 5, false, 'Not Completed')
    RETURNING id INTO v_lift_id;
    INSERT INTO public.exercise_block (lift_group_id, lift_id, block_order) VALUES (v_lift_group_id, v_lift_id, v_position);
    v_position := v_position + 1;

    -- 6. Working set: 0.75 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.75), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.lifts (user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_lift_type, NULL, v_weight_id, 5, false, 'Not Completed')
    RETURNING id INTO v_lift_id;
    INSERT INTO public.exercise_block (lift_group_id, lift_id, block_order) VALUES (v_lift_group_id, v_lift_id, v_position);
    v_position := v_position + 1;

    -- 7. Working set: 0.85 * training max for 5 reps
    INSERT INTO public.weights (weight_value, weight_unit) VALUES (public.normalize_bar_weight(v_training_max * 0.85), 'pounds') RETURNING id INTO v_weight_id;
    INSERT INTO public.lifts (user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status)
    VALUES (p_user_id, p_lift_type, NULL, v_weight_id, 5, false, 'Not Completed')
    RETURNING id INTO v_lift_id;
    INSERT INTO public.exercise_block (lift_group_id, lift_id, block_order) VALUES (v_lift_group_id, v_lift_id, v_position);

    RETURN v_lift_group_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get detailed info for a Wendler lift group by id
CREATE OR REPLACE FUNCTION public.get_wendler_lift_group_details(p_lift_group_id uuid)
RETURNS TABLE (
  lift_group_id uuid,
  user_id uuid,
  cycle_type text,
  lift_type text,
  training_max numeric(5,2),
  training_max_unit text,
  increase_amount numeric(5,2),
  increase_amount_unit text,
  lift_id uuid,
  performed_at timestamp with time zone,
  reps integer,
  warmup boolean,
  completion_status text,
  weight_value numeric(5,2),
  weight_unit text,
  block_order integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    lg.id AS lift_group_id,
    lg.user_id,
    wm.cycle_type,
    wm.lift_type,
    tm.weight_value AS training_max,
    tm.weight_unit AS training_max_unit,
    ia.weight_value AS increase_amount,
    ia.weight_unit AS increase_amount_unit,
    l.id AS lift_id,
    l.performed_at,
    l.reps,
    l.warmup,
    l.completion_status,
    w.weight_value,
    w.weight_unit,
    eb.block_order
  FROM public.lift_group lg
  JOIN public.wendler_metadata wm ON lg.wendler_id = wm.id
  JOIN public.weights tm ON wm.training_max_id = tm.id
  JOIN public.weights ia ON wm.increase_amount_id = ia.id
  JOIN public.exercise_block eb ON eb.lift_group_id = lg.id
  JOIN public.lifts l ON eb.lift_id = l.id
  JOIN public.weights w ON l.weight_id = w.id
  WHERE lg.id = p_lift_group_id
  ORDER BY eb.block_order;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to create a new lift with parameterized values
CREATE OR REPLACE FUNCTION public.create_lift(
    p_user_id uuid,
    p_lift_type lift_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'Completed'
) RETURNS uuid AS $$
DECLARE
    v_weight_id uuid;
    v_lift_id uuid;
BEGIN
    -- Insert weight and get its id
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;

    -- Insert lift and get its id
    INSERT INTO public.lifts (
        user_id, lift_type, performed_at, weight_id, reps, warmup, completion_status
    ) VALUES (
        p_user_id, p_lift_type, p_performed_at, v_weight_id, p_reps, p_warmup, p_completion_status
    )
    RETURNING id INTO v_lift_id;

    RETURN v_lift_id;
END;
$$ LANGUAGE plpgsql;

-- Function to retrieve lifts of a certain lift_type for a given user
CREATE OR REPLACE FUNCTION public.get_lifts_by_type_for_user(
    p_user_id uuid,
    p_lift_type lift_type_enum
)
RETURNS TABLE (
    lift_id uuid,
    user_id uuid,
    lift_type lift_type_enum,
    performed_at timestamptz,
    weight_value numeric,
    weight_unit weight_unit_enum,
    reps integer,
    warmup boolean,
    completion_status completion_status_enum
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.user_id,
        l.lift_type,
        l.performed_at,
        w.weight_value,
        w.weight_unit,
        l.reps,
        l.warmup,
        l.completion_status
    FROM public.lifts l
    JOIN public.weights w ON l.weight_id = w.id
    WHERE l.user_id = p_user_id
      AND l.lift_type = p_lift_type
    ORDER BY l.performed_at DESC NULLS LAST
    LIMIT 30;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update an existing lift for a given user
CREATE OR REPLACE FUNCTION public.update_lift_for_user(
    p_lift_id uuid,
    p_user_id uuid,
    p_lift_type lift_type_enum,
    p_weight_value numeric,
    p_reps integer,
    p_performed_at timestamptz DEFAULT NULL,
    p_weight_unit weight_unit_enum DEFAULT 'pounds',
    p_warmup boolean DEFAULT false,
    p_completion_status completion_status_enum DEFAULT 'Completed'
) RETURNS void AS $$
DECLARE
    v_weight_id uuid;
BEGIN
    -- Insert new weight and get its id
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;

    -- Update the lift row, only if it belongs to the user
    UPDATE public.lifts
    SET
        lift_type = p_lift_type,
        performed_at = p_performed_at,
        weight_id = v_weight_id,
        reps = p_reps,
        warmup = p_warmup,
        completion_status = p_completion_status
    WHERE id = p_lift_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Composite type for a single lift row
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lift_row_type') THEN
    CREATE TYPE public.lift_row_type AS (
      lift_id uuid,
      user_id uuid,
      lift_type lift_type_enum,
      performed_at timestamptz,
      weight_value numeric,
      weight_unit weight_unit_enum,
      reps integer,
      warmup boolean,
      completion_status completion_status_enum
    );
  END IF;
END$$;

-- Function to retrieve a single lift for a given user by lift_id (returns a single row or null)
CREATE OR REPLACE FUNCTION public.get_lift_for_user(
    p_user_id uuid,
    p_lift_id uuid
)
RETURNS lift_row_type AS $$
DECLARE
    result lift_row_type;
BEGIN
    SELECT
        l.id,
        l.user_id,
        l.lift_type,
        l.performed_at,
        w.weight_value,
        w.weight_unit,
        l.reps,
        l.warmup,
        l.completion_status
    INTO result
    FROM public.lifts l
    JOIN public.weights w ON l.weight_id = w.id
    WHERE l.user_id = p_user_id
      AND l.id = p_lift_id
    LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

