BEGIN;

-- 73_personal_record_cascading_test_2.sql
-- Purpose: Test that a second exercise with same reps but greater weight updates the PR.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 which is inserted by seed.sql
-- 
-- This test covers:
-- 1. Insert first completed exercise to establish baseline PR
-- 2. Insert second completed exercise with same reps but higher weight
-- 3. Verify PR is updated to the higher weight
SELECT
  plan (2);

-- Test 1: Insert first completed exercise to establish baseline
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

-- Test 2: Verify first PR was created correctly
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
    'First completed exercise sets 1-rep PR to 185 lbs'
  );

-- Test 3: Insert second exercise with same reps but higher weight
SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 205::numeric,
    p_reps => 1::integer,
    p_actual_weight_value => 205::numeric,
    p_performed_at => '2023-01-02T10:00:00Z'::timestamptz
  );

-- Test 4: Verify PR was updated to higher weight
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
    'Second exercise with higher weight updates 1-rep PR to 205 lbs'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
