CREATE TABLE IF NOT EXISTS next_auth.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT email_unique UNIQUE (email)
);

-- This is something weird and custom I added that we should be able to get rid
-- of after we deploy to production. It's needed so that we can easily add in
-- steph & matt's lifts by giving them a specific uuid. Once we get this
-- deployed in prod, we can remove this custom code.
CREATE OR REPLACE FUNCTION next_auth.get_deterministic_uuid (email_address text) RETURNS uuid AS $$
BEGIN
  CASE email_address
    WHEN 'stephaniebpena@gmail.com' THEN 
      RETURN 'd6e4a8a4-a0c1-4760-9512-a569473fe162'::uuid;
    WHEN 'matthewjhamrick@gmail.com' THEN 
      RETURN '97097295-6eb1-4824-8bfa-8984cf9bea6b'::uuid;
    ELSE
      RAISE EXCEPTION 'get_deterministic_uuid should only be called with matt or stephs email.';
  END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION next_auth.set_user_uuid () RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IN ('stephaniebpena@gmail.com', 'matthewjhamrick@gmail.com') THEN
    NEW.id := next_auth.get_deterministic_uuid(NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_user_uuid BEFORE INSERT ON next_auth.users FOR EACH ROW
EXECUTE FUNCTION next_auth.set_user_uuid ();

GRANT ALL ON TABLE next_auth.users TO postgres;

GRANT ALL ON TABLE next_auth.users TO service_role;

CREATE FUNCTION next_auth.uid () RETURNS uuid LANGUAGE sql STABLE AS $$
  select
    coalesce(
      nullif(current_setting('request.jwt.claim.sub', true), ''),
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  expires timestamp with time zone NOT NULL,
  "sessionToken" text NOT NULL,
  "userId" uuid,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessionToken_unique UNIQUE ("sessionToken"),
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.sessions TO postgres;

GRANT ALL ON TABLE next_auth.sessions TO service_role;

CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  "userId" uuid,
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT provider_unique UNIQUE (provider, "providerAccountId"),
  CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.accounts TO postgres;

GRANT ALL ON TABLE next_auth.accounts TO service_role;

CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier text,
  token text,
  expires timestamp with time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (token),
  CONSTRAINT token_unique UNIQUE (token),
  CONSTRAINT token_identifier_unique UNIQUE (token, identifier)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;

GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;
