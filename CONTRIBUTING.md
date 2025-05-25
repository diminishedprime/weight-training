# Contributing

## Local Setup

For local set up, you'll need to set up necessary environment variables via an `.env.local` file.

### Environment Variables

```sh
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...

### Start DB specific secrets
POSTGRES_URL=...
POSTGRES_USER=...
POSTGRES_HOST=...
SUPABASE_JWT_SECRET=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
POSTGRES_PRISMA_URL=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
POSTGRES_URL_NON_POOLING=...
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

[weight-training-nextjs-test]: https://console.cloud.google.com/apis/credentials?inv=1&invt=AbyXSA&project=weight-training-nextjs-test
[secret-manager]: https://console.cloud.google.com/security/secret-manager/secret/oauth-secret-test/versions?inv=1&invt=AbyXSA&project=weight-training-nextjs-test


#### DB Specific Secrets

https://vercel.com/matt-hamricks-projects/~/stores/integration/supabase/store_0MdTj18xYFqzSeYQ/guides

All of the data base specific secrets can be found via [this vercel supabase integration]

[this vercel supabase integration]: https://vercel.com/matt-hamricks-projects/~/stores/integration/supabase/store_0MdTj18xYFqzSeYQ/guides

### Running Locally

After setting up the auth, to run the app:

```sh
pnpm run dev
```

### Supabase Stuff

> Not all of this is 100% yet, some of this is still just a bit of 'guess and check'

To install the supabase cli which is used for db migration, etc:

```sh
brew install supabase/tap/supabase
```

To run migrations to get your test db set up and working correctly.

(question, do I need this is contributing, or is this something that'd only be necessary if we're doing local database dev vs a "test" integration-ey server)

```sh
supabase link --project-ref abxslwnvvuatnyxglejc
supabase db push
```
