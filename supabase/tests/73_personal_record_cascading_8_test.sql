BEGIN;

-- 73_personal_record_cascading_8_test.sql
-- Purpose: Test that a new 4-rep PR at 90 updates 3-rep PR but not 1 or 2 if they are higher.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 (from seed.sql)
--
-- This test covers:
-- 1. Creating initial PRs for 1 rep (100 lbs), 2 reps (95 lbs), 3 reps (80 lbs), and 4 reps (80 lbs)
-- 2. Verifying that those are the PRs after insertion
-- 3. Inserting a completed 4-rep exercise at 90 lbs
-- 4. Verifying that 3 and 4 rep PRs are updated to 90, but 1- and 2-rep PRs remain unchanged since higher
SELECT
  plan (8);

-- Set up initial PRs for 1-4 reps using create_exercise
SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 99::numeric,
    p_reps => 1::integer,
    p_actual_weight_value => 100::numeric,
    p_performed_at => '2023-01-01T10:00:00Z'::timestamptz
  );

SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 94::numeric,
    p_reps => 2::integer,
    p_actual_weight_value => 95::numeric,
    p_performed_at => '2023-01-01T10:01:00Z'::timestamptz
  );

SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 79::numeric,
    p_reps => 3::integer,
    p_actual_weight_value => 80::numeric,
    p_performed_at => '2023-01-01T10:02:00Z'::timestamptz
  );

SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 79::numeric,
    p_reps => 4::integer,
    p_actual_weight_value => 80::numeric,
    p_performed_at => '2023-01-01T10:03:00Z'::timestamptz
  );

-- Assert initial PRs
SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 1::integer
        )
      LIMIT
        1
    ),
    100::numeric,
    'Initial 1-rep PR is 100'
  );

SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 2::integer
        )
      LIMIT
        1
    ),
    95::numeric,
    'Initial 2-rep PR is 95'
  );

SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 3::integer
        )
      LIMIT
        1
    ),
    80::numeric,
    'Initial 3-rep PR is 80'
  );

SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 4::integer
        )
      LIMIT
        1
    ),
    80::numeric,
    'Initial 4-rep PR is 80'
  );

-- Insert a 4-rep completed exercise at 90 lbs
SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 89::numeric,
    p_reps => 4::integer,
    p_actual_weight_value => 90::numeric,
    p_performed_at => '2023-01-02T10:00:00Z'::timestamptz
  );

-- Check PRs
SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 1::integer
        )
      LIMIT
        1
    ),
    100::numeric,
    '1-rep PR remains 100'
  );

SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 2::integer
        )
      LIMIT
        1
    ),
    95::numeric,
    '2-rep PR remains 95'
  );

SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 3::integer
        )
      LIMIT
        1
    ),
    90::numeric,
    '3-rep PR updated to 90'
  );

SELECT
  is (
    (
      SELECT
        weight_value
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 4::integer
        )
      LIMIT
        1
    ),
    90::numeric,
    '4-rep PR updated to 90'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
