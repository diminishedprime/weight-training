CREATE OR REPLACE FUNCTION public.update_perceived_effort (
  p_user_id uuid,
  p_exercise_id uuid,
  p_perceived_effort perceived_effort_enum DEFAULT NULL
) RETURNS void AS $$
BEGIN
  UPDATE public.exercises
    SET perceived_effort = p_perceived_effort
  WHERE id = p_exercise_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql VOLATILE;
