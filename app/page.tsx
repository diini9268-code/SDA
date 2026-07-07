export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-6 py-12 text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
          SSDU Website Foundation
        </p>
        <div className="max-w-3xl space-y-5">
          <h1 className="text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            Somali Student Diplomacy Union
          </h1>
          <p className="text-lg leading-8 text-slate-700">
            The project is configured as a full-stack Next.js App Router
            application with strict TypeScript, Tailwind CSS, Prisma, ESLint,
            and Vitest ready for incremental SSDU feature development.
          </p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5">
            <dt className="text-sm font-medium text-slate-500">Frontend</dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              Next.js App Router
            </dd>
          </div>
          <div className="border border-slate-200 bg-white p-5">
            <dt className="text-sm font-medium text-slate-500">Database</dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              Prisma with PostgreSQL
            </dd>
          </div>
          <div className="border border-slate-200 bg-white p-5">
            <dt className="text-sm font-medium text-slate-500">Quality</dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              Lint, typecheck, test, build
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
