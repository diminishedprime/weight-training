-- Create exercise_block table
CREATE TABLE IF NOT EXISTS public.exercise_block
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    exercise_group_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    block_order integer,
    workout_session_id uuid NULL,
    CONSTRAINT exercise_block_exercises_pkey PRIMARY KEY (id),
    CONSTRAINT fk_exercise_group FOREIGN KEY (exercise_group_id) REFERENCES public.exercise_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_exercise FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE,
    CONSTRAINT exercise_block_workout_session_id_fkey FOREIGN KEY (workout_session_id) REFERENCES public.workout_session(id) ON DELETE SET NULL,
    CONSTRAINT exercise_block_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);
