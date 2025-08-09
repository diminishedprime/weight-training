# Deployment Guide

## Quick Start - Use the Interactive Script

**TL;DR: Just run this command and follow the prompts:**

```sh
./scripts/help-me-deploy
```

This interactive script will guide you through the entire deployment process
step by step, automatically handling git operations and database migrations
while asking for confirmation on manual steps like testing and Vercel promotion.

---

## Manual Process (for reference)

If you prefer to do the deployment manually or need to understand the individual
steps, here's the detailed process:

Before promoting to production, you should do the following:

1. Deploy the changes into the nextjs-main branch
2. Switch and pull:
   ```sh
   git switch nextjs-main; git pull
   ```
3. Apply Database migrations:
   ```sh
   ./scripts/push-supabase-preview
   ```
4. Check out the new features are working: [weight-training-preview.vercel.app]

After testing it's working locally, to promote to production:

1. In vercel, find the deployment that went into the nextjs-main branch in [deployments]
2. Click the ... and then click "promote to production". This will start a
   build, once finished, you will want to run database migrations.
3. Apply Database migrations in prod:
   ```sh
   ./scripts/push-supabase-production
   ```

Note: You can do steps 2 and 3 out of order depending on the database
migrations, you need to use your brain to determine what to do there.

## Making & Viewing Changes

Changes should be done via the normal GitHub merge request flow. After merging
changes into the main branch (`nextjs-main` at the time of writing), vercel will
automatically deploy to the "preview" environment:

[weight-training-preview.vercel.app]

## Database Changes

I'd like to eventually automate this more, but currently, the way to push new
database migrations is the:

```sh
./scripts/push-supabase-preview
```

This script requires `.env.preview` to be populated (though technically just the
`$SUPABASE_PASSWORD` env var). If you have access to the vercel project you can
do this with the following command:

```sh
pnpx vercel env pull --environment preview .env.preview
```

This will create a .env.preview file populated with the values from the current
preview environment. You can take a look at the tables and visually check them
here:

[supabase weight-training-preview]

## Production Resources

- [weight-training.vercel.app]
- [supabase weight-training-prod]

You can also go directly to the supabase page for production: [supabase weight-training prod]

[weight-training deployments]: https://vercel.com/matt-hamricks-projects/weight-training/deployments
[supabase weight-training-preview]: https://supabase.com/dashboard/project/leskawvztqgednedbbme
[supabase weight-training-prod]: https://supabase.com/dashboard/project/odjssskczrcunccrwxeh
[weight-training-preview.vercel.app]: https://weight-training-preview.vercel.app
[weight-training.vercel.app]: https://weight-training.vercel.app
[deployments]: https://vercel.com/matt-hamricks-projects/weight-training/deployments
