CREATE OR REPLACE FUNCTION public.set_user_preferences (
  p_user_id uuid,
  p_preferred_weight_unit weight_unit_enum,
  p_default_rest_time integer,
  p_available_plates_lbs numeric[],
  p_available_dumbbells_lbs numeric[],
  p_available_kettlebells_lbs numeric[]
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id, preferred_weight_unit, default_rest_time, available_plates_lbs, available_dumbbells_lbs, available_kettlebells_lbs)
    VALUES (p_user_id, p_preferred_weight_unit, p_default_rest_time, p_available_plates_lbs, p_available_dumbbells_lbs, p_available_kettlebells_lbs)
    ON CONFLICT (user_id) DO UPDATE
      SET preferred_weight_unit = EXCLUDED.preferred_weight_unit,
          default_rest_time = EXCLUDED.default_rest_time,
          available_plates_lbs = EXCLUDED.available_plates_lbs,
          available_dumbbells_lbs = EXCLUDED.available_dumbbells_lbs,
          available_kettlebells_lbs = EXCLUDED.available_kettlebells_lbs,
          updated_at = timezone('utc', now());
END;
$$ LANGUAGE plpgsql;
