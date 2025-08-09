-- Fix wendler_movement_max increase_amount_value
-- For program_order 1: increase_amount = target_max_value (starting from 0)
-- For program_order 2+: increase_amount = current target_max - previous target_max
-- Group by user_id, exercise_type to track progression
UPDATE wendler_movement_max
SET
  increase_amount_value = calc.increase_amount
FROM
  (
    SELECT
      wmm.id as movement_max_id,
      CASE
        WHEN wp.program_order = 1 THEN wmm.target_max_value
        ELSE wmm.target_max_value - LAG(wmm.target_max_value) OVER (
          PARTITION BY
            wmm.user_id,
            wpcm.exercise_type
          ORDER BY
            wp.program_order
        )
      END as increase_amount
    FROM
      wendler_movement_max wmm
      JOIN wendler_program_cycle_movement wpcm ON wmm.id = wpcm.movement_max_id
      JOIN wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id
      JOIN wendler_program wp ON wpc.wendler_program_id = wp.id
      -- Get one representative cycle per program to avoid duplicates
    WHERE
      wpc.cycle_type = '5'
  ) calc
WHERE
  wendler_movement_max.id = calc.movement_max_id;
