# Somali Diplomacy Association Website

Official Somali Diplomacy Association public website and administrator content
management system.

## Getting Started

Install dependencies and configure local environment variables:

```bash
npm install
cp .env.example .env
```

In PowerShell, use `Copy-Item .env.example .env` instead of `cp` if needed.

Set `DATABASE_URL`, `DIRECT_URL`, and a long random `JWT_SECRET` in `.env`.
For production, `JWT_SECRET` must be at least 32 characters.

Prepare Prisma and create the first administrator account:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run admin:create
```

`npm run admin:create` reads `ADMIN_FULL_NAME`, `ADMIN_EMAIL`, and
`ADMIN_PASSWORD` from the environment. The password is stored with the same
scrypt hash format used by the login system.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. Use
`/admin` for administrator content management after signing in.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run prisma:validate
```

## Production Readiness

Run the deployment readiness check with production-like environment variables:

```bash
npm run deploy:check
```

The app also exposes a health endpoint:

```text
GET /api/health
```

## Project Docs

Read these before implementation work:

- `docs/ARCHITECTURE.md`
- `docs/CONSTRAINTS.md`
- `docs/PROJECT_SETUP.md`
- `docs/PROJECT_DEFINITION.md`
- `docs/DEVELOPMENT_PLAN.md`
- `docs/DEPLOYMENT.md`
- `docs/MVP_ACCEPTANCE.md`

This project uses Next.js 16. Read the relevant local guide in
`node_modules/next/dist/docs/` before changing Next.js-specific code.

## Deployment

The intended production target is Vercel with Supabase PostgreSQL. Store all
production secrets in the hosting provider environment, not in source control.
Use `docs/DEPLOYMENT.md` for the deployment checklist.
