BEGIN;
SELECT plan(3);

-- Test user and exercise setup is handled by seed.sql. Only add setup here if not covered by seed data.

-- 0. Assert there is no custom default_rest_time_seconds for barbell_bench_press for user 2 (should be default 120)
SELECT is(
  (SELECT default_rest_time_seconds FROM public.user_exercise_weights WHERE user_id = '00000000-0000-0000-0000-000000000002' AND exercise_type = 'barbell_bench_press'),
  120,
  'default_rest_time_seconds is 120 for barbell_bench_press for user 2 before update'
);

-- 1. Call update_user_default_rest_time to set a custom rest time
SELECT public.update_user_default_rest_time('00000000-0000-0000-0000-000000000002', 'barbell_bench_press', 180);

-- 2. Check that the default_rest_time_seconds is updated to 180
SELECT is(
  (SELECT default_rest_time_seconds FROM public.user_exercise_weights WHERE user_id = '00000000-0000-0000-0000-000000000002' AND exercise_type = 'barbell_bench_press'),
  180,
  'default_rest_time_seconds updated to 180 for barbell_bench_press for user 2'
);

-- 3. Call update_user_default_rest_time again to set a new value
SELECT public.update_user_default_rest_time('00000000-0000-0000-0000-000000000002', 'barbell_bench_press', 90);

-- 4. Check that the default_rest_time_seconds is updated to 90
SELECT is(
  (SELECT default_rest_time_seconds FROM public.user_exercise_weights WHERE user_id = '00000000-0000-0000-0000-000000000002' AND exercise_type = 'barbell_bench_press'),
  90,
  'default_rest_time_seconds updated to 90 for barbell_bench_press for user 2'
);

SELECT * FROM finish();
ROLLBACK;
