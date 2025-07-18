CREATE OR REPLACE FUNCTION public.save_form_draft (
  p_user_id uuid,
  p_form_type text,
  p_form_data jsonb,
  p_ttl_days integer DEFAULT 7
) RETURNS void AS $$
BEGIN
  INSERT INTO public.form_drafts (user_id, form_type, form_data, expires_at)
    VALUES (
      p_user_id, 
      p_form_type, 
      p_form_data, 
      timezone('utc', now()) + (p_ttl_days || ' days')::interval
    )
    ON CONFLICT (user_id, form_type) DO UPDATE
      SET form_data = EXCLUDED.form_data,
          updated_at = timezone('utc', now()),
          expires_at = timezone('utc', now()) + (p_ttl_days || ' days')::interval;
END;
$$ LANGUAGE plpgsql;
