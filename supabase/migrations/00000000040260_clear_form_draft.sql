CREATE OR REPLACE FUNCTION public.clear_form_draft (p_user_id uuid, p_form_type text) RETURNS void AS $$
BEGIN
  DELETE FROM public.form_drafts
    WHERE user_id = p_user_id
      AND form_type = p_form_type;
END;
$$ LANGUAGE plpgsql;
