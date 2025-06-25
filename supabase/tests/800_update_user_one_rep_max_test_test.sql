BEGIN;

SELECT
  plan (4);

-- Test user and exercise setup is handled by seed.sql. Only add setup here if not covered by seed data.
-- 0. Assert there is no one_rep_max_weight_id for barbell_bench_press for user 2
SELECT
  is (
    (
      SELECT
        one_rep_max_weight_id
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000002'
        AND exercise_type = 'barbell_bench_press'
    ),
    NULL::uuid,
    'No one_rep_max_weight_id for barbell_bench_press for user 2 before update'
  );

-- 1. Call update_user_one_rep_max to set a 1RM for barbell_bench_press
SELECT
  public.update_user_one_rep_max (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    225,
    'pounds'
  );

-- 2. Check that the one_rep_max_weight_id is set and points to the correct weight
SELECT
  ok (
    (
      SELECT
        w.weight_value = 225
        AND w.weight_unit = 'pounds'
      FROM
        public.user_exercise_weights uew
        JOIN public.weights w ON w.id = uew.one_rep_max_weight_id
      WHERE
        uew.user_id = '00000000-0000-0000-0000-000000000002'
        AND uew.exercise_type = 'barbell_bench_press'
    ),
    'one_rep_max_weight_id set and points to correct weight (225 pounds)'
  );

-- 3. Call update_user_one_rep_max again to update the 1RM
SELECT
  public.update_user_one_rep_max (
    '00000000-0000-0000-0000-000000000002',
    'barbell_bench_press',
    250,
    'pounds'
  );

-- 4. Check that the one_rep_max_weight_id is updated to the new value
SELECT
  ok (
    (
      SELECT
        w.weight_value = 250
        AND w.weight_unit = 'pounds'
      FROM
        public.user_exercise_weights uew
        JOIN public.weights w ON w.id = uew.one_rep_max_weight_id
      WHERE
        uew.user_id = '00000000-0000-0000-0000-000000000002'
        AND uew.exercise_type = 'barbell_bench_press'
    ),
    'one_rep_max_weight_id updated to new value (250 pounds)'
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
