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
