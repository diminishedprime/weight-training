BEGIN;

-- 73_personal_record_cascading_test_3.sql
-- Purpose: Test that a second exercise with same reps but lower weight does NOT update the PR.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 which is inserted by seed.sql
-- 
-- This test covers:
-- 1. Insert first completed exercise to establish baseline PR
-- 2. Insert second completed exercise with same reps but lower weight
-- 3. Verify PR remains at the higher weight (not updated)
SELECT
  plan (2);

-- Test 1: Insert first completed exercise to establish baseline
SELECT
  public.create_exercise (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    'barbell_bench_press'::exercise_type_enum,
    'barbell'::equipment_type_enum,
    185::numeric,
    185::numeric,
    1::integer,
    'pounds'::weight_unit_enum,
    '2023-01-01T10:00:00Z'::timestamptz,
    false::boolean,
    false::boolean,
    'completed'::completion_status_enum,
    NULL::relative_effort_enum,
    NULL::text
  );

-- Test 2: Verify first PR was created correctly
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

-- Test 3: Insert second exercise with same reps but lower weight
SELECT
  public.create_exercise (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    'barbell_bench_press'::exercise_type_enum,
    'barbell'::equipment_type_enum,
    165::numeric,
    165::numeric,
    1::integer,
    'pounds'::weight_unit_enum,
    '2023-01-02T10:00:00Z'::timestamptz,
    false::boolean,
    false::boolean,
    'completed'::completion_status_enum,
    NULL::relative_effort_enum,
    NULL::text
  );

-- Test 4: Verify PR was NOT updated (remains at original higher weight)
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
    'Second exercise with lower weight does NOT update 1-rep PR (remains 185 lbs)'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
