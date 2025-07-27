CREATE OR REPLACE FUNCTION _system.super_blockify (p_user_id uuid) RETURNS void AS $$
DECLARE
  v_block RECORD;
  v_superblock_id uuid;
  v_block_note text := 'created by _blockify';
  v_time_gap interval := INTERVAL '20 minutes';
  v_superblock_note text := 'created by super_blockify';
  v_open_superblock_id uuid := NULL;
  v_open_superblock_last_completed_at timestamptz := NULL;
  v_superblock_order integer := 1;
  v_prev_block_completed_at timestamptz := NULL;
BEGIN
  PERFORM _system.blockify(p_user_id, v_block_note);

  FOR v_superblock_id IN
    SELECT esb.id
    FROM public.exercise_superblock esb
    WHERE esb.user_id = p_user_id AND esb.notes = v_superblock_note
  LOOP
    DELETE FROM public.exercise_superblock_blocks WHERE superblock_id = v_superblock_id;
    DELETE FROM public.exercise_superblock WHERE id = v_superblock_id;
  END LOOP;

  FOR v_block IN
    SELECT *
    FROM public.exercise_block
    WHERE user_id = p_user_id AND notes = v_block_note
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
          UPDATE public.exercise_superblock SET completed_at = v_open_superblock_last_completed_at WHERE id = v_open_superblock_id;
        END IF;
      END IF;
      v_open_superblock_id := uuid_generate_v4();
      v_superblock_order := 1;
      INSERT INTO public.exercise_superblock (id, user_id, name, notes, started_at, created_at, updated_at)
        VALUES (v_open_superblock_id, p_user_id, NULL, v_superblock_note, v_block.started_at, timezone('utc', now()), timezone('utc', now()));
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
    UPDATE public.exercise_superblock SET completed_at = v_open_superblock_last_completed_at WHERE id = v_open_superblock_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
