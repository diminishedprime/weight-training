CREATE OR REPLACE FUNCTION _impl.blockify_set_completed_at (p_user_id uuid, p_block_note text) RETURNS void AS $$
DECLARE
  v_block_id uuid;
  v_last_performed_at timestamptz;
BEGIN
  FOR v_block_id IN
    SELECT eb.id
    FROM public.exercise_block eb
    WHERE eb.user_id = p_user_id
      AND eb.notes = p_block_note
      AND eb.completed_at IS NULL
  LOOP
    SELECT e.performed_at INTO v_last_performed_at
    FROM public.exercise_block_exercises ebe
    JOIN public.exercises e ON ebe.exercise_id = e.id
    WHERE ebe.block_id = v_block_id
    ORDER BY ebe.exercise_order DESC
    LIMIT 1;
    UPDATE public.exercise_block
      SET completed_at = v_last_performed_at
      WHERE id = v_block_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _impl.blockify_create_blocks (p_user_id uuid, p_block_note text) RETURNS void AS $$
DECLARE
  v_rec RECORD;
  v_prev_exercise_type exercise_type_enum;
  v_prev_performed_at timestamp with time zone;
  v_prev_exercise_id uuid;
  v_block_id uuid;
  v_block_order integer := 1;
  v_block_start_time timestamp with time zone;
  v_block_exercise_count integer := 0;
  v_time_gap interval := INTERVAL '15 minutes';
BEGIN
  DELETE FROM public.exercise_block
  WHERE user_id = p_user_id AND notes = p_block_note;

  CREATE TEMP TABLE tmp_open_blocks (
    exercise_type exercise_type_enum,
    block_id uuid,
    last_performed_at timestamptz,
    block_order integer
  ) ON COMMIT DROP;

  FOR v_rec IN
    SELECT * FROM public.exercises
    WHERE user_id = p_user_id
      AND performed_at IS NOT NULL
    ORDER BY exercise_type, performed_at
  LOOP
    SELECT tmp_open_blocks.block_id, tmp_open_blocks.last_performed_at, tmp_open_blocks.block_order
      INTO v_block_id, v_block_start_time, v_block_order
    FROM tmp_open_blocks
    WHERE tmp_open_blocks.exercise_type = v_rec.exercise_type
      AND abs(extract(epoch from (v_rec.performed_at - tmp_open_blocks.last_performed_at))) <= extract(epoch from v_time_gap)
    ORDER BY tmp_open_blocks.last_performed_at DESC
    LIMIT 1;

    IF v_block_id IS NULL THEN
      v_block_id := uuid_generate_v4();
      v_block_order := 1;
      INSERT INTO public.exercise_block (id, user_id, name, notes, exercise_type, equipment_type, started_at, created_at, updated_at)
        VALUES (v_block_id, p_user_id, NULL, p_block_note, v_rec.exercise_type, v_rec.equipment_type, v_rec.performed_at, timezone('utc', now()), timezone('utc', now()));
      INSERT INTO tmp_open_blocks (exercise_type, block_id, last_performed_at, block_order)
        VALUES (v_rec.exercise_type, v_block_id, v_rec.performed_at, v_block_order);
    ELSE
      v_block_order := v_block_order + 1;
      UPDATE tmp_open_blocks
        SET last_performed_at = v_rec.performed_at, block_order = v_block_order
        WHERE tmp_open_blocks.block_id = v_block_id;
    END IF;

    INSERT INTO public.exercise_block_exercises (block_id, exercise_id, exercise_order)
      VALUES (v_block_id, v_rec.id, v_block_order);

    DELETE FROM tmp_open_blocks
      WHERE tmp_open_blocks.exercise_type = v_rec.exercise_type
        AND abs(extract(epoch from (v_rec.performed_at - tmp_open_blocks.last_performed_at))) > extract(epoch from v_time_gap);

    v_block_id := NULL;
    v_block_order := 1;
    v_block_start_time := NULL;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _impl.blockify_cleanup_small_blocks (p_user_id uuid, p_block_note text) RETURNS void AS $$
DECLARE
  v_block_id uuid;
BEGIN
  FOR v_block_id IN
    SELECT eb.id
    FROM public.exercise_block eb
    WHERE eb.user_id = p_user_id
      AND eb.notes = p_block_note
      AND (
        SELECT count(*)
        FROM public.exercise_block_exercises ebe
        WHERE ebe.block_id = eb.id
      ) < 3
  LOOP
    DELETE FROM public.exercise_block_exercises WHERE block_id = v_block_id;
    DELETE FROM public.exercise_block WHERE id = v_block_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _impl.blockify_name_blocks (p_user_id uuid, p_block_note text) RETURNS void AS $$
DECLARE
  v_block RECORD;
  v_set_count integer;
  v_name text;
  v_exercise_type text;
  v_last_performed_at timestamptz;
  v_after_2025 boolean;
BEGIN
  FOR v_block IN
    SELECT eb.id
    FROM public.exercise_block eb
    WHERE eb.user_id = p_user_id
      AND eb.notes = p_block_note
  LOOP
    CREATE TEMP TABLE tmp_block_sets (
      idx integer,
      exercise_id uuid,
      exercise_type text,
      performed_at timestamptz,
      reps integer,
      weight numeric
    ) ON COMMIT DROP;

    INSERT INTO tmp_block_sets (idx, exercise_id, exercise_type, performed_at, reps, weight)
    SELECT row_number() OVER (ORDER BY e.performed_at, ebe.exercise_order) AS idx,
           e.id, e.exercise_type, e.performed_at, e.reps, e.actual_weight_value
      FROM public.exercise_block_exercises ebe
      JOIN public.exercises e ON ebe.exercise_id = e.id
      WHERE ebe.block_id = v_block.id;

    SELECT count(*) INTO v_set_count FROM tmp_block_sets;
    IF v_set_count IS NULL OR v_set_count < 3 THEN
      DROP TABLE tmp_block_sets;
      CONTINUE;
    END IF;

    SELECT exercise_type, performed_at INTO v_exercise_type, v_last_performed_at
      FROM tmp_block_sets WHERE idx = v_set_count;
    v_after_2025 := v_last_performed_at >= '2025-01-01';

    IF v_set_count >= 5 THEN
      IF (
        SELECT count(*) FROM tmp_block_sets
        WHERE idx BETWEEN v_set_count-4 AND v_set_count AND reps = 5
      ) = 5 AND (
        SELECT count(DISTINCT weight) FROM tmp_block_sets
        WHERE idx BETWEEN v_set_count-4 AND v_set_count
      ) = 1 THEN
        v_name := 'classic 5x5';
        UPDATE public.exercise_block SET name = v_name WHERE id = v_block.id;
        DROP TABLE tmp_block_sets;
        CONTINUE;
      END IF;
    END IF;

    IF (
      SELECT count(*) FROM tmp_block_sets
      WHERE idx BETWEEN v_set_count-2 AND v_set_count AND reps = 3
    ) = 3 AND (
      SELECT count(DISTINCT weight) FROM tmp_block_sets
      WHERE idx BETWEEN v_set_count-2 AND v_set_count
    ) = 1 THEN
      v_name := 'classic 3x3';
      UPDATE public.exercise_block SET name = v_name WHERE id = v_block.id;
      DROP TABLE tmp_block_sets;
      CONTINUE;
    END IF;

    IF v_after_2025 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count-2
    ) = 5 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count-1
    ) = 5 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count
    ) > 5 THEN
      IF NOT (
        v_set_count >= 5 AND (
          SELECT count(*) FROM tmp_block_sets
          WHERE idx BETWEEN v_set_count-4 AND v_set_count AND reps = 5
        ) = 5 AND (
          SELECT count(DISTINCT weight) FROM tmp_block_sets
          WHERE idx BETWEEN v_set_count-4 AND v_set_count
        ) = 1
      ) THEN
        v_name := 'Wendler 5s';
        UPDATE public.exercise_block SET name = v_name WHERE id = v_block.id;
        DROP TABLE tmp_block_sets;
        CONTINUE;
      END IF;
    END IF;

    IF v_after_2025 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count-2
    ) = 3 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count-1
    ) = 3 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count
    ) > 3 THEN
      IF NOT ((
        SELECT count(*) FROM tmp_block_sets
        WHERE idx BETWEEN v_set_count-2 AND v_set_count AND reps = 3
      ) = 3 AND (
        SELECT count(DISTINCT weight) FROM tmp_block_sets
        WHERE idx BETWEEN v_set_count-2 AND v_set_count
      ) = 1) THEN
        v_name := 'Wendler 3s';
        UPDATE public.exercise_block SET name = v_name WHERE id = v_block.id;
        DROP TABLE tmp_block_sets;
        CONTINUE;
      END IF;
    END IF;

    IF v_after_2025 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count-2
    ) = 5 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count-1
    ) = 3 AND (
      SELECT reps FROM tmp_block_sets WHERE idx = v_set_count
    ) > 1 THEN
      v_name := 'Wendler 1s';
      UPDATE public.exercise_block SET name = v_name WHERE id = v_block.id;
      DROP TABLE tmp_block_sets;
      CONTINUE;
    END IF;

    IF v_set_count BETWEEN 3 AND 6 THEN
      DECLARE
        v_avg_reps numeric;
        v_max_diff numeric := 2;
        v_last_set_reps integer;
        v_all_close boolean := true;
        v_idx integer;
        v_rep integer;
      BEGIN
        SELECT avg(reps)::numeric INTO v_avg_reps FROM tmp_block_sets WHERE idx < v_set_count;
        SELECT reps INTO v_last_set_reps FROM tmp_block_sets WHERE idx = v_set_count;
        FOR v_idx IN 1..(v_set_count-1) LOOP
          SELECT reps INTO v_rep FROM tmp_block_sets WHERE idx = v_idx;
          IF abs(v_rep - v_avg_reps) > v_max_diff THEN
            v_all_close := false;
            EXIT;
          END IF;
        END LOOP;
        IF v_all_close THEN
          IF abs(v_last_set_reps - v_avg_reps) <= v_max_diff OR v_last_set_reps > v_avg_reps THEN
            v_name :=  v_set_count::text || ' sets';
            UPDATE public.exercise_block SET name = v_name WHERE id = v_block.id;
            DROP TABLE tmp_block_sets;
            CONTINUE;
          END IF;
        END IF;
      END;
    END IF;
    DROP TABLE tmp_block_sets;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _system.blockify (p_user_id uuid, p_block_note text) RETURNS void AS $$
BEGIN
  PERFORM _impl.blockify_create_blocks(p_user_id, p_block_note);
  PERFORM _impl.blockify_cleanup_small_blocks(p_user_id, p_block_note);
  PERFORM _impl.blockify_set_completed_at(p_user_id, p_block_note);
  PERFORM _impl.blockify_name_blocks(p_user_id, p_block_note);
END;
$$ LANGUAGE plpgsql;
