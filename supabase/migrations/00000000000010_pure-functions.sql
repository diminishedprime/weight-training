-- Function: round_to_1_decimal
--
-- Purpose: Rounds a numeric value to 1 decimal place.
--
-- Why: Used for storing/displaying the actual (unrounded) weight value for exercises, while still enforcing a consistent decimal format.
--
-- Arguments:
--   p_value (numeric): The value to round.
-- Returns:
--   numeric: The input value rounded to 1 decimal place.
-- Usage:
--   Used for storing the actual weight value in the exercises table.
CREATE OR REPLACE FUNCTION public.round_to_1_decimal (p_value numeric) RETURNS numeric AS $$
BEGIN
    RETURN ROUND(p_value::numeric, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ========================================================================== --
--
-- Migration: 00000000000010_pure-functions.sql
--
-- Purpose: Defines pure utility functions 
--
-- Strategy: Domain-driven, composable, and testable pure functions for fitness
--           calculations. These functions are used throughout the schema to
--           ensure consistency, type safety, and maintainability in
--           weight-related logic.
--
-- See: DATABASE_STRATEGY.md and DATABASE_DOCUMENTATION_STRATEGY.md for
--      philosophy and standards.
-- ========================================================================== --
--
-- Function: round_to_nearest_5
--
-- Purpose: Rounds a numeric weight value to the nearest multiple of 5.
--
-- Why: Standardizing weight increments to 5 units (pounds or kilograms) is a
--      common practice in strength training, reflecting real-world gym
--      equipment and simplifying calculations for both users and analytics.
--      This function ensures all weight values used in the system are
--      consistent with domain expectations, reducing errors and supporting
--      composability in barbell math.
--
-- Arguments:
--   p_weight (numeric): The weight value to round.
-- Returns:
--   numeric: The input value rounded to the nearest 5.
-- Usage:
--   Used for standardizing weight values in exercise calculations and ensuring
--   consistency in barbell math.
CREATE OR REPLACE FUNCTION public.round_to_nearest_5 (p_weight numeric) RETURNS numeric AS $$
BEGIN
    RETURN ROUND(p_weight / 5.0) * 5;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

--
-- TODO - I want this to be much more sophisticated. It should also take an enum
--        value for other barbells that exist, especially ones like the elephant
--        barbell which weighs 55 pounds instead of 45. Additionally, there is
--        the lighter weight barbell which weighs 35 pounds.
--
-- Function: normalize_bar_weight_pounds
--
-- Purpose: Ensures a barbell weight is at least 45 and rounded to the nearest 5 (for pounds).
--
-- Why: In most US gyms, the standard barbell weighs 45 pounds, and weights are
--      loaded in 5-pound increments. This function enforces a minimum barbell
--      weight and rounds up to the nearest 5, reflecting real-world constraints
--      and preventing invalid or non-standard barbell entries. This supports
--      composability and testability by ensuring all downstream logic receives
--      valid, normalized weights.
--
-- Arguments:
--   p_weight (numeric): The weight value to normalize.
-- Returns:
--   numeric: The normalized barbell weight (minimum 45, rounded to nearest 5).
-- Usage:
--   Used to enforce a minimum barbell weight and standardize increments for barbell exercises (in pounds).
CREATE OR REPLACE FUNCTION public.normalize_bar_weight_pounds (p_weight numeric) RETURNS numeric AS $$
BEGIN
    RETURN GREATEST(45, public.round_to_nearest_5(p_weight));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- End of migration: 00000000000010_pure-functions.sql
