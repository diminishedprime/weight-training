CREATE OR REPLACE FUNCTION _system.create_test_user (
  p_id uuid,
  p_email text,
  p_create_preferences boolean
) RETURNS void AS $$
BEGIN
  INSERT INTO next_auth.users (id, name, email, "emailVerified", image)
  VALUES (p_id, p_email, p_email, NOW(), 'https://example.com/avatar.png');

  IF p_create_preferences THEN
    PERFORM public.set_user_preferences (
      p_user_id => p_id,
      p_preferred_weight_unit => 'pounds',
      p_default_rest_time => 120,
      p_available_plates_lbs => ARRAY[45, 35, 25, 10, 5, 2.5]::numeric[],
      p_available_dumbbells_lbs => ARRAY[50, 40, 30, 20, 10]::numeric[],
      p_available_kettlebells_lbs => ARRAY[18, 26, 35, 44, 53]::numeric[]
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
