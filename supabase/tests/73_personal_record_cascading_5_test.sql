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
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 184::numeric,
    p_reps => 1::integer,
    p_actual_weight_value => 185::numeric,
    p_performed_at => '2023-01-01T10:00:00Z'::timestamptz
  );

-- Test 2: Verify initial 1-rep PR was created
SELECT
  is (
    (
      SELECT
        weight_value
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
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 204::numeric,
    p_reps => 2::integer,
    p_actual_weight_value => 205::numeric,
    p_performed_at => '2023-01-02T10:00:00Z'::timestamptz
  );

SELECT
  is (
    (
      SELECT
        weight_value
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
        weight_value
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

-- Debug: Show all PR history for this user/exercise
SELECT
  *
FROM
  public.personal_record_history
WHERE
  user_id = 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid
  AND exercise_type = 'barbell_bench_press'::exercise_type_enum
ORDER BY
  reps,
  weight_value,
  recorded_at;

SELECT
  *
FROM
  finish ();

ROLLBACK;
