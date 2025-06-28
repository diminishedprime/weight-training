-- Test: test_create_user_metadata_on_user_insert.sql
-- Purpose: Test that inserting a new user into next_auth.users automatically
--          creates user_metadata and user_exercise_weights rows for all
--          exercise types.
SELECT
  plan (3);

-- Clean up any test user if it exists
DELETE FROM public.user_metadata
WHERE
  user_id = '00000000-0000-0000-0000-000000000001';

DELETE FROM public.user_exercise_weights
WHERE
  user_id = '00000000-0000-0000-0000-000000000001';

DELETE FROM next_auth.users
WHERE
  id = '00000000-0000-0000-0000-000000000001';

-- Insert a new user
INSERT INTO
  next_auth.users (id, email)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'trigger_test@example.com'
  );

-- 1. Check that user_metadata row was created
SELECT
  ok (
    (
      SELECT
        COUNT(*)
      FROM
        public.user_metadata
      WHERE
        user_id = '00000000-0000-0000-0000-000000000001'
    ) = 1,
    'user_metadata row created for new user'
  );

-- 2. Check that user_exercise_weights rows were created for all exercise types
SELECT
  is (
    (
      SELECT
        COUNT(*)
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000001'
    ),
    (
      SELECT
        COUNT(*)
      FROM
        unnest(enum_range(NULL::exercise_type_enum))
    ),
    'user_exercise_weights rows created for all exercise types'
  );

-- 3. Check that all exercise types are present for the user
SELECT
  ok (
    ARRAY(
      SELECT
        exercise_type
      FROM
        public.user_exercise_weights
      WHERE
        user_id = '00000000-0000-0000-0000-000000000001'
      ORDER BY
        exercise_type
    ) = ARRAY(
      SELECT
        unnest(enum_range(NULL::exercise_type_enum))
      ORDER BY
        1
    ),
    'All exercise types present in user_exercise_weights for new user'
  );

-- Clean up after test
DELETE FROM public.user_metadata
WHERE
  user_id = '00000000-0000-0000-0000-000000000001';

DELETE FROM public.user_exercise_weights
WHERE
  user_id = '00000000-0000-0000-0000-000000000001';

DELETE FROM next_auth.users
WHERE
  id = '00000000-0000-0000-0000-000000000001';

SELECT
  *
FROM
  finish ();
