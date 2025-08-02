CREATE OR REPLACE FUNCTION public.save_form_draft (
  p_user_id uuid,
  p_page_path text,
  p_form_data jsonb,
  p_ttl_days integer DEFAULT 7
) RETURNS void AS $$
BEGIN
  INSERT INTO public.form_drafts (user_id, page_path, form_data, expires_at)
    VALUES (
      p_user_id, 
      p_page_path, 
      p_form_data, 
      timezone('utc', now()) + (p_ttl_days || ' days')::interval
    )
    ON CONFLICT (user_id, page_path) DO UPDATE
      SET form_data = EXCLUDED.form_data,
          expires_at = timezone('utc', now()) + (p_ttl_days || ' days')::interval;
END;
$$ LANGUAGE plpgsql;
