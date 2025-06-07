-- Function: normalize_bar_weight
CREATE OR REPLACE FUNCTION public.normalize_bar_weight(p_weight numeric)
RETURNS numeric AS $$
BEGIN
    RETURN GREATEST(45, public.round_to_nearest_5(p_weight));
END;
$$ LANGUAGE plpgsql IMMUTABLE;
