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

-- User for one-rep-max specific tests
INSERT INTO
  next_auth.users (id, name, email, "emailVerified", image)
VALUES
  (
    '00000000-0000-0000-0000-000000000004',
    'ORM Test User',
    'ormtest@example.com',
    NOW(),
    'https://example.com/avatar4.png'
  )
ON CONFLICT (id) DO NOTHING;
