-- Start test seed data.
SELECT
  _system.create_test_user (
    p_email => 'testuser@example.com',
    p_id => '00000000-0000-0000-0000-000000000001'::uuid,
    p_create_preferences => true
  );

-- Additional seed user for update_user_personal_record tests
SELECT
  _system.create_test_user (
    p_email => 'personal_record_test@example.com',
    p_id => '00000000-0000-0000-0000-000000000002'::uuid,
    p_create_preferences => true
  );

-- Fully seeded user for integration/analytics tests
SELECT
  _system.create_test_user (
    p_email => 'fullyseeded@example.com',
    p_id => '00000000-0000-0000-0000-000000000003'::uuid,
    p_create_preferences => true
  );

-- Additional seed user for update_user_personal_record tests
SELECT
  _system.create_test_user (
    p_email => 'user_preferences_test@example.com',
    p_id => '00000000-0000-0000-0000-000000000004'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'personal_record_user_1@example.com',
    p_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'add-custom-barbell-exercise.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000000'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'add-custom-dumbbell-exercise.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000001'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'add-wendler-block.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000002'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'preferences.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000003'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'edit-dumbbell-exercise.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000004'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'add-custom-kettlebell-exercise.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000005'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'add-equipment-exercise/plate-stack.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000006'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'add-equipment-exercise/bodyweight.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000007'::uuid,
    p_create_preferences => true
  );

SELECT
  _system.create_test_user (
    p_email => 'add-program.integration.test.tsx',
    p_id => '00000000-0000-0000-0001-000000000008'::uuid,
    p_create_preferences => true
  );
