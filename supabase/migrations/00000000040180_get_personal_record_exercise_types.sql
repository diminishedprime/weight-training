CREATE OR REPLACE FUNCTION public.get_personal_record_exercise_types (p_user_id uuid) RETURNS SETOF exercise_type_enum AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT h.exercise_type
  FROM public.personal_record_history h
  WHERE h.user_id = p_user_id
  ORDER BY h.exercise_type;
END;
$$ LANGUAGE plpgsql STABLE;
