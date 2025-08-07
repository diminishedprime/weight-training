CREATE OR REPLACE FUNCTION delete_block (p_block_id uuid, p_user_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM exercise_block 
    WHERE id = p_block_id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Block not found or access denied';
  END IF;

  UPDATE exercise_superblock 
  SET active_block_id = NULL 
  WHERE active_block_id = p_block_id AND user_id = p_user_id;

  WITH affected_superblocks AS (
    SELECT DISTINCT superblock_id
    FROM exercise_superblock_blocks 
    WHERE block_id = p_block_id
  ),
  remaining_blocks AS (
    SELECT 
      esb.superblock_id,
      esb.block_id,
      ROW_NUMBER() OVER (PARTITION BY esb.superblock_id ORDER BY esb.superblock_order) as new_order
    FROM exercise_superblock_blocks esb
    JOIN affected_superblocks asb ON esb.superblock_id = asb.superblock_id
    WHERE esb.block_id != p_block_id
  )
  UPDATE exercise_superblock_blocks 
  SET superblock_order = remaining_blocks.new_order
  FROM remaining_blocks 
  WHERE exercise_superblock_blocks.superblock_id = remaining_blocks.superblock_id 
    AND exercise_superblock_blocks.block_id = remaining_blocks.block_id;

  DELETE FROM exercise_block WHERE id = p_block_id AND user_id = p_user_id;
END;
$$;
