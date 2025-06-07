-- Function: round_to_nearest_5
CREATE OR REPLACE FUNCTION public.round_to_nearest_5(p_weight numeric)
RETURNS numeric AS $$
BEGIN
    RETURN ROUND(p_weight / 5.0) * 5;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
