-- Fix wendler_movement_max values by calculating proper training max
-- Formula: training_max = target_weight_value / 0.9 / cycle_multiplier
-- Cycle multipliers: 5 = 0.85, 3 = 0.9, 1 = 0.95, deload = 0.6
-- Round to nearest 5
-- Calculate separately for each program (program_order)
UPDATE wendler_movement_max
SET
  target_max_value = ROUND(calculated_max / 5.0) * 5
FROM
  (
    SELECT
      wmm.id as movement_max_id,
      wp.program_order,
      wpcm.exercise_type,
      -- Get the highest target weight for this exercise type in this specific program
      MAX(
        CASE wpc.cycle_type
          WHEN '5' THEN e.target_weight_value / 0.9 / 0.85
          WHEN '3' THEN e.target_weight_value / 0.9 / 0.9
          WHEN '1' THEN e.target_weight_value / 0.9 / 0.95
          WHEN 'deload' THEN e.target_weight_value / 0.9 / 0.6
        END
      ) as calculated_max
    FROM
      wendler_movement_max wmm
      JOIN wendler_program_cycle_movement wpcm ON wmm.id = wpcm.movement_max_id
      JOIN wendler_program_cycle wpc ON wpcm.wendler_program_cycle_id = wpc.id
      JOIN wendler_program wp ON wpc.wendler_program_id = wp.id
      JOIN exercise_block eb ON wpcm.block_id = eb.id
      JOIN exercise_block_exercises ebe ON eb.id = ebe.block_id
      JOIN exercises e ON ebe.exercise_id = e.id
    WHERE
      ebe.exercise_order = (
        SELECT
          MAX(ebe2.exercise_order)
        FROM
          exercise_block_exercises ebe2
        WHERE
          ebe2.block_id = eb.id
      )
      AND e.exercise_type = wpcm.exercise_type
      AND e.target_weight_value IS NOT NULL
    GROUP BY
      wmm.id,
      wp.program_order,
      wpcm.exercise_type,
      wmm.user_id
  ) calc
WHERE
  wendler_movement_max.id = calc.movement_max_id;
