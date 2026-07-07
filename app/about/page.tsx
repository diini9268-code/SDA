import { PageIntro, PublicPageShell } from "@/app/_components/public-shell";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about SSDU's student diplomacy mission, public programs, leadership development, publications, and membership platform.",
  path: "/about",
});

const priorities = [
  "Student diplomacy and leadership development",
  "Public programs, dialogue, and civic engagement",
  "Publication of organizational updates and insights",
  "Membership pathways for students and partners",
];

export default function AboutPage() {
  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <section className="mx-auto grid max-w-6xl gap-10">
          <PageIntro
            eyebrow="About"
            title="A student platform for diplomacy, leadership, and public service."
            description="SSDU presents organizational programs, student leadership, blog updates, membership opportunities, and archived activities in one accessible public website."
          />

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Mission</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                SSDU supports students who want to understand diplomacy,
                develop leadership skills, and contribute to constructive civic
                conversations through organized programs and publications.
              </p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Platform</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                The website gives visitors a reliable place to follow SSDU
                activity, explore leadership, read updates, apply for
                membership, and contact the organization.
              </p>
            </article>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">
              Current priorities
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {priorities.map((priority) => (
                <li
                  key={priority}
                  className="rounded-md border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {priority}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
    </PublicPageShell>
  );
}
