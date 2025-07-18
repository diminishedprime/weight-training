BEGIN;

-- 73_personal_record_cascading_test_1.sql
-- Purpose: Test the basic personal record insertion for a new user/exercise.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 which is inserted by seed.sql
-- 
-- This test covers the simplest case:
-- 1. User has no existing PRs for an exercise type
-- 2. Insert a completed exercise 
-- 3. Verify it creates the PR correctly
SELECT
  plan (2);

-- Test 1: No personal record exists initially
SELECT
  is (
    (
      SELECT
        count(*)
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 1
        )
    ),
    0::bigint,
    'No 1-rep PR exists initially for new user'
  );

-- Test 2: Insert first completed exercise
SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 185::numeric,
    p_reps => 1::integer,
    p_actual_weight_value => 185::numeric,
    p_performed_at => '2023-01-01T10:00:00Z'::timestamptz
  );

-- Test 3: Verify PR was created with correct weight
SELECT
  is (
    (
      SELECT
        value
      FROM
        public.get_personal_records_for_exercise_type (
          'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          'barbell_bench_press'::exercise_type_enum,
          1
        )
      LIMIT
        1
    ),
    185::numeric,
    'First completed exercise sets 1-rep PR to 185 lbs'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
