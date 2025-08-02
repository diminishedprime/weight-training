CREATE OR REPLACE FUNCTION _impl.super_blockify (
  p_user_id uuid,
  p_block_note text,
  p_superblock_note text
) RETURNS void AS $$
DECLARE
  v_block RECORD;
  v_superblock_id uuid;
  v_time_gap interval := INTERVAL '20 minutes';
  v_open_superblock_id uuid := NULL;
  v_open_superblock_last_completed_at timestamptz := NULL;
  v_superblock_order integer := 1;
  v_prev_block_completed_at timestamptz := NULL;
BEGIN
  PERFORM _system.blockify(p_user_id, p_block_note);

  FOR v_superblock_id IN
    SELECT esb.id
    FROM public.exercise_superblock esb
    WHERE esb.user_id = p_user_id AND esb.notes = p_superblock_note
  LOOP
    DELETE FROM public.exercise_superblock_blocks WHERE superblock_id = v_superblock_id;
    DELETE FROM public.exercise_superblock WHERE id = v_superblock_id;
  END LOOP;

  FOR v_block IN
    SELECT *
    FROM public.exercise_block
    WHERE user_id = p_user_id AND notes = p_block_note
    ORDER BY started_at
  LOOP
    IF v_open_superblock_id IS NOT NULL AND v_open_superblock_last_completed_at IS NOT NULL AND v_block.started_at - v_open_superblock_last_completed_at <= v_time_gap THEN
      v_superblock_order := v_superblock_order + 1;
      INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
        VALUES (v_open_superblock_id, v_block.id, v_superblock_order);
      IF v_block.completed_at IS NOT NULL THEN
        v_open_superblock_last_completed_at := v_block.completed_at;
      END IF;
    ELSE
      IF v_open_superblock_id IS NOT NULL THEN
        IF v_open_superblock_last_completed_at IS NOT NULL THEN
          UPDATE public.exercise_superblock SET completed_at = v_open_superblock_last_completed_at, completion_status = 'completed' WHERE id = v_open_superblock_id;
        END IF;
      END IF;
      v_open_superblock_id := uuid_generate_v4();
      v_superblock_order := 1;
      INSERT INTO public.exercise_superblock (id, user_id, name, notes, started_at, completion_status)
        VALUES (v_open_superblock_id, p_user_id, NULL, p_superblock_note, v_block.started_at, 'completed');
      INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
        VALUES (v_open_superblock_id, v_block.id, v_superblock_order);
      IF v_block.completed_at IS NOT NULL THEN
        v_open_superblock_last_completed_at := v_block.completed_at;
      ELSE
        v_open_superblock_last_completed_at := NULL;
      END IF;
    END IF;
  END LOOP;

  IF v_open_superblock_id IS NOT NULL AND v_open_superblock_last_completed_at IS NOT NULL THEN
    UPDATE public.exercise_superblock SET completed_at = v_open_superblock_last_completed_at, completion_status = 'completed' WHERE id = v_open_superblock_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _impl.try_to_name (p_superblock_note text) RETURNS void AS $$
DECLARE
  v_superblock RECORD;
  v_has_squat boolean;
  v_has_bench_or_ohp boolean;
  v_has_deadlift boolean;
BEGIN
  FOR v_superblock IN
    SELECT esb.id
    FROM public.exercise_superblock esb
    WHERE esb.notes = p_superblock_note
  LOOP
    SELECT EXISTS (
      SELECT 1
      FROM public.exercise_superblock_blocks esbb
      JOIN public.exercise_block eb ON esbb.block_id = eb.id
      WHERE esbb.superblock_id = v_superblock.id
        AND eb.exercise_type IN ('barbell_back_squat')
    ) INTO v_has_squat;

    SELECT EXISTS (
      SELECT 1
      FROM public.exercise_superblock_blocks esbb
      JOIN public.exercise_block eb ON esbb.block_id = eb.id
      WHERE esbb.superblock_id = v_superblock.id
        AND eb.exercise_type IN ('barbell_bench_press', 'barbell_overhead_press')
    ) INTO v_has_bench_or_ohp;

    SELECT EXISTS (
      SELECT 1
      FROM public.exercise_superblock_blocks esbb
      JOIN public.exercise_block eb ON esbb.block_id = eb.id
      WHERE esbb.superblock_id = v_superblock.id
        AND eb.exercise_type IN ('barbell_deadlift')
    ) INTO v_has_deadlift;

    IF v_has_squat THEN
      UPDATE public.exercise_superblock SET name = 'Leg Day' WHERE id = v_superblock.id;
    ELSIF v_has_bench_or_ohp THEN
      UPDATE public.exercise_superblock SET name = 'Push Day' WHERE id = v_superblock.id;
    ELSIF v_has_deadlift THEN
      UPDATE public.exercise_superblock SET name = 'Pull Day' WHERE id = v_superblock.id;
    ELSE
      UPDATE public.exercise_superblock SET name = 'Various Exercises' WHERE id = v_superblock.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _system.super_blockify (p_user_id uuid) RETURNS void AS $$
DECLARE
  v_block_note text := 'created by _blockify';
  v_superblock_note text := 'created by super_blockify';
BEGIN
  PERFORM _impl.super_blockify(p_user_id, v_block_note, v_superblock_note);
  PERFORM _impl.try_to_name(v_superblock_note);
END;
$$ LANGUAGE plpgsql;
