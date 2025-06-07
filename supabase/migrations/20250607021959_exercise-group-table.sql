-- Create exercise_group table
CREATE TABLE IF NOT EXISTS public.exercise_group 
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    wendler_id uuid NULL,
    CONSTRAINT exercise_group_id_pkey PRIMARY KEY (id),
    CONSTRAINT exercise_group_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
