DROP FUNCTION IF EXISTS delete_block;

CREATE OR REPLACE FUNCTION delete_block (p_block_id uuid, p_user_id uuid) RETURNS public.get_perform_superblock_result LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_superblock_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM exercise_block 
    WHERE id = p_block_id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Block not found or access denied';
  END IF;

  SELECT superblock_id INTO v_superblock_id FROM exercise_superblock_blocks WHERE block_id = p_block_id LIMIT 1;

  UPDATE exercise_superblock 
  SET active_block_id = NULL 
  WHERE active_block_id = p_block_id AND user_id = p_user_id;

  WITH remaining_blocks AS (
    SELECT 
      esb.superblock_id,
      esb.block_id,
      ROW_NUMBER() OVER (ORDER BY esb.superblock_order) as new_order
    FROM exercise_superblock_blocks esb
    WHERE esb.superblock_id = v_superblock_id
      AND esb.block_id != p_block_id
  )
  UPDATE exercise_superblock_blocks 
  SET superblock_order = remaining_blocks.new_order
  FROM remaining_blocks 
  WHERE exercise_superblock_blocks.superblock_id = remaining_blocks.superblock_id 
    AND exercise_superblock_blocks.block_id = remaining_blocks.block_id;

  DELETE FROM exercise_block WHERE id = p_block_id AND user_id = p_user_id;

  RETURN public.get_perform_superblock(p_user_id => p_user_id, p_superblock_id => v_superblock_id);
END;
$$;
