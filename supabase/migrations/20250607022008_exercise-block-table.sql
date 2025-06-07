-- Create exercise_block table
CREATE TABLE IF NOT EXISTS public.exercise_block
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    lift_group_id uuid NOT NULL,
    lift_id uuid NOT NULL,
    block_order integer,
    workout_session_id uuid NULL,
    CONSTRAINT exercise_block_lifts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_lift_group FOREIGN KEY (lift_group_id) REFERENCES public.lift_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_lift FOREIGN KEY (lift_id) REFERENCES public.lifts(id) ON DELETE CASCADE,
    CONSTRAINT exercise_block_workout_session_id_fkey FOREIGN KEY (workout_session_id) REFERENCES public.workout_session(id) ON DELETE SET NULL,
    CONSTRAINT exercise_block_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
