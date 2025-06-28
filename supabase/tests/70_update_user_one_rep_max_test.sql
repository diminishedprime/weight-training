BEGIN;

SELECT
  plan (4);

-- Test user and exercise setup is handled by seed.sql. Only add setup here if not covered by seed data.
-- 0. Assert there is no one_rep_max_value for barbell_bench_press for user 2
SELECT
  is (
    (
      SELECT
        one_rep_max_value
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    ),
    NULL,
    'No one_rep_max_value for barbell_bench_press for user 2 before update'
  );

-- 1. Call update_user_one_rep_max to set a 1RM for barbell_bench_press
SELECT
  public.update_user_one_rep_max (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    225,
    'pounds',
    'manual',
    NULL,
    '2024-01-01T00:00:00Z'
  );

-- 2. Check that the one_rep_max_value and one_rep_max_unit are set correctly
SELECT
  ok (
    (
      SELECT
        one_rep_max_value = 225
        AND one_rep_max_unit = 'pounds'
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    ),
    'one_rep_max_value/unit set to 225 pounds'
  );

-- 3. Call update_user_one_rep_max again to update the 1RM
SELECT
  public.update_user_one_rep_max (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    250,
    'pounds',
    'manual',
    NULL,
    '2024-01-01T00:01:00Z'
  );

-- 4. Check that the one_rep_max_value and one_rep_max_unit are updated
SELECT
  ok (
    (
      SELECT
        one_rep_max_value = 250
        AND one_rep_max_unit = 'pounds'
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    ),
    'one_rep_max_value/unit updated to 250 pounds'
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
