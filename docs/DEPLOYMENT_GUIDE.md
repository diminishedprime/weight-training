# Deployment Guide

## Vercel

To deploy the UI, first create a merge request flow and merge into the main branch.

Assuming your changes didn't break anything, you can then promote the preview
deployment that was generated from the merge-request flow via [weight-training
deployments]

## Supabase

If you made any supabase changes, you'll also need to deploy those. To do so:

```sh
pnpx supabase db push
```

This assumes that you have linked the project correctly. It will also require
the database password which is saved in 1Password.

You can also go directly to the supabase page for production: [supabase weight-training prod]

[weight-training deployments]: https://vercel.com/matt-hamricks-projects/weight-training/deployments
[supabase weight-training prod]: https://supabase.com/dashboard/project/odjssskczrcunccrwxeh
