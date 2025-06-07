-- Create workout_session table
CREATE TABLE IF NOT EXISTS public.workout_session
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    name text NULL,
    notes text NULL,
    CONSTRAINT workout_session_pkey PRIMARY KEY (id),
    CONSTRAINT workout_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
