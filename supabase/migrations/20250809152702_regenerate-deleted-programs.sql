-- Generated SQL to fix deleted wendler data
-- Only run this migration if the target user exists in the database
DO $$
BEGIN
  -- Check if the user exists before proceeding
  IF EXISTS (SELECT 1 FROM next_auth.users WHERE id = '97097295-6eb1-4824-8bfa-8984cf9bea6b') THEN
    -- User exists, proceed with the migration
    INSERT INTO
      wendler_program (id, user_id, name, program_order, started_at)
    VALUES
      (
        '2a289dad-61d2-4f5c-8c68-a93603c836fb',
        '97097295-6eb1-4824-8bfa-8984cf9bea6b',
        'Wendler Program 1',
        1,
        '2025-05-09 23:46:59.395+00'::timestamptz
      );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'd877b454-0b2e-4585-97b1-eb32560cb608',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'efdb16fa-dcf4-4e2c-9db4-1e8ab95ae323',
    '2a289dad-61d2-4f5c-8c68-a93603c836fb',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '5'::wendler_cycle_type_enum,
    '2025-05-09 23:46:59.395+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '71af2c70-a660-4c06-bab2-e101a8a1d815',
  'efdb16fa-dcf4-4e2c-9db4-1e8ab95ae323',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd877b454-0b2e-4585-97b1-eb32560cb608',
  '2025-05-09 23:46:59.395+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '4ad4debd-aeeb-42d8-b8f3-5aa333fa1399'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '9268acb3-5bf0-461b-9bc6-92ffd65cac1b',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '64230c06-53f8-4478-94e4-ce27e74de800',
  'efdb16fa-dcf4-4e2c-9db4-1e8ab95ae323',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '9268acb3-5bf0-461b-9bc6-92ffd65cac1b',
  '2025-05-11 17:07:14.227+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '601b0b91-34ce-4caf-9b42-6697fe92c91b'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'fc598804-ec82-4f77-9366-a5de10edf015',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'b8d23e7c-9644-4e65-8c37-cd56843410ad',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '4f542f0f-d145-4f92-9f76-9391ab7e35d5',
  'efdb16fa-dcf4-4e2c-9db4-1e8ab95ae323',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'fc598804-ec82-4f77-9366-a5de10edf015',
  '2025-05-13 23:53:17.547+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '737ef810-db6a-4c43-89e5-441a2f7d896e'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '08ddfb47-44ed-4f4c-a7df-9c77aa2b3687',
  'efdb16fa-dcf4-4e2c-9db4-1e8ab95ae323',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'b8d23e7c-9644-4e65-8c37-cd56843410ad',
  '2025-05-13 23:53:17.547+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '737ef810-db6a-4c43-89e5-441a2f7d896e'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'add67ba0-8676-4795-aaa3-2e88aa99da0a',
    '2a289dad-61d2-4f5c-8c68-a93603c836fb',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '3'::wendler_cycle_type_enum,
    '2025-05-19 23:42:43.014+00'::timestamptz,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '3fa02b92-5367-41fa-b90d-5af48855f4e8',
  'add67ba0-8676-4795-aaa3-2e88aa99da0a',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'fc598804-ec82-4f77-9366-a5de10edf015',
  '2025-05-19 23:42:43.014+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'daa03299-f618-4292-935f-863ce53fbde8'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '5e3934ae-0687-42d7-8049-689a979adb5d',
  'add67ba0-8676-4795-aaa3-2e88aa99da0a',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'b8d23e7c-9644-4e65-8c37-cd56843410ad',
  '2025-05-19 23:42:43.014+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'daa03299-f618-4292-935f-863ce53fbde8'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '2275a3a7-1463-4d91-805b-293fe9278231',
  'add67ba0-8676-4795-aaa3-2e88aa99da0a',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '9268acb3-5bf0-461b-9bc6-92ffd65cac1b',
  '2025-05-20 23:54:43.83+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '9488db87-2a85-4d45-9a06-36a4d984b327'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '69a863ae-a88c-45e2-8bc5-032b13678dde',
  'add67ba0-8676-4795-aaa3-2e88aa99da0a',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd877b454-0b2e-4585-97b1-eb32560cb608',
  '2025-05-23 23:51:48.438+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '2b30d5c3-c6b8-46d8-a92b-dc8cfb287c58'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'c5ac92e3-a893-4ac5-90c6-2b5437ebcdaf',
    '2a289dad-61d2-4f5c-8c68-a93603c836fb',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '1'::wendler_cycle_type_enum,
    '2025-05-25 17:42:14.067+00'::timestamptz,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '54204833-2b12-45e6-9efa-71c8f30a9bab',
  'c5ac92e3-a893-4ac5-90c6-2b5437ebcdaf',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '9268acb3-5bf0-461b-9bc6-92ffd65cac1b',
  '2025-05-25 17:42:14.067+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '56c9e538-6162-4855-9f7a-4fe071feea90'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '4f0d907f-1410-414f-bd7a-69ebd2fa14e7',
  'c5ac92e3-a893-4ac5-90c6-2b5437ebcdaf',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'fc598804-ec82-4f77-9366-a5de10edf015',
  '2025-05-27 23:50:50.157+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '23b0b66a-991b-4ad5-b857-d7bd53342c25'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '88ee95a5-37a2-4ac6-98ea-28b5c69142c6',
  'c5ac92e3-a893-4ac5-90c6-2b5437ebcdaf',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'b8d23e7c-9644-4e65-8c37-cd56843410ad',
  '2025-05-27 23:50:50.157+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '23b0b66a-991b-4ad5-b857-d7bd53342c25'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '6fb2b242-d8db-428f-8a03-12da148c4aef',
  'c5ac92e3-a893-4ac5-90c6-2b5437ebcdaf',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd877b454-0b2e-4585-97b1-eb32560cb608',
  '2025-05-30 23:11:40.014+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'd3a4aef0-418b-4e8c-a39b-56104ea34261'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program (id, user_id, name, program_order, started_at)
VALUES
  (
    '5354fbf1-ae95-4fc3-b437-6c0b2ec0071c',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    'Wendler Program 2',
    2,
    '2025-06-01 17:34:07.339+00'::timestamptz
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '4ada52ed-c52e-41e9-96de-0f9460b932fd',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '8c8ccea2-4a39-4c3a-8667-6f677cc512a7',
    '5354fbf1-ae95-4fc3-b437-6c0b2ec0071c',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '5'::wendler_cycle_type_enum,
    '2025-06-01 17:34:07.339+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '1f22dde2-29fb-4fed-b885-336d78eedecd',
  '8c8ccea2-4a39-4c3a-8667-6f677cc512a7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '4ada52ed-c52e-41e9-96de-0f9460b932fd',
  '2025-06-01 17:34:07.339+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'ef8f6eb7-2eef-428d-bce2-9f93ab593f97'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'a9c5e4df-d7fd-45d1-8bd3-c9442ec9cbd9',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '6f17340f-5cae-4c35-83c8-9952e56d7d7c',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'e25e7c6c-0570-4a9e-86cc-a802fd3c1567',
  '8c8ccea2-4a39-4c3a-8667-6f677cc512a7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'a9c5e4df-d7fd-45d1-8bd3-c9442ec9cbd9',
  '2025-06-03 23:42:55.506+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'ff70ff99-39e4-457a-b52c-338142a42d74'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '9cf86327-c489-4e0d-866e-3e085e68bc96',
  '8c8ccea2-4a39-4c3a-8667-6f677cc512a7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '6f17340f-5cae-4c35-83c8-9952e56d7d7c',
  '2025-06-03 23:42:55.506+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'ff70ff99-39e4-457a-b52c-338142a42d74'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'cabaa0ef-3978-4209-9d20-4ecc5428c7df',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a50d3443-18f6-466a-82b8-9140b9f99a43',
  '8c8ccea2-4a39-4c3a-8667-6f677cc512a7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'cabaa0ef-3978-4209-9d20-4ecc5428c7df',
  '2025-06-06 23:54:14.736+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '6313bd0d-0ad3-4cea-b605-f8fdfce83e7d'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'b133653a-1a1a-43af-b1dc-06c5714e0c00',
    '5354fbf1-ae95-4fc3-b437-6c0b2ec0071c',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '3'::wendler_cycle_type_enum,
    '2025-06-08 16:23:55.229+00'::timestamptz,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '79418114-2aa4-4f63-ba20-a42e857a39ee',
  'b133653a-1a1a-43af-b1dc-06c5714e0c00',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '4ada52ed-c52e-41e9-96de-0f9460b932fd',
  '2025-06-08 16:23:55.229+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'bc038860-6b0d-41a5-b182-c06c34793e84'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'fcdfe780-d287-4308-832e-2ac8de71c4b1',
  'b133653a-1a1a-43af-b1dc-06c5714e0c00',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'a9c5e4df-d7fd-45d1-8bd3-c9442ec9cbd9',
  '2025-06-10 23:55:47.622+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '15f67647-b566-47e3-b8d6-c33d48774b7d'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '54bc30eb-2152-4ada-a3be-29aeae30623e',
  'b133653a-1a1a-43af-b1dc-06c5714e0c00',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '6f17340f-5cae-4c35-83c8-9952e56d7d7c',
  '2025-06-10 23:55:47.622+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '15f67647-b566-47e3-b8d6-c33d48774b7d'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '3a47ee99-953b-4492-8379-19c39f2a4080',
  'b133653a-1a1a-43af-b1dc-06c5714e0c00',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'cabaa0ef-3978-4209-9d20-4ecc5428c7df',
  '2025-06-14 16:29:01.905+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '6c29f898-d38e-4d54-81d0-e795e15ba18c'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '291b2548-d47a-4b7c-a649-d6715ee45ac0',
    '5354fbf1-ae95-4fc3-b437-6c0b2ec0071c',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '1'::wendler_cycle_type_enum,
    '2025-06-15 17:27:50.719+00'::timestamptz,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '6e1a3d65-b660-46be-afa5-a6262b470c31',
  '291b2548-d47a-4b7c-a649-d6715ee45ac0',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '4ada52ed-c52e-41e9-96de-0f9460b932fd',
  '2025-06-15 17:27:50.719+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '1ce8e7e8-bee1-40f7-b40c-e52871c1d865'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '09002bbc-7f14-4f36-8f2a-7180dec5c7ae',
  '291b2548-d47a-4b7c-a649-d6715ee45ac0',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'a9c5e4df-d7fd-45d1-8bd3-c9442ec9cbd9',
  '2025-06-17 23:52:53.23+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '17bdfe71-0fe5-4306-8bac-09ec4d5f78af'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '11d92d76-e5c8-44ea-9de8-2af5a776c288',
  '291b2548-d47a-4b7c-a649-d6715ee45ac0',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '6f17340f-5cae-4c35-83c8-9952e56d7d7c',
  '2025-06-17 23:52:53.23+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '17bdfe71-0fe5-4306-8bac-09ec4d5f78af'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a54aa6dd-5968-4a3f-aab6-9409cb3c9894',
  '291b2548-d47a-4b7c-a649-d6715ee45ac0',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'cabaa0ef-3978-4209-9d20-4ecc5428c7df',
  '2025-06-20 23:41:40.798+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'ad921645-86c9-4131-947a-8862574da96c'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '06a886c5-338f-4777-9637-7e1d0033a8f6',
    '5354fbf1-ae95-4fc3-b437-6c0b2ec0071c',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    'deload'::wendler_cycle_type_enum,
    '2025-06-22 16:34:10.207+00'::timestamptz,
    4
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'b3852a53-53a3-4343-b19e-085e3f7a92be',
  '06a886c5-338f-4777-9637-7e1d0033a8f6',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '4ada52ed-c52e-41e9-96de-0f9460b932fd',
  '2025-06-22 16:34:10.207+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'b7cf9fc0-9033-467b-9e70-f679157d49f9'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'b3b4c2b1-87e6-4af9-b3bc-851ed2ff9af8',
  '06a886c5-338f-4777-9637-7e1d0033a8f6',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'a9c5e4df-d7fd-45d1-8bd3-c9442ec9cbd9',
  '2025-06-24 23:41:15.187+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'c072e78a-41d4-40e0-b7db-4aed87b817ea'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'dc7f5fe8-1f2f-4ab0-99b0-3f56d80b594b',
  '06a886c5-338f-4777-9637-7e1d0033a8f6',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '6f17340f-5cae-4c35-83c8-9952e56d7d7c',
  '2025-06-24 23:41:15.187+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'c072e78a-41d4-40e0-b7db-4aed87b817ea'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '82dc5217-74ee-4577-b4a2-ff05610fd923',
  '06a886c5-338f-4777-9637-7e1d0033a8f6',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'cabaa0ef-3978-4209-9d20-4ecc5428c7df',
  '2025-06-28 15:12:53.478+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '341c6717-06da-4596-87fd-dbf5b74cfca6'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program (id, user_id, name, program_order, started_at)
VALUES
  (
    'ab2ef121-3565-475d-bc3d-80121c18b028',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    'Wendler Program 3',
    3,
    '2025-06-29 18:04:48.269+00'::timestamptz
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'bb728eda-998a-4298-badb-be03254c5579',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '383a2e89-b88b-40bf-8c3a-f78edaa32c34',
    'ab2ef121-3565-475d-bc3d-80121c18b028',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '5'::wendler_cycle_type_enum,
    '2025-06-29 18:04:48.269+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '8360903f-a7c3-46ef-a633-ababa3b25433',
  '383a2e89-b88b-40bf-8c3a-f78edaa32c34',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'bb728eda-998a-4298-badb-be03254c5579',
  '2025-06-29 18:04:48.269+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'f7a2f6fb-6142-4fbe-b532-da115778bbfd'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '0e0a276d-7068-47ba-8400-b8a0610254ef',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '0121fcaa-c480-4ed3-a569-eab34e30c47b',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'e3a121cc-88a3-4a33-898e-2f0ab5e2c215',
  '383a2e89-b88b-40bf-8c3a-f78edaa32c34',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '0e0a276d-7068-47ba-8400-b8a0610254ef',
  '2025-07-03 23:31:39.847+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'a6791e61-847b-45c5-a4ee-da904a51c0f5'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '17d21c5f-4fdd-40bd-bd44-339862665005',
  '383a2e89-b88b-40bf-8c3a-f78edaa32c34',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '0121fcaa-c480-4ed3-a569-eab34e30c47b',
  '2025-07-03 23:31:39.847+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'a6791e61-847b-45c5-a4ee-da904a51c0f5'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '3e8976da-85a0-4bc2-a51e-909fca6e8cfc',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a79a653e-1da7-4a2d-91f9-d374a4198373',
  '383a2e89-b88b-40bf-8c3a-f78edaa32c34',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '3e8976da-85a0-4bc2-a51e-909fca6e8cfc',
  '2025-07-10 23:48:56.6+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'f528057d-44b0-4a2b-933c-a503d977e8d5'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '2516ce93-7347-42be-b573-4f25bfda4164',
    'ab2ef121-3565-475d-bc3d-80121c18b028',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '3'::wendler_cycle_type_enum,
    '2025-07-13 23:25:34.762+00'::timestamptz,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'faa94a5f-456b-44ea-bb28-04ff72851922',
  '2516ce93-7347-42be-b573-4f25bfda4164',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'bb728eda-998a-4298-badb-be03254c5579',
  '2025-07-13 23:25:34.762+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '42d69a89-33b7-4c84-96a9-8c2d6637d4b3'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '8309580e-2488-45c8-89cf-d048d3e6ab86',
  '2516ce93-7347-42be-b573-4f25bfda4164',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '0e0a276d-7068-47ba-8400-b8a0610254ef',
  '2025-07-15 23:45:17.397+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '4b972a6a-b8e6-41d3-a3ef-14fada535225'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'e2d5a347-576f-4790-a4da-37c542a3dfef',
  '2516ce93-7347-42be-b573-4f25bfda4164',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '0121fcaa-c480-4ed3-a569-eab34e30c47b',
  '2025-07-15 23:45:17.397+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '4b972a6a-b8e6-41d3-a3ef-14fada535225'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'c5294101-5ad1-4e69-932d-2b47cce0560f',
  '2516ce93-7347-42be-b573-4f25bfda4164',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '3e8976da-85a0-4bc2-a51e-909fca6e8cfc',
  '2025-07-17 23:42:31.725+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '7182d0e7-bc60-4993-bbaf-127f2fca53bb'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '73091ba1-ba3e-492e-b8c9-d4a838d77fe7',
    'ab2ef121-3565-475d-bc3d-80121c18b028',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '1'::wendler_cycle_type_enum,
    '2025-07-20 15:48:46.545+00'::timestamptz,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a9cbf168-c210-4b75-b449-804f690a37b3',
  '73091ba1-ba3e-492e-b8c9-d4a838d77fe7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'bb728eda-998a-4298-badb-be03254c5579',
  '2025-07-20 15:48:46.545+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '30bf3e7e-332c-4fe9-82ed-0bdc30486777'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'd7edf5cf-1cb5-4fb2-9575-b7b6be446293',
  '73091ba1-ba3e-492e-b8c9-d4a838d77fe7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '0e0a276d-7068-47ba-8400-b8a0610254ef',
  '2025-07-22 23:24:15.791+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '40d7db6b-d881-4e23-a273-e43e34b934a6'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a6c085c9-5398-4a4c-8925-f5de7e11e285',
  '73091ba1-ba3e-492e-b8c9-d4a838d77fe7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '0121fcaa-c480-4ed3-a569-eab34e30c47b',
  '2025-07-22 23:24:15.791+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '40d7db6b-d881-4e23-a273-e43e34b934a6'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '2f1838aa-c0c6-4f2c-b079-9c8aa50cc1d3',
  '73091ba1-ba3e-492e-b8c9-d4a838d77fe7',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '3e8976da-85a0-4bc2-a51e-909fca6e8cfc',
  '2025-07-26 00:05:07.342+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '800ef264-7b7e-408c-9c65-7bd13e4bd96b'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'cff72a06-151c-4cda-997f-47e1e7646302',
    'ab2ef121-3565-475d-bc3d-80121c18b028',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    'deload'::wendler_cycle_type_enum,
    '2025-07-27 17:29:05.835+00'::timestamptz,
    4
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '7e8a42a1-4a0e-4971-ae74-9c78db8ba18d',
  'cff72a06-151c-4cda-997f-47e1e7646302',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'bb728eda-998a-4298-badb-be03254c5579',
  '2025-07-27 17:29:05.835+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '3ee78f1a-4f87-4de3-8d1c-877351e01dc7'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '149114e9-a7b4-4891-8536-a456d7694bfb',
  'cff72a06-151c-4cda-997f-47e1e7646302',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '0e0a276d-7068-47ba-8400-b8a0610254ef',
  '2025-07-29 23:49:45.272+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'ccffa5fa-a5fc-4b82-a296-6f231f4d2edd'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '0b2f9066-578c-4d5e-8911-015e5e3560e0',
  'cff72a06-151c-4cda-997f-47e1e7646302',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '0121fcaa-c480-4ed3-a569-eab34e30c47b',
  '2025-07-29 23:49:45.272+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'ccffa5fa-a5fc-4b82-a296-6f231f4d2edd'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'ba2d9934-17d7-45d8-b7ba-d091a149a288',
  'cff72a06-151c-4cda-997f-47e1e7646302',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '3e8976da-85a0-4bc2-a51e-909fca6e8cfc',
  '2025-08-02 17:27:05.767+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '6386d065-bbfc-4d3a-b7a5-2debd506a508'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program (id, user_id, name, program_order, started_at)
VALUES
  (
    '8d7f5367-d73c-4ede-bb5f-8ec6a0a8b032',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    'Wendler Program 4',
    4,
    '2025-08-03 17:33:53.303861+00'::timestamptz
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'ec4d0105-dde8-4021-95a8-9b182ee9f3c7',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '4ad4ee57-dc90-493d-a6e9-7ab38e05d22f',
    '8d7f5367-d73c-4ede-bb5f-8ec6a0a8b032',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '5'::wendler_cycle_type_enum,
    '2025-08-03 17:33:53.303861+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '47510937-0d63-4a4a-94d7-25be1c23436a',
  '4ad4ee57-dc90-493d-a6e9-7ab38e05d22f',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'ec4d0105-dde8-4021-95a8-9b182ee9f3c7',
  '2025-08-03 17:33:53.303861+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'c887f751-0748-48e9-a2bb-453fad988cac'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '9d281eb3-8c6b-4c31-a33b-b56b14b1af7b',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '35ede8fe-d7e0-4c84-b0ff-a1ef987ba3f0',
  '4ad4ee57-dc90-493d-a6e9-7ab38e05d22f',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '9d281eb3-8c6b-4c31-a33b-b56b14b1af7b',
  '2025-08-08 00:02:59.061531+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '5f68e504-b1fb-46ea-ace2-8c7aa5771855'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '54504dbd-4cbc-4db6-94ae-a52f1c826b66',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'f71418a5-12f8-42ae-9d48-6fee2bf691da',
  '4ad4ee57-dc90-493d-a6e9-7ab38e05d22f',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '54504dbd-4cbc-4db6-94ae-a52f1c826b66',
  '2025-08-09 00:01:03.316896+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '9c38fde0-7211-4c98-a314-d1eb85d6aa8c'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'aa312d9e-a74f-4060-9976-26ae2ab7bad3',
    '8d7f5367-d73c-4ede-bb5f-8ec6a0a8b032',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    'deload'::wendler_cycle_type_enum,
    NULL,
    4
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '43ce9088-5e4d-4c8a-8490-25fa7eb7388a',
  'aa312d9e-a74f-4060-9976-26ae2ab7bad3',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'ec4d0105-dde8-4021-95a8-9b182ee9f3c7',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '2b9466c2-0179-4967-9171-1a9d15e99567'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '0560bf60-1431-4806-baa3-656e535a5b2c',
    '8d7f5367-d73c-4ede-bb5f-8ec6a0a8b032',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '3'::wendler_cycle_type_enum,
    NULL,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'fb0667c6-8d69-4a8f-ab73-f37795195828',
  '0560bf60-1431-4806-baa3-656e535a5b2c',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'ec4d0105-dde8-4021-95a8-9b182ee9f3c7',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '00ddaa14-290b-4ae2-bc2d-242926278e69'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '73b315a3-5a55-49bc-847c-c16a7929678b',
    '8d7f5367-d73c-4ede-bb5f-8ec6a0a8b032',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    '1'::wendler_cycle_type_enum,
    NULL,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '5a08a3bd-d954-461c-9058-6a2f912c59ed',
  '73b315a3-5a55-49bc-847c-c16a7929678b',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'ec4d0105-dde8-4021-95a8-9b182ee9f3c7',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '4ac8ec80-761f-4e09-b0ed-bf4b6dc12a7b'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '237df864-d8d9-457a-ae80-d69f8f0d5d30',
  'aa312d9e-a74f-4060-9976-26ae2ab7bad3',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '9d281eb3-8c6b-4c31-a33b-b56b14b1af7b',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '668489b3-e715-4a25-9bd2-0d79ca90e435'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '4c6c4da6-b97c-4c0e-a5f6-91f6e4bd108a',
  '0560bf60-1431-4806-baa3-656e535a5b2c',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '9d281eb3-8c6b-4c31-a33b-b56b14b1af7b',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '949a9c53-3ad2-46b0-ba8d-f39051673d2a'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '91a34683-8482-4850-8930-6fa2e36035db',
  '73b315a3-5a55-49bc-847c-c16a7929678b',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '9d281eb3-8c6b-4c31-a33b-b56b14b1af7b',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '8657cac4-f277-4252-a295-15d302a5a104'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '03e28a43-8529-4af5-aa35-092ec3f8a3fd',
  'aa312d9e-a74f-4060-9976-26ae2ab7bad3',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '54504dbd-4cbc-4db6-94ae-a52f1c826b66',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '6f09a366-6527-4996-919e-db6e88263a7d'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'ea8ab35d-cce0-4dbf-b196-ec966b7a4aa5',
  '0560bf60-1431-4806-baa3-656e535a5b2c',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '54504dbd-4cbc-4db6-94ae-a52f1c826b66',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '7cc6ba97-aa4d-4a34-9a78-d0e6f122c172'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'acd6a411-ccdb-4b45-9915-82f55b23b642',
  '73b315a3-5a55-49bc-847c-c16a7929678b',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '54504dbd-4cbc-4db6-94ae-a52f1c826b66',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '5291302f-6cf2-4d96-8852-ff28b9a628ab'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '96d83648-9d78-4c6d-9cb4-c522069beb3e',
    '97097295-6eb1-4824-8bfa-8984cf9bea6b',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '817e5cc7-019b-4dd1-95aa-18d1deec32df',
  'aa312d9e-a74f-4060-9976-26ae2ab7bad3',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '96d83648-9d78-4c6d-9cb4-c522069beb3e',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '8e9aeefe-717f-4b58-88d3-feb12559a09b'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '71df750d-9f92-4d85-9966-634407c3d02d',
  '4ad4ee57-dc90-493d-a6e9-7ab38e05d22f',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '96d83648-9d78-4c6d-9cb4-c522069beb3e',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '8e965348-363f-4962-a42e-134ac7e8a04c'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'dc5a7d86-7109-4493-b5b5-51cd10d3cd12',
  '0560bf60-1431-4806-baa3-656e535a5b2c',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '96d83648-9d78-4c6d-9cb4-c522069beb3e',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'd9c4581a-f2ed-4d29-ad2f-d95bf17c439e'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '1768af69-ef21-4b24-9fe0-a764f4e102ed',
  '73b315a3-5a55-49bc-847c-c16a7929678b',
  '97097295-6eb1-4824-8bfa-8984cf9bea6b',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '96d83648-9d78-4c6d-9cb4-c522069beb3e',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '28e02ae5-9802-464f-b87e-8fee3360f0bc'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program (id, user_id, name, program_order, started_at)
VALUES
  (
    '6547953e-3500-4e74-8cb6-b78ef36ce21a',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    'Wendler Program 1',
    1,
    '2025-05-09 23:47:46.287+00'::timestamptz
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'd550a45a-d412-4a37-addd-75663373cef6',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '591a53b7-cb9f-49dc-ac13-1c4a37f78277',
    '6547953e-3500-4e74-8cb6-b78ef36ce21a',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '5'::wendler_cycle_type_enum,
    '2025-05-09 23:47:46.287+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '188f1433-c01c-42be-b99d-be1b8756a602',
  '591a53b7-cb9f-49dc-ac13-1c4a37f78277',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd550a45a-d412-4a37-addd-75663373cef6',
  '2025-05-09 23:47:46.287+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '54453b2f-d3ef-48a2-9b99-edf7f1da8850'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '1c46fc2d-1e4f-47f9-a9e1-cd7841e79109',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '8b9fd39a-1dfa-43bd-908a-1d55737b4019',
  '591a53b7-cb9f-49dc-ac13-1c4a37f78277',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '1c46fc2d-1e4f-47f9-a9e1-cd7841e79109',
  '2025-05-11 17:08:01.718+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'da19e382-fd80-4a3f-9553-99bd64adcd01'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '1220c8fa-beb8-4384-9463-35464444303c',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'ab7a728c-bbfc-469f-9945-d1c9161be279',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '8a92bf46-9a4c-47f1-ad40-61a16040a447',
  '591a53b7-cb9f-49dc-ac13-1c4a37f78277',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '1220c8fa-beb8-4384-9463-35464444303c',
  '2025-05-13 23:54:03.522+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '3340dfd2-f7bc-49e1-80a7-0f0534a50477'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a398a383-7c5e-4474-8e4d-365c10984031',
  '591a53b7-cb9f-49dc-ac13-1c4a37f78277',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'ab7a728c-bbfc-469f-9945-d1c9161be279',
  '2025-05-13 23:54:03.522+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '3340dfd2-f7bc-49e1-80a7-0f0534a50477'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '643f03fd-c484-44ca-a6c0-44bfb3aee304',
    '6547953e-3500-4e74-8cb6-b78ef36ce21a',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '3'::wendler_cycle_type_enum,
    '2025-05-19 23:40:50.211+00'::timestamptz,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '55d4f96c-212b-441a-a2d6-ca72acb2e02f',
  '643f03fd-c484-44ca-a6c0-44bfb3aee304',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '1220c8fa-beb8-4384-9463-35464444303c',
  '2025-05-19 23:40:50.211+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'b4ad02bf-bd4f-426f-87e7-2b5988fc4573'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'b1a38959-e111-44a3-abc5-bcdc8c39c662',
  '643f03fd-c484-44ca-a6c0-44bfb3aee304',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'ab7a728c-bbfc-469f-9945-d1c9161be279',
  '2025-05-19 23:40:50.211+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'b4ad02bf-bd4f-426f-87e7-2b5988fc4573'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '02b8d74d-abca-4983-a4bb-97aefc3aed2f',
  '643f03fd-c484-44ca-a6c0-44bfb3aee304',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '1c46fc2d-1e4f-47f9-a9e1-cd7841e79109',
  '2025-05-20 23:57:00.197+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'b801f80f-a163-45da-aef5-11befa0d7812'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '8acf8358-a9b8-4cb1-8e51-b3ea0df28358',
  '643f03fd-c484-44ca-a6c0-44bfb3aee304',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd550a45a-d412-4a37-addd-75663373cef6',
  '2025-05-23 23:51:24.47+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'a7bb13c8-9fd1-4b75-a414-a6789f2fedfc'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '71ca23e6-317f-4337-8294-de4304ed777a',
    '6547953e-3500-4e74-8cb6-b78ef36ce21a',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '1'::wendler_cycle_type_enum,
    '2025-05-25 17:54:58.555+00'::timestamptz,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '6f1bd59e-4a59-4eb0-b0da-77d6b8bab049',
  '71ca23e6-317f-4337-8294-de4304ed777a',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '1c46fc2d-1e4f-47f9-a9e1-cd7841e79109',
  '2025-05-25 17:54:58.555+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '5f28583f-de57-4cc6-9350-6b8034f73a52'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'b9dcd64b-1648-4728-bcb9-0a53ad9c158e',
  '71ca23e6-317f-4337-8294-de4304ed777a',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '1220c8fa-beb8-4384-9463-35464444303c',
  '2025-05-27 23:51:35.623+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'beb11df1-bf0b-407b-8123-b1b8ef1ff386'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '5948ec1f-50e7-4fa3-a2fb-d7d93161a585',
  '71ca23e6-317f-4337-8294-de4304ed777a',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'ab7a728c-bbfc-469f-9945-d1c9161be279',
  '2025-05-27 23:51:35.623+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'beb11df1-bf0b-407b-8123-b1b8ef1ff386'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '81a8f55a-6a46-4ef2-a72c-0b535d3f5c91',
  '71ca23e6-317f-4337-8294-de4304ed777a',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd550a45a-d412-4a37-addd-75663373cef6',
  '2025-05-30 23:11:41.41+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'c660bd52-9dba-4a59-8313-097ae83efd93'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program (id, user_id, name, program_order, started_at)
VALUES
  (
    '4723997a-6291-4d47-a53e-1db66cdf1f78',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    'Wendler Program 2',
    2,
    '2025-06-01 17:35:16.512+00'::timestamptz
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '0c0f2c2d-4b3f-4c4b-8ff1-68bf84319a76',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'f8254b81-083c-4dab-b1ae-5ffcd1724b4b',
    '4723997a-6291-4d47-a53e-1db66cdf1f78',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '5'::wendler_cycle_type_enum,
    '2025-06-01 17:35:16.512+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '7891d348-5fa1-472f-9174-0af50b3e7bac',
  'f8254b81-083c-4dab-b1ae-5ffcd1724b4b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '0c0f2c2d-4b3f-4c4b-8ff1-68bf84319a76',
  '2025-06-01 17:35:16.512+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '48e17fd9-44ff-48e8-a388-19320d81dc86'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'ca47ccd9-0f41-4d96-835c-b0ba98f76a49',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '12b5ce9b-ae1c-4792-a90f-a1cab58d9841',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '6323ecfc-27fd-4e18-8ac5-869cce233eb1',
  'f8254b81-083c-4dab-b1ae-5ffcd1724b4b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'ca47ccd9-0f41-4d96-835c-b0ba98f76a49',
  '2025-06-03 23:42:28.301+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '9a6c98ea-7840-4ea0-b6ad-fd0f86e024d5'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'ecfcc075-e329-483e-b156-79a8a390f54c',
  'f8254b81-083c-4dab-b1ae-5ffcd1724b4b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '12b5ce9b-ae1c-4792-a90f-a1cab58d9841',
  '2025-06-03 23:42:28.301+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '9a6c98ea-7840-4ea0-b6ad-fd0f86e024d5'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'aab17758-bc1a-4bde-b4c0-c1fe3ac712bf',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '00b9c001-eb37-49eb-9532-e7aabbc4b9fd',
  'f8254b81-083c-4dab-b1ae-5ffcd1724b4b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'aab17758-bc1a-4bde-b4c0-c1fe3ac712bf',
  '2025-06-06 23:58:03.096+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '636cc5f4-1835-4c71-9fed-2c1027148baf'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'bb3a3c70-37b4-4f1a-a71e-9957a78ca970',
    '4723997a-6291-4d47-a53e-1db66cdf1f78',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '3'::wendler_cycle_type_enum,
    '2025-06-08 16:26:56.643+00'::timestamptz,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '8e30c85b-5508-4dfc-a23d-df3a4e94ddd5',
  'bb3a3c70-37b4-4f1a-a71e-9957a78ca970',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '0c0f2c2d-4b3f-4c4b-8ff1-68bf84319a76',
  '2025-06-08 16:26:56.643+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '3c47bedc-3b17-4574-9a8f-6ac317098856'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '3a39cb38-d653-403b-a89b-8eb9d769e60e',
  'bb3a3c70-37b4-4f1a-a71e-9957a78ca970',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'ca47ccd9-0f41-4d96-835c-b0ba98f76a49',
  '2025-06-10 23:55:38.018+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '167b9bc4-9695-4f98-8cba-22d4d00f03d8'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'e279917e-4985-4e10-a0bf-d7185955948b',
  'bb3a3c70-37b4-4f1a-a71e-9957a78ca970',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '12b5ce9b-ae1c-4792-a90f-a1cab58d9841',
  '2025-06-10 23:55:38.018+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '167b9bc4-9695-4f98-8cba-22d4d00f03d8'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'cf7454b7-9de7-441e-a3f5-cd0ceedffa4f',
  'bb3a3c70-37b4-4f1a-a71e-9957a78ca970',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'aab17758-bc1a-4bde-b4c0-c1fe3ac712bf',
  '2025-06-14 16:29:43.983+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'e65c027e-a468-4925-a2a0-9072bcd30d89'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'eb6b5232-6987-4713-86a3-649703793b9b',
    '4723997a-6291-4d47-a53e-1db66cdf1f78',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '1'::wendler_cycle_type_enum,
    '2025-06-15 17:29:08.817+00'::timestamptz,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'b20a9274-d7c7-4c6f-99d9-f128ec0d73ae',
  'eb6b5232-6987-4713-86a3-649703793b9b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '0c0f2c2d-4b3f-4c4b-8ff1-68bf84319a76',
  '2025-06-15 17:29:08.817+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '61fda78e-eb7d-46fe-a9a1-de06ee6b4635'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '9858ee0a-6eaf-491a-8091-e86ccb4b138b',
  'eb6b5232-6987-4713-86a3-649703793b9b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'ca47ccd9-0f41-4d96-835c-b0ba98f76a49',
  '2025-06-17 23:52:45.307+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '479e96d6-bdfe-40ec-9eaf-f541b7698a53'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'b9ea583f-e871-4976-8aeb-95f737c1a20f',
  'eb6b5232-6987-4713-86a3-649703793b9b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '12b5ce9b-ae1c-4792-a90f-a1cab58d9841',
  '2025-06-17 23:52:45.307+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '479e96d6-bdfe-40ec-9eaf-f541b7698a53'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '3b64e368-c2b8-43de-bfd7-e5a0b0742094',
  'eb6b5232-6987-4713-86a3-649703793b9b',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'aab17758-bc1a-4bde-b4c0-c1fe3ac712bf',
  '2025-06-20 23:41:47.547+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'be64e399-099d-4603-89bf-dae2f54cd8e7'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '46737553-eb5f-40b9-b069-4eb49dc316ae',
    '4723997a-6291-4d47-a53e-1db66cdf1f78',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    'deload'::wendler_cycle_type_enum,
    '2025-06-22 16:35:33.009+00'::timestamptz,
    4
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'e187d3bb-984f-4a01-a751-9276d5c0d12b',
  '46737553-eb5f-40b9-b069-4eb49dc316ae',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '0c0f2c2d-4b3f-4c4b-8ff1-68bf84319a76',
  '2025-06-22 16:35:33.009+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'e60a4697-8655-4e5c-a527-f09983a07733'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '8e693cff-6779-4740-a44e-a96056a59972',
  '46737553-eb5f-40b9-b069-4eb49dc316ae',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'ca47ccd9-0f41-4d96-835c-b0ba98f76a49',
  '2025-06-24 23:42:47.309+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '3afd86f1-8e62-41e0-b357-1da12d0273e7'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'd0ac58a8-4a78-4d5f-9e7f-efa567facde4',
  '46737553-eb5f-40b9-b069-4eb49dc316ae',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '12b5ce9b-ae1c-4792-a90f-a1cab58d9841',
  '2025-06-24 23:42:47.309+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '3afd86f1-8e62-41e0-b357-1da12d0273e7'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '74a4b311-b0ae-4b22-bccc-5b0b51c70106',
  '46737553-eb5f-40b9-b069-4eb49dc316ae',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'aab17758-bc1a-4bde-b4c0-c1fe3ac712bf',
  '2025-06-28 15:13:44.318+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'e4ff8d12-0428-4125-9c35-fe07aa267dbf'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program (id, user_id, name, program_order, started_at)
VALUES
  (
    '87660da8-e21c-4573-839e-b1d906194a24',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    'Wendler Program 3',
    3,
    '2025-06-29 18:04:51.697+00'::timestamptz
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'f1572080-632e-4a34-b9af-51dd4880fe8c',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '56af9463-0cae-47fe-9c0c-19679fead702',
    '87660da8-e21c-4573-839e-b1d906194a24',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '5'::wendler_cycle_type_enum,
    '2025-06-29 18:04:51.697+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'cda623e3-e694-4af8-b3ba-45a6b3d633c1',
  '56af9463-0cae-47fe-9c0c-19679fead702',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'f1572080-632e-4a34-b9af-51dd4880fe8c',
  '2025-06-29 18:04:51.697+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '1ba91120-5fce-4459-ab54-163110fd51bd'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '90d9b7ed-acd4-46ae-8df9-7241e8c9b9fd',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'e41c25f8-73e4-48f4-b1c5-d9311db5e002',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'e6b37bff-07c9-404e-9762-0e4b5ef4824f',
  '56af9463-0cae-47fe-9c0c-19679fead702',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '90d9b7ed-acd4-46ae-8df9-7241e8c9b9fd',
  '2025-07-03 23:34:12.738+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '259e934b-c216-426b-be26-42c564d30a18'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '377d23a0-6aa0-4481-b367-9087d9b8706a',
  '56af9463-0cae-47fe-9c0c-19679fead702',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'e41c25f8-73e4-48f4-b1c5-d9311db5e002',
  '2025-07-03 23:34:12.738+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '259e934b-c216-426b-be26-42c564d30a18'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'd7a17d41-1dd3-4d0a-b393-2402a25dbf94',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '275fad21-1c3c-4d55-83b9-8673462024fa',
  '56af9463-0cae-47fe-9c0c-19679fead702',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd7a17d41-1dd3-4d0a-b393-2402a25dbf94',
  '2025-07-10 23:49:25.312+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '1614a9e7-4ffa-42e1-8aa4-1b45811cc366'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '5aeff271-7dd8-460c-b8b1-db387ea56e03',
    '87660da8-e21c-4573-839e-b1d906194a24',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '3'::wendler_cycle_type_enum,
    '2025-07-13 23:25:37.214+00'::timestamptz,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '7d197ce5-35d5-4c92-b614-717e3e800687',
  '5aeff271-7dd8-460c-b8b1-db387ea56e03',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'f1572080-632e-4a34-b9af-51dd4880fe8c',
  '2025-07-13 23:25:37.214+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '7467d5f5-fbf7-498c-a70b-da85a124f9ed'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '17acc640-8cf6-4324-bbd0-507826e2925e',
  '5aeff271-7dd8-460c-b8b1-db387ea56e03',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '90d9b7ed-acd4-46ae-8df9-7241e8c9b9fd',
  '2025-07-15 23:46:21.232+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'fa5a4f6d-3cd9-4ae3-842f-2f4bf9abf3fa'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '3c601ff8-3742-4e15-bf47-ba9a3ae84fb2',
  '5aeff271-7dd8-460c-b8b1-db387ea56e03',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'e41c25f8-73e4-48f4-b1c5-d9311db5e002',
  '2025-07-15 23:46:21.232+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'fa5a4f6d-3cd9-4ae3-842f-2f4bf9abf3fa'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'bbfddd00-9e70-4090-a7e4-64779cf850a5',
  '5aeff271-7dd8-460c-b8b1-db387ea56e03',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd7a17d41-1dd3-4d0a-b393-2402a25dbf94',
  '2025-07-17 23:46:31.209+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '39fe1e8e-0cec-4840-b575-876d66f7ebe3'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    'f50dba96-b9db-4d8a-a299-729b9ecccb3e',
    '87660da8-e21c-4573-839e-b1d906194a24',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '1'::wendler_cycle_type_enum,
    '2025-07-20 15:48:43.953+00'::timestamptz,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'f894caf9-0729-45a8-9d76-11ce9fbdf9ae',
  'f50dba96-b9db-4d8a-a299-729b9ecccb3e',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'f1572080-632e-4a34-b9af-51dd4880fe8c',
  '2025-07-20 15:48:43.953+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '4bac580e-c422-4be2-88be-16d820008480'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'd5483341-bc1a-4796-a5d3-ef04e51a2f04',
  'f50dba96-b9db-4d8a-a299-729b9ecccb3e',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '90d9b7ed-acd4-46ae-8df9-7241e8c9b9fd',
  '2025-07-22 23:25:56.354+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '8502214e-d048-4d27-8eff-cf1fedf688d6'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a3dc8a65-a616-40f1-8e52-625d6caf3829',
  'f50dba96-b9db-4d8a-a299-729b9ecccb3e',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'e41c25f8-73e4-48f4-b1c5-d9311db5e002',
  '2025-07-22 23:25:56.354+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '8502214e-d048-4d27-8eff-cf1fedf688d6'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '708df8f0-635d-4c7a-adb0-2549f34b8f2d',
  'f50dba96-b9db-4d8a-a299-729b9ecccb3e',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd7a17d41-1dd3-4d0a-b393-2402a25dbf94',
  '2025-07-26 00:06:18.674+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '32778001-22f5-4141-92bc-a5c96edf869c'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '5d6f0075-9b87-4343-b89b-d150f1bdefe0',
    '87660da8-e21c-4573-839e-b1d906194a24',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    'deload'::wendler_cycle_type_enum,
    '2025-07-27 17:28:59.261+00'::timestamptz,
    4
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '04c2d567-a88f-451e-8e76-01e8f024b58a',
  '5d6f0075-9b87-4343-b89b-d150f1bdefe0',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  'f1572080-632e-4a34-b9af-51dd4880fe8c',
  '2025-07-27 17:28:59.261+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '4ae2d9a2-f862-4e23-8297-8d34807fea20'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '1160acc2-4ded-4f64-bb0c-ef58d52ece6a',
  '5d6f0075-9b87-4343-b89b-d150f1bdefe0',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  '90d9b7ed-acd4-46ae-8df9-7241e8c9b9fd',
  '2025-07-29 23:50:05.415+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '41313218-ced9-4b8b-ab91-107fb3876bb2'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'b2da41c1-ccc5-4b79-bcee-e06c5f0ff328',
  '5d6f0075-9b87-4343-b89b-d150f1bdefe0',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  'e41c25f8-73e4-48f4-b1c5-d9311db5e002',
  '2025-07-29 23:50:05.415+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '41313218-ced9-4b8b-ab91-107fb3876bb2'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'ee58337b-eb2f-4913-8e61-909dd41227bc',
  '5d6f0075-9b87-4343-b89b-d150f1bdefe0',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  'd7a17d41-1dd3-4d0a-b393-2402a25dbf94',
  '2025-08-02 17:30:00.969+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'e5cb2be6-5249-4f29-8281-1565f00a0e67'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program (id, user_id, name, program_order, started_at)
VALUES
  (
    '063062db-ebfc-4836-aa1f-94b0e5d7077e',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    'Wendler Program 4',
    4,
    '2025-08-03 17:34:08.470398+00'::timestamptz
  );

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '324156c9-e734-44e0-bde0-fecdde19b5b3',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '9af3d556-fcb0-40de-a684-5b5e07ef6145',
    '063062db-ebfc-4836-aa1f-94b0e5d7077e',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '5'::wendler_cycle_type_enum,
    '2025-08-03 17:34:08.470398+00'::timestamptz,
    1
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '6feddffd-123a-4268-bd11-cb1b299bc376',
  '9af3d556-fcb0-40de-a684-5b5e07ef6145',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '324156c9-e734-44e0-bde0-fecdde19b5b3',
  '2025-08-03 17:34:08.470398+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '818624fe-7ea5-417d-910b-ff9da0dec13f'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    'b746aa7d-c79d-4f85-8a54-c47d86fe9432',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '5790de55-0add-4400-b05d-e3660913af0f',
  '9af3d556-fcb0-40de-a684-5b5e07ef6145',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'b746aa7d-c79d-4f85-8a54-c47d86fe9432',
  '2025-08-08 00:08:25.983857+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '39fefc4b-bc63-455b-96a0-83b55e6595dd'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '431e14e7-ec3d-44d2-9001-a4d3d5b0c60e',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '74e5fab1-68f2-4cda-84f4-148ef7efeb56',
  '9af3d556-fcb0-40de-a684-5b5e07ef6145',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '431e14e7-ec3d-44d2-9001-a4d3d5b0c60e',
  '2025-08-09 00:03:20.202541+00'::timestamptz
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '4cf8f2ca-81a9-4540-942c-837bf9872626'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '70aa71de-99b3-470d-a892-8983adce18af',
    '063062db-ebfc-4836-aa1f-94b0e5d7077e',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    'deload'::wendler_cycle_type_enum,
    NULL,
    4
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'a7df4b15-b478-4ae4-8f9f-0eb92dcc01c2',
  '70aa71de-99b3-470d-a892-8983adce18af',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '324156c9-e734-44e0-bde0-fecdde19b5b3',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '77d07346-5240-430b-99cb-4fddedc0a496'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '16c14eda-4390-4579-818c-f28932a8adec',
    '063062db-ebfc-4836-aa1f-94b0e5d7077e',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '3'::wendler_cycle_type_enum,
    NULL,
    2
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '9a65d4d7-56ec-40ef-87a5-40310b63906c',
  '16c14eda-4390-4579-818c-f28932a8adec',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '324156c9-e734-44e0-bde0-fecdde19b5b3',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '80d2ca6e-8b47-4216-a027-f84c1439eeff'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle (
    id,
    wendler_program_id,
    user_id,
    cycle_type,
    started_at,
    cycle_order
  )
VALUES
  (
    '7fb2c332-61f2-4812-99b9-b82addb84403',
    '063062db-ebfc-4836-aa1f-94b0e5d7077e',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    '1'::wendler_cycle_type_enum,
    NULL,
    3
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '77deb977-8fb3-4745-b8f1-572ae38f798f',
  '7fb2c332-61f2-4812-99b9-b82addb84403',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_back_squat'::exercise_type_enum,
  esb.block_id,
  '324156c9-e734-44e0-bde0-fecdde19b5b3',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '45500535-3438-498b-9a55-093f9002478e'
  AND eb.exercise_type = 'barbell_back_squat'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '707284f7-6d69-4aca-b5ab-daf23bb1aef2',
  '70aa71de-99b3-470d-a892-8983adce18af',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'b746aa7d-c79d-4f85-8a54-c47d86fe9432',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '754ab4c4-6668-499e-b5b8-34e73d5162bd'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '820ee11b-9122-46cc-a084-52a13846a1cc',
  '16c14eda-4390-4579-818c-f28932a8adec',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'b746aa7d-c79d-4f85-8a54-c47d86fe9432',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'f0d1683c-ee5c-43d4-b094-7cad34757f3e'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '7ad749d6-50a6-46c1-b81c-cf8ebf401424',
  '7fb2c332-61f2-4812-99b9-b82addb84403',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_bench_press'::exercise_type_enum,
  esb.block_id,
  'b746aa7d-c79d-4f85-8a54-c47d86fe9432',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '2e23cec7-c5bc-4a6e-9139-cc4f2b4ce83b'
  AND eb.exercise_type = 'barbell_bench_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '9c0d0b49-6f35-4525-a674-47cc56fbbf91',
  '70aa71de-99b3-470d-a892-8983adce18af',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '431e14e7-ec3d-44d2-9001-a4d3d5b0c60e',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = 'ed36ab05-14d9-4b57-8d5f-2f18ed5d4fe9'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '9de8385c-5a7f-4a6f-b5d1-dc9c7b974e73',
  '16c14eda-4390-4579-818c-f28932a8adec',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '431e14e7-ec3d-44d2-9001-a4d3d5b0c60e',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '80b9884c-8ac3-4c60-b942-390e9cfd2dbc'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '9fdad224-d0a4-4e16-b280-6f5b1e49d9fa',
  '7fb2c332-61f2-4812-99b9-b82addb84403',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_deadlift'::exercise_type_enum,
  esb.block_id,
  '431e14e7-ec3d-44d2-9001-a4d3d5b0c60e',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '28b27a57-0767-4347-9013-54d2cae70ae1'
  AND eb.exercise_type = 'barbell_deadlift'::exercise_type_enum;

INSERT INTO
  wendler_movement_max (
    id,
    user_id,
    target_max_value,
    increase_amount_value,
    weight_unit
  )
VALUES
  (
    '752c83af-a685-4981-9d42-d6477e9a8167',
    'd6e4a8a4-a0c1-4760-9512-a569473fe162',
    0,
    0,
    'pounds'
  );

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'd8702011-ffe1-42fd-be68-0c6548f855f5',
  '70aa71de-99b3-470d-a892-8983adce18af',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '752c83af-a685-4981-9d42-d6477e9a8167',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '96717077-d43e-468a-a8c9-a56e9011f3d4'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  '32868bbf-ff5b-4a3b-b5ae-7fda4bdc171d',
  '9af3d556-fcb0-40de-a684-5b5e07ef6145',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '752c83af-a685-4981-9d42-d6477e9a8167',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '8795a1db-0c28-4250-a13d-4d80ef9da41f'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

INSERT INTO
  wendler_program_cycle_movement (
    id,
    wendler_program_cycle_id,
    user_id,
    exercise_type,
    block_id,
    movement_max_id,
    started_at
  )
SELECT
  'ed46b129-47d3-472d-b381-535f1eb4f130',
  '16c14eda-4390-4579-818c-f28932a8adec',
  'd6e4a8a4-a0c1-4760-9512-a569473fe162',
  'barbell_overhead_press'::exercise_type_enum,
  esb.block_id,
  '752c83af-a685-4981-9d42-d6477e9a8167',
  NULL
FROM
  exercise_superblock_blocks esb
  JOIN exercise_block eb ON esb.block_id = eb.id
WHERE
  esb.superblock_id = '114319f1-8729-4c8e-bf9c-d6b2fa7e4681'
  AND eb.exercise_type = 'barbell_overhead_press'::exercise_type_enum;

  ELSE
    -- User does not exist, skip migration
    RAISE NOTICE 'User 97097295-6eb1-4824-8bfa-8984cf9bea6b does not exist in the database. Skipping wendler data regeneration.';
  END IF;
END $$;
