CREATE OR REPLACE FUNCTION public.clear_form_draft (p_user_id uuid, p_page_path text) RETURNS void AS $$
BEGIN
  DELETE FROM public.form_drafts
    WHERE user_id = p_user_id
      AND page_path = p_page_path;
END;
$$ LANGUAGE plpgsql;
