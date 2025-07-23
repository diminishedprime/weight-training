CREATE OR REPLACE FUNCTION _system.cleanup_expired_form_drafts () RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.form_drafts
    WHERE expires_at <= timezone('utc', now());
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
