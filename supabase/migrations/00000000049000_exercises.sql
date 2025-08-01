-- TODO: Consider creating a new table `bodyweight_exercise_details` to track bodyweight-specific data for exercises.
-- This table would have a foreign key to exercises(id) and could include fields like:
--   bodyweight_value numeric NULL, -- The user's bodyweight at the time of exercise
--   bodyweight_unit weight_unit_enum NULL, -- Unit for bodyweight (e.g., pounds, kilograms)
--   added_weight_value numeric NULL, -- Any additional weight used (vest, belt, etc.)
--   added_weight_unit weight_unit_enum NULL -- Unit for added weight
-- This would allow more accurate tracking and analytics for bodyweight and weighted bodyweight exercises.
--
-- Example table definition:
--
-- CREATE TABLE public.bodyweight_exercise_details (
--   exercise_id uuid PRIMARY KEY REFERENCES public.exercises(id) ON DELETE CASCADE,
--   bodyweight_value numeric NULL,
--   bodyweight_unit weight_unit_enum NULL,
--   added_weight_value numeric NULL,
--   added_weight_unit weight_unit_enum NULL
-- );
--
-- Example usage:
-- -- For a bodyweight pullup with a 20lb vest, user weighed 180lb:
-- -- INSERT INTO public.bodyweight_exercise_details (exercise_id, bodyweight_value, bodyweight_unit, added_weight_value, added_weight_unit)
-- -- VALUES ('<exercise_id>', 180, 'pounds', 20, 'pounds');
