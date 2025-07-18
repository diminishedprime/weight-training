-- Everything in this file should be completely pure functions with no
-- dependencies except for other pure functions.
CREATE OR REPLACE FUNCTION public.round_to_1_decimal (p_value numeric) RETURNS numeric AS $$
BEGIN
    RETURN ROUND(p_value::numeric, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.round_to_nearest_5 (p_weight numeric) RETURNS numeric AS $$
BEGIN
    RETURN ROUND(p_weight / 5.0) * 5;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.normalize_bar_weight_pounds (p_weight numeric) RETURNS numeric AS $$
BEGIN
    RETURN GREATEST(45, public.round_to_nearest_5(p_weight));
END;
$$ LANGUAGE plpgsql IMMUTABLE;
