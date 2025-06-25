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
  weight_id_1rm uuid;
  weight_id_target uuid;
BEGIN
  FOR ex_type IN SELECT unnest(enum_range(NULL::public.exercise_type_enum)) LOOP
    -- Use get_weight function for 1RM and target max
    weight_id_1rm := public.get_weight(base_weight + (i * 0.1), 'pounds');
    weight_id_target := public.get_weight(base_weight + (i * 0.1) + 10, 'pounds');

    INSERT INTO public.user_exercise_weights (user_id, exercise_type, one_rep_max_weight_id, target_max_weight_id, default_rest_time_seconds)
      VALUES (v_user_id, ex_type, weight_id_1rm, weight_id_target, 120)
      ON CONFLICT (user_id, exercise_type) DO UPDATE
        SET one_rep_max_weight_id = EXCLUDED.one_rep_max_weight_id,
            target_max_weight_id = EXCLUDED.target_max_weight_id,
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
  weight_id_hist uuid;
  hist_time timestamptz;
BEGIN
  FOR ex_type IN SELECT unnest(enum_range(NULL::public.exercise_type_enum)) LOOP
    FOR j IN 0..9 LOOP
      weight_id_hist := public.get_weight(base_weight + (i * 1.0) + j, 'pounds');
      hist_time := NOW() - INTERVAL '1 day' * (10 - j); -- older first, most recent last
      INSERT INTO public.user_one_rep_max_history (user_id, exercise_type, weight_id, recorded_at, source, notes)
        VALUES (v_user_id, ex_type, weight_id_hist, hist_time, 'manual', 'Seeded history ' || (j+1) || ' for ' || ex_type)
        ON CONFLICT DO NOTHING;
    END LOOP;
    i := i + 1;
  END LOOP;
END$$;
