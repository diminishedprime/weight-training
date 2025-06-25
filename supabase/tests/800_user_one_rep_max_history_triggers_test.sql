-- Test: 800_user_one_rep_max_history_triggers_test.sql
-- Purpose: Test triggers on user_one_rep_max_history (insert, update, delete) ensure user_exercise_weights.one_rep_max_weight_id stays in sync.
BEGIN;

SELECT
  plan (5);

-- Step 0: Precondition - canonical 1RM is not already 100 pounds before insert.
SELECT
  ok (
    NOT EXISTS (
      SELECT
        1
      FROM
        public.user_exercise_weights uew
        JOIN public.weights w ON w.id = uew.one_rep_max_weight_id
      WHERE
        uew.user_id = '00000000-0000-0000-0000-000000000002'
        AND uew.exercise_type = 'barbell_bench_press'
        AND w.weight_value = 100
        AND w.weight_unit = 'pounds'
    ),
    'Precondition: canonical 1RM is not already 100 pounds before insert.'
  );

-- Step 1: Insert a 1RM history row for user 2 and barbell_bench_press.  
--
-- This should create a new user_one_rep_max_history row and the trigger should
-- update user_exercise_weights.one_rep_max_weight_id to point to the new weight
-- (100 pounds)
SELECT
  public.update_user_one_rep_max_and_log (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    100,
    'pounds'
  );

-- Step 2: Confirm that the trigger set
-- user_exercise_weights.one_rep_max_weight_id to 100 pounds.
--
-- This checks that after inserting a new 1RM, the canonical 1RM for the
-- user/exercise is correct.
SELECT
  ok (
    (
      SELECT
        w.weight_value = 100
        AND w.weight_unit = 'pounds'
      FROM
        public.user_exercise_weights uew
        JOIN public.weights w ON w.id = uew.one_rep_max_weight_id
      WHERE
        uew.user_id = '00000000-0000-0000-0000-000000000002'
        AND uew.exercise_type = 'barbell_bench_press'
    ),
    'After insert: one_rep_max_weight_id points to 100 pounds'
  );

-- Step 3: Insert a newer 1RM history row (120 pounds).
--
-- The trigger should update user_exercise_weights.one_rep_max_weight_id to
-- point to the most recent (newest) 1RM (120 pounds).
SELECT
  public.update_user_one_rep_max_and_log (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    120,
    'pounds'
  );

-- Step 4: Confirm that the trigger updated
-- user_exercise_weights.one_rep_max_weight_id to 120 pounds.
--
-- This checks that the canonical 1RM is always the most recent entry in the
-- history.
SELECT
  ok (
    (
      SELECT
        w.weight_value = 120
        AND w.weight_unit = 'pounds'
      FROM
        public.user_exercise_weights uew
        JOIN public.weights w ON w.id = uew.one_rep_max_weight_id
      WHERE
        uew.user_id = '00000000-0000-0000-0000-000000000002'
        AND uew.exercise_type = 'barbell_bench_press'
    ),
    'After insert (newer): one_rep_max_weight_id points to 120 pounds'
  );

-- Step 5: Update the older history row (100 pounds) to have a more recent
-- timestamp than the 120 pounds row.
--
-- The trigger should update user_exercise_weights.one_rep_max_weight_id to
-- point back to 100 pounds, since it is now the most recent.
UPDATE public.user_one_rep_max_history
SET
  recorded_at = timezone ('utc', now()) + interval '1 minute'
WHERE
  user_id = '00000000-0000-0000-0000-000000000002'
  AND weight_id = (
    SELECT
      id
    FROM
      public.weights
    WHERE
      weight_value = 100
      AND weight_unit = 'pounds'
  );

-- Step 6: Confirm that the trigger updated
-- user_exercise_weights.one_rep_max_weight_id to 100 pounds (now most recent).
SELECT
  ok (
    (
      SELECT
        w.weight_value = 100
        AND w.weight_unit = 'pounds'
      FROM
        public.user_exercise_weights uew
        JOIN public.weights w ON w.id = uew.one_rep_max_weight_id
      WHERE
        uew.user_id = '00000000-0000-0000-0000-000000000002'
        AND uew.exercise_type = 'barbell_bench_press'
    ),
    'After update: one_rep_max_weight_id points to 100 pounds (now most recent)'
  );

-- Step 7: Delete the most recent history row (100 pounds).
--
-- The trigger should revert user_exercise_weights.one_rep_max_weight_id to the
-- next most recent (120 pounds).
DELETE FROM public.user_one_rep_max_history
WHERE
  user_id = '00000000-0000-0000-0000-000000000002'
  AND weight_id = (
    SELECT
      id
    FROM
      public.weights
    WHERE
      weight_value = 100
      AND weight_unit = 'pounds'
  );

-- Step 8: Confirm that the trigger reverted
-- user_exercise_weights.one_rep_max_weight_id to 120 pounds (now most recent).
SELECT
  ok (
    (
      SELECT
        w.weight_value = 120
        AND w.weight_unit = 'pounds'
      FROM
        public.user_exercise_weights uew
        JOIN public.weights w ON w.id = uew.one_rep_max_weight_id
      WHERE
        uew.user_id = '00000000-0000-0000-0000-000000000002'
        AND uew.exercise_type = 'barbell_bench_press'
    ),
    'After delete: one_rep_max_weight_id points to 120 pounds (now most recent)'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
