# Contributing

## Local Setup

For local set up, you'll need to set up necessary environment variables via an `.env.local` file.

### Environment Variables

```sh
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...

### Start DB specific secrets
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
### End DB specific secrets
```

#### AUTH_SECRET

To generate an AUTH_SECRET:

```sh
pnpx auth secret
```

#### AUTH_GOOGLE_ID

To get the AUTH_GOOGLE_ID, see the [weight-training-nextjs-test] credentials page.

#### AUTH_GOOGLE_SECRET

The AUTH_GOOGLE_SECRET can be obtained via [secret-manager].

#### DB Specific Secrets

Running `pnpx supabase start` will show you the values you need. For the
`SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`, they will be the `API URL` value.
For the `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, they
will be the `service_role key` and `anon key`

### Running Locally

After setting up the auth, to run the app:

```sh
pnpm run dev
```

## Staging Setup

[weight-training-nextjs-test]: https://console.cloud.google.com/apis/credentials?inv=1&invt=AbyXSA&project=weight-training-nextjs-test
[secret-manager]: https://console.cloud.google.com/security/secret-manager/secret/oauth-secret-test/versions?inv=1&invt=AbyXSA&project=weight-training-nextjs-test
