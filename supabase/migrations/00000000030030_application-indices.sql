-- TODO: see if I can actually come up with a good way to do some performance
--       testing to see which (and if?) of these indices are actually helping.
--
-- This file has all the application indices that are needed for the database.
CREATE INDEX IF NOT EXISTS idx_personal_record_history_exercise_id ON public.personal_record_history (exercise_id);

CREATE INDEX IF NOT EXISTS idx_personal_record_history_user_exercise_reps_timeframe ON public.personal_record_history (
  user_id,
  exercise_type,
  reps,
  recorded_at DESC,
  id DESC
);

CREATE INDEX IF NOT EXISTS idx_personal_record_history_user_exercise_type ON public.personal_record_history (user_id, exercise_type);

CREATE INDEX IF NOT EXISTS idx_personal_record_history_user_exercise_type_reps ON public.personal_record_history (user_id, exercise_type, reps);

CREATE INDEX IF NOT EXISTS idx_target_max_history_user_exercise_recorded_at ON public.target_max_history (user_id, exercise_type, recorded_at DESC, id DESC);

-- This index is to optimize lookups and upserts for form drafts by user and page
CREATE INDEX IF NOT EXISTS idx_form_drafts_user_page_path ON public.form_drafts (user_id, page_path);

CREATE INDEX IF NOT EXISTS idx_form_drafts_expires_at ON public.form_drafts (expires_at);

-- This index is to optimize the sub-selects in the get_exercise_blocks_for_user
-- function
CREATE INDEX IF NOT EXISTS idx_exercise_block_exercises_blockid_exerciseid_order ON exercise_block_exercises (block_id, exercise_id, exercise_order);

-- This index is to optimize queries in get_exercises_by_type for filtering and ordering
-- by user_id, exercise_type, performed_at DESC, and id DESC on the exercises table
CREATE INDEX IF NOT EXISTS idx_exercises_user_type_performedat_id_desc ON public.exercises (
  user_id,
  exercise_type,
  performed_at DESC,
  id DESC
);
