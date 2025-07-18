BEGIN;

-- 73_personal_record_cascading_7_test.sql
-- Purpose: Test that a 5-rep PR sets PRs for 1, 2, 3, 4, and 5 if higher than existing.
-- User: aaaaaaaa-bbbb-cccc-dddd-000000000001 (from seed.sql)
--
-- This test covers:
-- 1. Ensuring no PRs exist for 1-5 reps initially
-- 2. Inserting a completed 5-rep exercise at 150 lbs
-- 3. Verifying that PRs for 1, 2, 3, 4, and 5 reps are all set to 150
SELECT
  plan (10);

-- Ensure no PRs exist for 1-5 reps (explicit checks, no loop)
SELECT
  is (
    (
      SELECT
        count(*)
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 1::integer
        )
    ),
    0::bigint,
    'No 1-rep PR exists initially'
  );

SELECT
  is (
    (
      SELECT
        count(*)
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 2::integer
        )
    ),
    0::bigint,
    'No 2-rep PR exists initially'
  );

SELECT
  is (
    (
      SELECT
        count(*)
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 3::integer
        )
    ),
    0::bigint,
    'No 3-rep PR exists initially'
  );

SELECT
  is (
    (
      SELECT
        count(*)
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 4::integer
        )
    ),
    0::bigint,
    'No 4-rep PR exists initially'
  );

SELECT
  is (
    (
      SELECT
        count(*)
      FROM
        public.get_personal_records_for_exercise_type (
          p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
          p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
          p_reps => 5::integer
        )
    ),
    0::bigint,
    'No 5-rep PR exists initially'
  );

-- Insert a 5-rep completed exercise at 150 lbs
SELECT
  public.create_exercise (
    p_user_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_exercise_type => 'barbell_bench_press'::exercise_type_enum,
    p_equipment_type => 'barbell'::equipment_type_enum,
    p_target_weight_value => 149::numeric,
    p_reps => 5::integer,
    p_actual_weight_value => 150::numeric,
    p_performed_at => '2023-01-01T10:00:00Z'::timestamptz
  );

-- Check PRs for 1-5 reps (named args)
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
    150::numeric,
    '1-rep PR set to 150 from 5-rep set'
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
    150::numeric,
    '2-rep PR set to 150 from 5-rep set'
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
    150::numeric,
    '3-rep PR set to 150 from 5-rep set'
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
    150::numeric,
    '4-rep PR set to 150 from 5-rep set'
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
          p_reps => 5::integer
        )
      LIMIT
        1
    ),
    150::numeric,
    '5-rep PR set to 150 from 5-rep set'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
