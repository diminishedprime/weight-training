# Contributing

## Local Setup

For local set up, you'll need to set up necessary environment variables via an `.env.local` file.

### Environment Variables

```sh
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
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

### Running Locally

After setting up the auth, to run the app:

```sh
pnpm run dev
```
