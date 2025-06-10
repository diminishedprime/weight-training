-- Fetch superblocks for a user (high-level metadata only)
-- Returns id, user_id, name, notes, created_at, updated_at
CREATE OR REPLACE FUNCTION public.get_superblocks_for_user(
    p_user_id uuid
)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    name text,
    notes text,
    created_at timestamptz,
    updated_at timestamptz,
    block_count integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.user_id,
        s.name,
        s.notes,
        s.created_at,
        s.updated_at,
        CAST((
          SELECT COUNT(*)
          FROM public.exercise_superblock_blocks b
          WHERE b.superblock_id = s.id
        ) AS integer) AS block_count
    FROM public.exercise_superblock s
    WHERE s.user_id = p_user_id
    ORDER BY s.updated_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;
