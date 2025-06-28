-- Example seed user for testing
INSERT INTO
  next_auth.users (id, name, email, "emailVerified", image)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Test User',
    'testuser@example.com',
    NOW(),
    'https://example.com/avatar.png'
  )
ON CONFLICT (id) DO NOTHING;

-- Additional seed user for update_user_one_rep_max tests
INSERT INTO
  next_auth.users (id, name, email, "emailVerified", image)
VALUES
  (
    '00000000-0000-0000-0000-000000000002',
    '1RM Test User',
    'one_rep_max_test@example.com',
    NOW(),
    'https://example.com/avatar2.png'
  )
ON CONFLICT (id) DO NOTHING;

-- Fully seeded user for integration/analytics tests
INSERT INTO
  next_auth.users (id, name, email, "emailVerified", image)
VALUES
  (
    '00000000-0000-0000-0000-000000000003',
    'Fully Seeded User',
    'fullyseeded@example.com',
    NOW(),
    'https://example.com/avatar3.png'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert preferences (one_rep_max and target_max) for every exercise_type for the fully seeded user
DO $$
DECLARE
  ex_type public.exercise_type_enum;
  i integer := 0;
  base_weight numeric := 100.0;
  v_user_id uuid := '00000000-0000-0000-0000-000000000003';
  one_rep_max_value numeric;
  target_max_value numeric;
BEGIN
  FOR ex_type IN SELECT unnest(enum_range(NULL::public.exercise_type_enum)) LOOP
    one_rep_max_value := base_weight + (i * 0.1);
    target_max_value := base_weight + (i * 0.1) + 10;
    INSERT INTO public.user_exercise_weights (user_id, exercise_type, one_rep_max_value, one_rep_max_unit, target_max_value, target_max_unit, default_rest_time_seconds)
      VALUES (v_user_id, ex_type, one_rep_max_value, 'pounds', target_max_value, 'pounds', 120)
      ON CONFLICT (user_id, exercise_type) DO UPDATE
        SET one_rep_max_value = EXCLUDED.one_rep_max_value,
            one_rep_max_unit = EXCLUDED.one_rep_max_unit,
            target_max_value = EXCLUDED.target_max_value,
            target_max_unit = EXCLUDED.target_max_unit,
            default_rest_time_seconds = EXCLUDED.default_rest_time_seconds;
    i := i + 1;
  END LOOP;
END$$;

-- Insert 1RM history for each exercise_type for the fully seeded user (10 rows per exercise)
DO $$
DECLARE
  ex_type public.exercise_type_enum;
  i integer := 0;
  j integer;
  base_weight numeric := 100.0;
  v_user_id uuid := '00000000-0000-0000-0000-000000000003';
  hist_value numeric;
  hist_time timestamptz;
BEGIN
  FOR ex_type IN SELECT unnest(enum_range(NULL::public.exercise_type_enum)) LOOP
    FOR j IN 0..9 LOOP
      hist_value := base_weight + (i * 1.0) + j;
      hist_time := NOW() - INTERVAL '1 day' * (10 - j); -- older first, most recent last
      INSERT INTO public.user_one_rep_max_history (user_id, exercise_type, weight_value, weight_unit, recorded_at, source, notes)
        VALUES (v_user_id, ex_type, hist_value, 'pounds', hist_time, 'manual', 'Seeded history ' || (j+1) || ' for ' || ex_type)
        ON CONFLICT DO NOTHING;
    END LOOP;
    i := i + 1;
  END LOOP;
END$$;
