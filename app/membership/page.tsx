import Link from "next/link";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { PublicHeader } from "@/app/_components/public-shell";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Membership",
  description:
    "View the SSDU membership dashboard, diplomatic calendar, archive access, and union updates.",
  path: "/membership",
});

const metrics = [
  {
    icon: "DOC",
    value: "12",
    label: "Papers Contributed",
  },
  {
    icon: "CAL",
    value: "08",
    label: "Events Attended",
  },
  {
    icon: "NET",
    value: "45",
    label: "Mentorship Hours",
  },
  {
    icon: "SEC",
    value: "Lvl 3",
    label: "Archive Access",
  },
];

const calendarEvents = [
  {
    month: "NOV",
    day: "14",
    title: "2024 Youth Diplomacy Summit",
    location: "Mogadishu Peace Center (Hybrid)",
    status: "RSVP Now",
    active: true,
  },
  {
    month: "DEC",
    day: "02",
    title: "Regional Chapter Meeting: London",
    location: "Digital Plenary Hall",
    status: "Registration Closed",
    active: false,
  },
];

const archiveItems = [
  {
    label: "Policy Paper",
    time: "2 days ago",
    title: "Maritime Security in the Horn of Africa",
    summary:
      "An analytical review of contemporary maritime jurisdiction frameworks and their implications for regional stability i...",
    accent: "#f9d28b",
  },
  {
    label: "Case Study",
    time: "1 week ago",
    title: "Diplomatic Education: A Modern Blueprint",
    summary:
      "Evaluating the integration of digital tools and diaspora engagement in the curriculum of the Somali School of...",
    accent: "#bfd9ff",
  },
];

const actions = [
  "Update Profile",
  "Access Archive",
  "Contact Mentor",
  "Membership Renewal",
];

function DashboardFooter() {
  return (
    <footer className="bg-[#000613] text-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 md:grid-cols-4 md:px-16">
        <div>
          <h2 className="font-serif text-2xl font-bold">SSDU</h2>
          <p className="mt-7 text-base leading-7 text-white/72">
            Empowering the next generation of Somali diplomatic leaders through
            academic rigor and union fellowship.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">Quick Links</h2>
          <ul className="mt-7 space-y-4 text-base text-white/72">
            <li>
              <Link href="/about" className="hover:text-white hover:underline">
                About the Union
              </Link>
            </li>
            <li>
              <Link href="/leadership" className="hover:text-white hover:underline">
                Member Directory
              </Link>
            </li>
            <li>
              <Link href="/programs" className="hover:text-white hover:underline">
                Annual Summit
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white hover:underline">
                Research Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">Contact Info</h2>
          <address className="mt-7 space-y-4 text-base not-italic text-white/72">
            <p>secretariat@ssdu.org</p>
            <p>+252 (0) 61 XXXXXXX</p>
          </address>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">Social Media</h2>
          <div className="mt-7 flex gap-4">
            <span className="flex size-11 items-center justify-center rounded-full border border-white/40 text-sm">
              GH
            </span>
            <span className="flex size-11 items-center justify-center rounded-full border border-white/40 text-sm">
              SH
            </span>
          </div>
          <p className="mt-7 text-sm leading-6 text-white/62">
            &copy; 2024 Somali Student Diplomacy Union. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#000613]">
      <PublicHeader activeHref="/membership" />
      <main className="px-6 pb-20 pt-[169px] md:px-16 md:pt-32">
        <div className="mx-auto max-w-[1280px]">
          <section className="rounded-xl border border-[#c4cbd3] bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="rounded-full border-8 border-[#e8f1f8] p-1">
                  <div className="relative size-24 overflow-hidden rounded-full">
                    <OptimizedFillImage
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80"
                      alt="Ahmed Abdi profile portrait"
                      className="h-full w-full object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="font-serif text-4xl font-black leading-tight text-[#001440] sm:text-5xl">
                    Ahmed Abdi
                  </h1>
                  <p className="mt-3 text-lg text-[#20242a]">
                    Associate Fellow <span aria-hidden="true">•</span> Faculty
                    of International Relations
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-left md:text-right">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#9ee8b8] bg-[#d8ffe5] px-5 py-2 text-sm font-semibold tracking-[0.12em] text-[#0b6131]">
                  <span className="size-2 rounded-full bg-[#21c45d]" />
                  Diplomatic Status: Active
                </div>
                <Link
                  href="/contact"
                  className="block text-sm font-semibold tracking-[0.12em] text-[#000613] hover:underline"
                >
                  Manage Credentials
                </Link>
              </div>
            </div>
          </section>

          <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_400px]">
            <div>
              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="rounded-lg border border-[#c4cbd3] bg-[#f8f9fa] p-7"
                  >
                    <p className="text-xs font-bold text-[#00639c]">{metric.icon}</p>
                    <p className="mt-4 font-serif text-3xl font-bold leading-none">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em]">
                      {metric.label}
                    </p>
                  </article>
                ))}
              </section>

              <section className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="font-serif text-4xl font-black">
                    Diplomatic Calendar
                  </h2>
                  <Link
                    href="/programs"
                    className="text-sm font-semibold tracking-[0.12em] text-[#00639c] hover:underline"
                  >
                    View All Events
                  </Link>
                </div>
                <div className="mt-7 space-y-4">
                  {calendarEvents.map((event) => (
                    <article
                      key={event.title}
                      className="flex flex-col gap-5 rounded-lg border border-[#c4cbd3] bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-6">
                        <div
                          className={`flex size-16 shrink-0 flex-col items-center justify-center rounded-lg ${
                            event.active
                              ? "bg-[#002e5f] text-white"
                              : "bg-[#e1e3e4] text-[#6b7280]"
                          }`}
                        >
                          <span className="text-xs">{event.month}</span>
                          <span className="font-serif text-2xl font-bold leading-none">
                            {event.day}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-serif text-2xl text-[#000613]">
                            {event.title}
                          </h3>
                          <p className="mt-2 text-base text-[#191c1d]">
                            {event.location}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={!event.active}
                        className="h-11 rounded-md border border-[#000613] px-7 text-sm font-semibold tracking-[0.16em] text-[#000613] transition enabled:hover:bg-[#000613] enabled:hover:text-white disabled:cursor-not-allowed disabled:border-[#c4cbd3] disabled:text-[#9aa0a6]"
                      >
                        {event.status}
                      </button>
                    </article>
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-serif text-4xl font-black">
                    Latest from Archive
                  </h2>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#40acfe] px-8 text-sm font-semibold tracking-[0.12em] text-[#002e5f] transition hover:bg-[#7fc8ff]"
                  >
                    Submit Research
                  </Link>
                </div>
                <div className="mt-7 grid gap-6 md:grid-cols-2">
                  {archiveItems.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-lg border border-[#c4cbd3] bg-white p-7"
                      style={{ borderLeft: `4px solid ${item.accent}` }}
                    >
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.1em] text-[#5c636b]">
                        <span className="rounded bg-[#d7ecff] px-3 py-1 text-[#00639c]">
                          {item.label}
                        </span>
                        <span>{item.time}</span>
                      </div>
                      <h3 className="mt-5 font-serif text-2xl leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-lg leading-7 text-[#30353b]">
                        {item.summary}
                      </p>
                      <Link
                        href="/blog"
                        className="mt-7 inline-flex text-sm font-bold tracking-[0.12em] hover:underline"
                      >
                        Read Full Paper
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-7">
              <section className="rounded-xl bg-[#002e5f] p-8 text-white">
                <h2 className="font-serif text-3xl font-bold text-[#f9d28b]">
                  Quick Actions
                </h2>
                <div className="mt-7 grid gap-4">
                  {actions.map((action, index) => (
                    <Link
                      key={action}
                      href={index === 1 ? "/archive" : "/contact"}
                      className={`flex min-h-14 items-center justify-between rounded-md px-5 text-lg font-semibold ${
                        index === actions.length - 1
                          ? "border border-[#f9d28b]/50 bg-transparent"
                          : "bg-white/8 hover:bg-white/14"
                      }`}
                    >
                      <span>{action}</span>
                      <span className="text-[#f9d28b]">{index + 1}</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#c4cbd3] bg-[#e1e3e4] p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-3xl text-[#000613]">
                    Notifications
                  </h2>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#c9222a] text-xs font-bold text-white">
                    2
                  </span>
                </div>
                <div className="mt-7 space-y-4">
                  <article className="rounded-lg border-l-4 border-[#00639c] bg-white p-5">
                    <h3 className="text-lg font-bold">
                      New Archive Access Granted
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-[#30353b]">
                      Lvl 3 Security Clearance approved by Research Board.
                    </p>
                    <p className="mt-2 text-xs text-[#6b7280]">2 hours ago</p>
                  </article>
                  <article className="rounded-lg bg-white/55 p-5">
                    <h3 className="text-lg font-bold text-[#5c636b]">
                      Submission Under Review
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-[#5c636b]">
                      Your paper &quot;Regional Water Rights&quot; is currently
                      in peer review.
                    </p>
                    <p className="mt-2 text-xs text-[#7c838a]">Yesterday</p>
                  </article>
                </div>
                <Link
                  href="/contact"
                  className="mt-7 block text-center text-sm font-semibold tracking-[0.12em] text-[#00639c] hover:underline"
                >
                  Clear All Alerts
                </Link>
              </section>

              <section className="relative overflow-hidden rounded-xl bg-[#002e5f] text-white">
                <OptimizedFillImage
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80"
                  alt="Union reference library book"
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 400px, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,6,19,0.2),rgba(0,31,63,0.96))]" />
                <div className="relative min-h-[190px] p-8" />
                <div className="relative p-8 pt-0">
                  <h2 className="font-serif text-2xl font-bold">
                    Union Reference Library
                  </h2>
                  <p className="mt-2 text-sm font-semibold">
                    Exclusive member access to 5,000+ digital volumes
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <DashboardFooter />
    </div>
  );
}
