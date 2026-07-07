# Project Setup

## Recommended Stack

### Full-Stack Application

- Next.js App Router
- TypeScript
- React Server Components where practical
- Route Handlers for backend API endpoints
- Server Actions where they simplify form workflows
- Tailwind CSS for styling

### Database

- Supabase PostgreSQL
- Prisma ORM
- Prisma migrations for schema changes

### Authentication

- JWT-based authentication
- Role-based authorization
- Secure HTTP-only cookies for administrator sessions

### Hosting

- Application: Vercel
- Database: Supabase PostgreSQL

## Suggested Repository Structure

```text
ssdu-website/
  docs/
    ARCHITECTURE.md
    CONSTRAINTS.md
    PROJECT_DEFINITION.md
    PROJECT_SETUP.md
    DEVELOPMENT_PLAN.md
  prisma/
    schema.prisma
    migrations/
  src/
    app/
      api/
      admin/
      globals.css
      layout.tsx
      page.tsx
    components/
      ui/
      layout/
      forms/
    features/
      auth/
      leadership/
      programs/
      blog/
      archive/
      membership/
      contact/
      reports/
      admin/
    lib/
      auth/
      db/
      validations/
      constants/
      utils/
    types/
  public/
    images/
  .env.example
  next.config.ts
  package.json
  tsconfig.json
  README.md
  docs/DEPLOYMENT.md
```

## Application Direction

Use one Next.js TypeScript codebase for both frontend and backend functionality.

- UI pages live in `src/app`.
- Backend endpoints live in `src/app/api`.
- Shared server-side business logic lives in `src/lib`.
- Domain-specific UI and logic live in `src/features`.
- Prisma schema and migrations live in `prisma`.

## Recommended Feature Areas

- `auth`
- `leadership`
- `programs`
- `blog`
- `archive`
- `membership`
- `contact`
- `reports`
- `admin`

## Backend Direction in Next.js

Use Next.js Route Handlers instead of a separate Express server.

Recommended API areas:

- `src/app/api/auth`
- `src/app/api/leadership`
- `src/app/api/programs`
- `src/app/api/blog`
- `src/app/api/archive`
- `src/app/api/membership`
- `src/app/api/contact`
- `src/app/api/reports`
- `src/app/api/admin`

Keep validation, authorization, and Prisma access outside route files where possible. Route handlers should remain lightweight and delegate business logic to server-side modules.

## Environment Variables

```text
NODE_ENV=
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
NEXT_PUBLIC_APP_URL=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
UPLOAD_MAX_SIZE_MB=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

For Supabase:

- `DATABASE_URL` should use the Supabase pooled connection for application runtime.
- `DIRECT_URL` should use the direct database connection for Prisma migrations.

Do not commit real secrets. Use local `.env` files for development and Vercel/Supabase secret management in production.

## Setup Sequence

1. Initialize the Next.js TypeScript application.
2. Configure Tailwind CSS and shared styling.
3. Configure Prisma with Supabase PostgreSQL.
4. Define database models and relationships in `prisma/schema.prisma`.
5. Generate the Prisma client.
6. Create administrator authentication and authorization helpers.
7. Implement leadership, programs, blog, archive, membership, and contact modules.
8. Build the administrator dashboard and content management features.
9. Implement reports and analytics.
10. Configure blog-owned media upload and storage.
11. Add tests for validation, authorization, and core website functionality.
12. Configure Vercel deployment and Supabase production environment variables.

## Development Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run deploy:check
npx prisma generate
npx prisma migrate dev
```

## Development Quality Checks

Before finalizing implementation changes:

- Run TypeScript checks.
- Run linting.
- Run Prisma schema validation.
- Verify administrator authentication and authorization.
- Verify membership application submission.
- Verify contact form validation.
- Verify blog, program, and archive management.
- Verify reports and analytics using actual database records.
- Verify blog-owned media upload validation.
- Confirm responsive behavior across supported devices.
- Confirm `/api/health`, `/robots.txt`, and `/sitemap.xml` respond in production.
