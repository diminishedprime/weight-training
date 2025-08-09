-- Fix Steph's Wendler Program data
-- Move Push Day superblock from Program 5 to Program 4 (which was missing it)
-- Then delete the redundant Program 5
-- Move the Push Day superblock from Program 5's '5' cycle to Program 4's '5' cycle
UPDATE wendler_program_cycle_movement
SET
  wendler_program_cycle_id = '2084262f-93ed-4fde-811b-48f9e2067ef5'
WHERE
  id = 'f1293f1d-3f62-4ec6-8fd0-7fdc1c243038'
  AND wendler_program_cycle_id = '3ce5641c-db9d-42f0-b280-ab3fcb5a109e';

-- Delete all remaining cycle movements for Program 5 (except the one we just moved)
DELETE FROM wendler_program_cycle_movement
WHERE
  wendler_program_cycle_id IN (
    SELECT
      id
    FROM
      wendler_program_cycle
    WHERE
      wendler_program_id = '5156c8d2-8f7c-4dce-b6e0-348b4aeca381'
  )
  AND id != 'f1293f1d-3f62-4ec6-8fd0-7fdc1c243038';

-- Delete all cycles for Program 5
DELETE FROM wendler_program_cycle
WHERE
  wendler_program_id = '5156c8d2-8f7c-4dce-b6e0-348b4aeca381';

-- Delete Program 5
DELETE FROM wendler_program
WHERE
  id = '5156c8d2-8f7c-4dce-b6e0-348b4aeca381';

-- Fix skipped dumbbell exercises from Thursday (August 8th)
-- Matt and Steph had to skip dumbbell lateral raises due to UI issues
-- Change completion status from 'skipped' to 'completed' and set actual_weight_value
UPDATE exercises
SET
  completion_status = 'completed',
  actual_weight_value = target_weight_value
WHERE
  id IN (
    '8713e3db-6a36-48d7-9d77-16bac16914de',
    'c03c1715-0d0f-4e93-bccd-21d733f814d2',
    '473d7545-0a9a-47cc-84c5-9d106dc0c03d',
    'c734c4d5-6bbf-489c-8065-6a946b90740a',
    'ccddd743-e3b7-4cc1-ab4e-0141772bac11',
    '0fd7c5c0-c787-494f-9359-e9afbbf10de5',
    '7e8c9a25-25a7-44b6-b68a-1188d3d02917',
    '272853bf-2065-4f85-bbaa-724ff59ebe11',
    '1ce81937-abca-4631-843d-d9ad3244782d',
    '0444dadc-2272-4002-9a18-93e54bbe1ee2'
  )
  AND equipment_type = 'dumbbell'
  AND completion_status = 'skipped';
