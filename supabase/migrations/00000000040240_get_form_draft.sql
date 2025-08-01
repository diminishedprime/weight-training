CREATE OR REPLACE FUNCTION public.get_form_draft (p_user_id uuid, p_page_path text) RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT form_data
    INTO result
    FROM public.form_drafts
    WHERE user_id = p_user_id
      AND page_path = p_page_path
      AND expires_at > timezone('utc', now());
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
