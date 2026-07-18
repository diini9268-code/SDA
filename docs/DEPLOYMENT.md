# Deployment

This guide prepares the SDA Website for production deployment on Vercel with
Supabase PostgreSQL.

## Production Environment Variables

Configure these in the hosting provider environment. Do not commit real values.

```text
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
JWT_EXPIRES_IN=8h
NEXT_PUBLIC_APP_URL=
REQUIRE_PRODUCTION_ENV_VALIDATION=true
ADMIN_FULL_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Optional variables reserved for later integrations:

```text
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
UPLOAD_MAX_SIZE_MB=10
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=blog-media
```

Requirements:

- `DATABASE_URL` should use the Supabase pooled runtime connection.
- `DIRECT_URL` should use the direct Supabase connection for migrations.
- `JWT_SECRET` must be a real random value with at least 32 characters.
- `NEXT_PUBLIC_APP_URL` must be the production site origin.
- `REQUIRE_PRODUCTION_ENV_VALIDATION` should be `true` in production.

## Supabase

1. Create or select the production Supabase PostgreSQL project.
2. Add the runtime pooled URL as `DATABASE_URL`.
3. Add the direct database URL as `DIRECT_URL`.
4. Run migrations against production:

```bash
npm run prisma:generate
npm run prisma:migrate:status
npx prisma migrate deploy
```

5. Create the first administrator account after env vars are configured:

```bash
npm run admin:create
```

The admin creation script reads `ADMIN_FULL_NAME`, `ADMIN_EMAIL`, and
`ADMIN_PASSWORD` from environment variables and stores a scrypt password hash.

## Vercel

Recommended settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: managed by Next.js
- Runtime: Node.js

Before deploying, run:

```bash
npm run deploy:check
npm run typecheck
npm run lint
npm run test
npm run prisma:validate
npm run build
```

## Health Check

The app exposes:

```text
GET /api/health
```

It returns `200` when the app can reach the database and `503` when the
database check fails. It does not expose connection strings, credentials, or
database error details.

## Post-Deployment Checklist

- Visit `/api/health` and confirm `status` is `ok`.
- Visit `/robots.txt` and `/sitemap.xml`.
- Log in at `/admin`.
- Create or verify leadership, programs, blog, archive, membership, and contact
  workflows.
- Open `/admin/reports` and confirm aggregate metrics load.
- Confirm unauthenticated users cannot open `/admin` or `/api/admin/*`.
- Submit the public membership and contact forms with test data.

## Rollback Notes

If a deployment fails:

- Revert the Vercel deployment to the previous successful build.
- Do not roll back database migrations unless a specific migration rollback has
  been reviewed and tested.
- Keep production secrets in the hosting provider; never move them into source
  control.
