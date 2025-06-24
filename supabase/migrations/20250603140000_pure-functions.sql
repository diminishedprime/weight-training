-- Function: round_to_nearest_5
-- Purpose: Rounds a numeric weight value to the nearest multiple of 5.
-- Arguments:
--   p_weight (numeric): The weight value to round.
-- Returns:
--   numeric: The input value rounded to the nearest 5.
-- Usage:
--   Used for standardizing weight values in exercise calculations and ensuring
--   consistency in barbell math.
CREATE OR REPLACE FUNCTION public.round_to_nearest_5(p_weight numeric)
RETURNS numeric AS $$
BEGIN
    RETURN ROUND(p_weight / 5.0) * 5;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: normalize_bar_weight_pounds
-- Purpose: Ensures a barbell weight is at least 45 and rounded to the nearest 5 (for pounds).
-- Arguments:
--   p_weight (numeric): The weight value to normalize.
-- Returns:
--   numeric: The normalized barbell weight (minimum 45, rounded to nearest 5).
-- Usage:
--   Used to enforce a minimum barbell weight and standardize increments for barbell exercises (in pounds).
CREATE OR REPLACE FUNCTION public.normalize_bar_weight_pounds(p_weight numeric)
RETURNS numeric AS $$
BEGIN
    RETURN GREATEST(45, public.round_to_nearest_5(p_weight));
END;
$$ LANGUAGE plpgsql IMMUTABLE;