BEGIN;

SELECT
  plan (4);

-- Test user and exercise setup is handled by seed.sql. Only add setup here if not covered by seed data.
-- 0. Assert there is no target_max_value for barbell_bench_press for user 2
SELECT
  is (
    (
      SELECT
        target_max_value
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    ),
    NULL,
    'No target_max_value for barbell_bench_press for user 2 before update'
  );

-- 1. Call update_user_target_max to set a target max for barbell_bench_press
SELECT
  public.update_user_target_max (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    180,
    'pounds'
  );

-- 2. Check that the target_max_value and target_max_unit are set correctly
SELECT
  ok (
    (
      SELECT
        target_max_value = 180
        AND target_max_unit = 'pounds'
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    ),
    'target_max_value/unit set to 180 pounds'
  );

-- 3. Call update_user_target_max again to update the target max
SELECT
  public.update_user_target_max (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    200,
    'pounds'
  );

-- 4. Check that the target_max_value and target_max_unit are updated
SELECT
  ok (
    (
      SELECT
        target_max_value = 200
        AND target_max_unit = 'pounds'
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    ),
    'target_max_value/unit updated to 200 pounds'
  );

-- 5. Check that only one user_exercise_weights row exists for this user/exercise
SELECT
  is (
    (
      SELECT
        COUNT(*)
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    )::int,
    1,
    'Only one user_exercise_weights row exists for user/exercise'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
