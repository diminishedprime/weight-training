BEGIN;

-- 73_personal_record_cascading_test_6.sql
-- Purpose: Test complex PR cascading scenarios with different rep counts and weights.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 which is inserted by seed.sql
-- 
-- This test covers:
-- 1. Insert 2-rep exercise at 100lbs (should set PRs for both 1-rep and 2-rep)
-- 2. Insert 1-rep exercise at 125lbs (should only update 1-rep PR)
-- 3. Insert 2-rep exercise at 110lbs (should only update 2-rep PR)
SELECT
  plan (6);

-- Test 1: Insert first exercise with 2 reps at 100lbs
SELECT
  public.create_exercise (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    'barbell_bench_press'::exercise_type_enum,
    'barbell'::equipment_type_enum,
    100::numeric,
    100::numeric,
    2::integer,
    'pounds'::weight_unit_enum,
    '2023-01-01T10:00:00Z'::timestamptz,
    false::boolean,
    false::boolean,
    'completed'::completion_status_enum,
    NULL::relative_effort_enum,
    NULL::text
  );

-- Test 2: Verify 1-rep PR was set from 2-rep exercise at 100lbs
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
    100::numeric,
    '1-rep PR set to 100 lbs from initial 2-rep exercise'
  );

-- Test 3: Verify 2-rep PR was set at 100lbs
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
    100::numeric,
    '2-rep PR set to 100 lbs from initial exercise'
  );

-- Test 4: Insert second exercise with 1 rep at 125lbs
SELECT
  public.create_exercise (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    'barbell_bench_press'::exercise_type_enum,
    'barbell'::equipment_type_enum,
    125::numeric,
    125::numeric,
    1::integer,
    'pounds'::weight_unit_enum,
    '2023-01-02T10:00:00Z'::timestamptz,
    false::boolean,
    false::boolean,
    'completed'::completion_status_enum,
    NULL::relative_effort_enum,
    NULL::text
  );

-- Test 5: Verify 1-rep PR was updated to 125lbs
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
    125::numeric,
    '1-rep PR updated to 125 lbs from 1-rep exercise'
  );

-- Test 6: Verify 2-rep PR remains at 100lbs (not updated by 1-rep exercise)
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
    100::numeric,
    '2-rep PR remains at 100 lbs (not updated by 1-rep exercise)'
  );

-- Test 7: Insert third exercise with 2 reps at 110lbs
SELECT
  public.create_exercise (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    'barbell_bench_press'::exercise_type_enum,
    'barbell'::equipment_type_enum,
    110::numeric,
    110::numeric,
    2::integer,
    'pounds'::weight_unit_enum,
    '2023-01-03T10:00:00Z'::timestamptz,
    false::boolean,
    false::boolean,
    'completed'::completion_status_enum,
    NULL::relative_effort_enum,
    NULL::text
  );

-- Test 8: Verify 1-rep PR remains at 125lbs (not updated by lower weight 2-rep exercise)
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
    125::numeric,
    '1-rep PR remains at 125 lbs (not updated by lower weight 2-rep exercise)'
  );

-- Test 9: Verify 2-rep PR was updated to 110lbs
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
    110::numeric,
    '2-rep PR updated to 110 lbs from third exercise'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
