-- Create a function to group blockified exercise blocks into superblocks
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
  -- Step 1: Run blockify with note
  PERFORM _system.blockify(p_user_id, v_block_note);

  -- Step 2: Remove all superblocks created by this RPC for this user
  FOR v_superblock_id IN
    SELECT esb.id
    FROM public.exercise_superblock esb
    WHERE esb.user_id = p_user_id AND esb.notes = v_superblock_note
  LOOP
    DELETE FROM public.exercise_superblock_blocks WHERE superblock_id = v_superblock_id;
    DELETE FROM public.exercise_superblock WHERE id = v_superblock_id;
  END LOOP;

  -- Step 3: Group blocks into superblocks
  FOR v_block IN
    SELECT *
    FROM public.exercise_block
    WHERE user_id = p_user_id AND notes = v_block_note
    ORDER BY started_at
  LOOP

    IF v_open_superblock_id IS NOT NULL AND v_open_superblock_last_completed_at IS NOT NULL AND v_block.started_at - v_open_superblock_last_completed_at <= v_time_gap THEN
      -- Add to current open superblock
      v_superblock_order := v_superblock_order + 1;
      INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
        VALUES (v_open_superblock_id, v_block.id, v_superblock_order);
      -- Update last_completed_at if this block is completed
      IF v_block.completed_at IS NOT NULL THEN
        v_open_superblock_last_completed_at := v_block.completed_at;
      END IF;
    ELSE
      -- If there was an open superblock, close it (set completed_at if possible)
      IF v_open_superblock_id IS NOT NULL THEN
        IF v_open_superblock_last_completed_at IS NOT NULL THEN
          UPDATE public.exercise_superblock SET completed_at = v_open_superblock_last_completed_at WHERE id = v_open_superblock_id;
        END IF;
      END IF;
      -- Start a new superblock
      v_open_superblock_id := uuid_generate_v4();
      v_superblock_order := 1;
      INSERT INTO public.exercise_superblock (id, user_id, name, notes, started_at, created_at, updated_at)
        VALUES (v_open_superblock_id, p_user_id, NULL, v_superblock_note, v_block.started_at, timezone('utc', now()), timezone('utc', now()));
      INSERT INTO public.exercise_superblock_blocks (superblock_id, block_id, superblock_order)
        VALUES (v_open_superblock_id, v_block.id, v_superblock_order);
      -- Set last_completed_at if this block is completed
      IF v_block.completed_at IS NOT NULL THEN
        v_open_superblock_last_completed_at := v_block.completed_at;
      ELSE
        v_open_superblock_last_completed_at := NULL;
      END IF;
    END IF;
  END LOOP;

  -- After loop, close any open superblock
  IF v_open_superblock_id IS NOT NULL AND v_open_superblock_last_completed_at IS NOT NULL THEN
    UPDATE public.exercise_superblock SET completed_at = v_open_superblock_last_completed_at WHERE id = v_open_superblock_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
