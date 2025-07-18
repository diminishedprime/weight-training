BEGIN;

-- 73_personal_record_cascading_test_4.sql
-- Purpose: Test that updating an exercise to completed with an actual_weight_value sets the PR.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 which is inserted by seed.sql
-- 
-- This test covers:
-- 1. Insert exercise without actual_weight_value and not completed (should not set PR)
-- 2. Verify no PR is set
-- 3. Update exercise to completed and set actual_weight_value
-- 4. Verify PR is set
SELECT
  plan (2);

-- Test 1: Insert exercise without actual_weight_value and not completed
SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 200::numeric,
    p_reps => 1::integer,
    p_performed_at => '2023-01-01T10:00:00Z'::timestamptz,
    p_completion_status => 'not_completed'::completion_status_enum
  );

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
    NULL,
    'No PR set before completion and actual_weight_value'
  );

SELECT
  public.update_exercise_for_user (
    p_exercise_id => (
      SELECT
        id
      FROM
        public.exercises
      WHERE
        user_id = 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid
        AND exercise_type = 'barbell_bench_press'::exercise_type_enum
        AND performed_at = '2023-01-01T10:00:00Z'::timestamptz
      LIMIT
        1
    ),
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_target_weight_value => 200::numeric,
    p_actual_weight_value => 205::numeric,
    p_reps => 1::integer,
    p_performed_at => '2023-01-01T10:00:00Z'::timestamptz,
    p_completion_status => 'completed'::completion_status_enum
  );

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
    'PR set after completion and actual_weight_value update'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
