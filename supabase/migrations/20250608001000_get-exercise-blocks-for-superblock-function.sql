-- Returns all exercise blocks for a given superblock, with block metadata
CREATE OR REPLACE FUNCTION public.get_exercise_blocks_for_superblock(
    p_superblock_id uuid
)
RETURNS TABLE (
    block_id uuid,
    block_order integer,
    name text,
    notes text,
    created_at timestamptz,
    updated_at timestamptz,
    exercise_id uuid,
    exercise_order integer,
    performed_at timestamptz,
    weight_value numeric,
    weight_unit weight_unit_enum,
    reps integer,
    warmup boolean,
    completion_status completion_status_enum,
    relative_effort relative_effort_enum,
    notes_exercise text,
    exercise_type exercise_type_enum,
    equipment_type equipment_type_enum
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        sb_blocks.superblock_order,
        b.name,
        b.notes,
        b.created_at,
        b.updated_at,
        e.id AS exercise_id,
        ebe.exercise_order,
        e.performed_at,
        w.weight_value,
        w.weight_unit,
        e.reps,
        e.warmup,
        e.completion_status,
        e.relative_effort,
        e.notes AS notes_exercise,
        e.exercise_type,
        e.equipment_type
    FROM public.exercise_block b
    JOIN public.exercise_superblock_blocks sb_blocks ON sb_blocks.block_id = b.id
    LEFT JOIN public.exercise_block_exercises ebe ON ebe.block_id = b.id
    LEFT JOIN public.exercises e ON ebe.exercise_id = e.id
    LEFT JOIN public.weights w ON e.weight_id = w.id
    WHERE sb_blocks.superblock_id = p_superblock_id
    ORDER BY sb_blocks.superblock_order ASC, ebe.exercise_order ASC;
END;
$$ LANGUAGE plpgsql STABLE;
