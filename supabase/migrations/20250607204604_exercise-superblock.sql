-- Create exercise_superblock table
CREATE TABLE IF NOT EXISTS public.exercise_superblock
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    name text NULL,
    notes text NULL,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    updated_at timestamp with time zone DEFAULT timezone('utc', now()),
    CONSTRAINT exercise_superblock_pkey PRIMARY KEY (id),
    CONSTRAINT exercise_superblock_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);

-- Join table for exercise_superblock <-> exercise_block (many-to-many)
CREATE TABLE IF NOT EXISTS public.exercise_superblock_blocks
(
    superblock_id uuid NOT NULL,
    block_id uuid NOT NULL,
    superblock_order integer NOT NULL,
    CONSTRAINT exercise_superblock_blocks_pkey PRIMARY KEY (superblock_id, block_id),
    CONSTRAINT fk_superblock FOREIGN KEY (superblock_id) REFERENCES public.exercise_superblock(id) ON DELETE CASCADE,
    CONSTRAINT fk_block FOREIGN KEY (block_id) REFERENCES public.exercise_block(id) ON DELETE CASCADE
);



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