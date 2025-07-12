BEGIN;

-- 72_personal_record_trigger_test.sql
-- Purpose: Test the trigger that updates personal_record when a new completed exercise is inserted.
-- This test covers:
-- 1. No personal record exists initially
-- 2. Inserting a completed exercise sets the personal record
-- 3. Inserting a newer, smaller completed exercise does not change the record
-- 4. Inserting a newer, larger not-completed exercise does not change the record
-- 5. Updating that row to completed updates the record
SELECT
  plan (6);

-- Setup test user and exercise type
-- (no \set, use explicit values)
-- Test user: 00000000-0000-0000-0000-000000000004
-- Test exercise: barbell_bench_press
-- 1. No personal record exists initially
SELECT
  is (
    (
      SELECT
        value
      FROM
        public.get_personal_record (
          '00000000-0000-0000-0000-000000000004',
          'barbell_bench_press'
        )
    ),
    NULL,
    'No personal record exists initially'
  );

SELECT
  'Insert 200 completed' AS log,
  public.create_exercise (
    '00000000-0000-0000-0000-000000000004',
    'barbell_bench_press',
    'barbell',
    200,
    200,
    1,
    'pounds',
    '2023-01-01T10:00:00Z',
    false,
    false,
    'completed',
    NULL,
    NULL
  );

SELECT
  is (
    (
      SELECT
        value
      FROM
        public.get_personal_record (
          '00000000-0000-0000-0000-000000000004',
          'barbell_bench_press'
        )
    ),
    200::numeric,
    'Completed exercise sets personal record to 200'
  );

SELECT
  isnt (
    (
      SELECT
        exercise_id
      FROM
        public.get_personal_record (
          '00000000-0000-0000-0000-000000000004',
          'barbell_bench_press'
        )
    ),
    NULL,
    'Completed exercise sets personal record returns non-null exercise_id'
  );

SELECT
  'Insert 180 completed' AS log,
  public.create_exercise (
    '00000000-0000-0000-0000-000000000004',
    'barbell_bench_press',
    'barbell',
    180,
    180,
    1,
    'pounds',
    '2023-01-01T10:01:00Z',
    false,
    false,
    'completed',
    NULL,
    NULL
  );

SELECT
  is (
    (
      SELECT
        value
      FROM
        public.get_personal_record (
          '00000000-0000-0000-0000-000000000004',
          'barbell_bench_press'
        )
    ),
    200::numeric,
    'Newer, smaller completed exercise does not change record'
  );

-- Insert the 250 not_completed row and capture its id
-- Insert the 250 not_completed row
SELECT
  public.create_exercise (
    '00000000-0000-0000-0000-000000000004',
    'barbell_bench_press',
    'barbell',
    250,
    250,
    1,
    'pounds',
    '2023-01-01T10:02:00Z',
    false,
    false,
    'not_completed',
    NULL,
    NULL
  );

-- Now update using the stored proc, selecting the id by performed_at
SELECT
  public.update_exercise_for_user (
    (
      SELECT
        id
      FROM
        public.exercises
      WHERE
        user_id = '00000000-0000-0000-0000-000000000004'
        AND exercise_type = 'barbell_bench_press'
        AND weight_value = 250
        AND performed_at = '2023-01-01T10:02:00Z'
    ),
    '00000000-0000-0000-0000-000000000004',
    'barbell_bench_press',
    250,
    250,
    1,
    'pounds',
    '2023-01-01T10:02:00Z',
    false,
    false,
    'completed',
    NULL,
    NULL
  );

-- Show updated exercise for verification
SELECT
  *
FROM
  public.exercises
WHERE
  id = (
    SELECT
      id
    FROM
      public.exercises
    WHERE
      user_id = '00000000-0000-0000-0000-000000000004'
      AND exercise_type = 'barbell_bench_press'
      AND weight_value = 250
      AND performed_at = '2023-01-01T10:02:00Z'
  );

SELECT
  is (
    (
      SELECT
        value
      FROM
        public.get_personal_record (
          '00000000-0000-0000-0000-000000000004',
          'barbell_bench_press'
        )
    ),
    250::numeric,
    'Updating to completed updates personal record to 250'
  );

SELECT
  is (
    (
      SELECT
        exercise_id
      FROM
        public.get_personal_record (
          '00000000-0000-0000-0000-000000000004',
          'barbell_bench_press'
        )
    ),
    (
      SELECT
        id
      FROM
        public.exercises
      WHERE
        user_id = '00000000-0000-0000-0000-000000000004'
        AND exercise_type = 'barbell_bench_press'
        AND weight_value = 250
        AND performed_at = '2023-01-01T10:02:00Z'
    ),
    'Updating to completed sets personal record exercise_id to the new exercise'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
