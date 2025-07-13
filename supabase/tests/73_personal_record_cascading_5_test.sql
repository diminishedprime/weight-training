BEGIN;

-- 73_personal_record_cascading_test_5.sql
-- Purpose: Test that a higher weight 2-rep exercise updates both 1-rep and 2-rep PRs.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 which is inserted by seed.sql
-- 
-- This test covers:
-- 1. Insert first exercise with 1 rep to establish baseline PR
-- 2. Insert second exercise with 2 reps at higher weight
-- 3. Verify both 1-rep and 2-rep PRs are updated to the higher weight
SELECT
  plan (3);

-- Test 1: Insert first exercise with 1 rep to establish baseline
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

-- Test 2: Verify initial 1-rep PR was created
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
    'Initial 1-rep PR created at 185 lbs'
  );

-- Test 3: Insert second exercise with 2 reps at higher weight
SELECT
  public.create_exercise (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    'barbell_bench_press'::exercise_type_enum,
    'barbell'::equipment_type_enum,
    205::numeric,
    205::numeric,
    2::integer,
    'pounds'::weight_unit_enum,
    '2023-01-02T10:00:00Z'::timestamptz,
    false::boolean,
    false::boolean,
    'completed'::completion_status_enum,
    NULL::relative_effort_enum,
    NULL::text
  );

-- Test 4: Verify 1-rep PR was updated to higher weight
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
    205::numeric,
    '1-rep PR updated to 205 lbs from 2-rep exercise'
  );

-- Test 5: Verify 2-rep PR was created at higher weight
SELECT
  is (
    (
      SELECT
        value
      FROM
        public.get_personal_records_for_exercise_type (
          'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          'barbell_bench_press'::exercise_type_enum,
          2
        )
      LIMIT
        1
    ),
    205::numeric,
    '2-rep PR created at 205 lbs'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
