import Link from "next/link";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { PublicPageShell } from "@/app/_components/public-shell";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about SSDU's academic diplomacy mission, vision, values, policy research, educational programs, and diplomatic dialogue work.",
  path: "/about",
});

const values = [
  {
    icon: "▱",
    title: "Dialogue",
    description:
      "Fostering open, respectful, and constructive communication across diverse academic and cultural spectrums.",
  },
  {
    icon: "◇",
    title: "Integrity",
    description:
      "Upholding the highest ethical standards in research, representation, and professional conduct.",
  },
  {
    icon: "□",
    title: "Research",
    description:
      "Committing to evidence-based analysis and academic rigor in all our policy publications and archives.",
  },
  {
    icon: "♟",
    title: "Engagement",
    description:
      "Actively participating in community initiatives and international forums to represent Somali interests.",
  },
];

const researchItems = ["Quarterly Diplomatic Review", "Diaspora Impact Studies"];

export default function AboutPage() {
  return (
    <PublicPageShell activeHref="/about">
      <main className="bg-[#f7fafc] pt-20 text-[#181c1e]">
        <section className="border-b border-[#c4c6cf] bg-[#f7fafc]">
          <div className="mx-auto max-w-[1280px] px-6 py-24 md:px-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#00639c]">
              Established 2024
            </p>
            <h1 className="font-serif text-[32px] font-bold leading-[40px] text-[#000613] md:text-[48px] md:leading-[60px]">
              About SSDU
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#44474e]">
              The Somali Student Diplomacy Union is a premier academic
              institution dedicated to cultivating the next generation of
              diplomatic leaders, policy researchers, and cultural ambassadors
              within the Somali diaspora.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-6 px-6 py-20 md:grid-cols-2 md:px-16">
          <article className="rounded-md bg-[#002147] p-8 text-white">
            <div className="mb-8 text-2xl" aria-hidden="true">
              ⚑
            </div>
            <h2 className="font-serif text-2xl font-bold">Our Mission</h2>
            <p className="mt-4 text-sm leading-6 text-[#eef1f3]">
              To empower Somali students through rigorous diplomatic training,
              academic research, and global networking opportunities. We strive
              to create a structured platform where intellectual discourse and
              professional development converge to serve the interests of the
              Somali community worldwide.
            </p>
          </article>

          <article className="rounded-md border border-[#c4c6cf] bg-[#e5e9eb] p-8 text-[#181c1e]">
            <div className="mb-8 text-2xl text-[#00639c]" aria-hidden="true">
              ◎
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#000613]">
              Our Vision
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#44474e]">
              To become the leading global student authority on Somali
              international relations and cultural diplomacy, fostering a world
              where Somali youth are central participants in international
              policy-making and cross-border cooperation.
            </p>
          </article>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pb-20 md:px-16">
          <div className="text-center">
            <h2 className="font-serif text-[32px] font-bold leading-10 text-[#000613]">
              Our Core Values
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-20 bg-[#e9c176]" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-md border border-[#c4c6cf] bg-white p-7"
              >
                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-[#d6e3ff] text-[#00639c]">
                  <span aria-hidden="true">{value.icon}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#000613]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#44474e]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:grid-cols-[0.72fr_1.28fr] md:px-16">
            <div>
              <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-md shadow-lg">
                <OptimizedFillImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80"
                  alt="Professional portrait of a Somali student leader"
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
              </div>
              <p className="mt-4 font-serif text-base font-bold text-[#000613]">
                Dr. Ahmed Ali
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#00639c]">
                Founding Chairperson, SSDU
              </p>
            </div>

            <div>
              <div className="mb-4 font-serif text-5xl text-[#e9c176]" aria-hidden="true">
                &ldquo;
              </div>
              <blockquote className="max-w-3xl font-serif text-2xl italic leading-10 text-[#000613]">
                The strength of our nation lies in the intellect and diplomatic
                skill of its youth. At SSDU, we are not just studying
                diplomacy; we are practicing it. We are building the bridges
                that will connect Somalia&apos;s historical heritage with its
                bright, global future. Our work in research and dialogue is the
                cornerstone of a new era of Somali leadership.
              </blockquote>
              <p className="mt-8 max-w-3xl text-sm leading-7 text-[#44474e]">
                Under Dr. Ali&apos;s guidance, the Union has grown from a local
                student group into a recognized international body contributing
                to policy discussions at major global summits. His vision
                remains centered on the idea that knowledge is the most powerful
                tool for diplomatic progress.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f1f4f6] py-24">
          <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-6 md:grid-cols-2 md:px-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#00639c]">
                Operations 01
              </p>
              <h2 className="font-serif text-[32px] font-bold leading-10 text-[#000613]">
                Policy &amp; Research
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#44474e]">
                Our research division focuses on key areas of Somali domestic
                policy and international relations. We publish quarterly reports
                and maintain a digital archive of diplomatic documents
                accessible to all members. Our students work alongside seasoned
                analysts to produce high-impact white papers.
              </p>
              <ul className="mt-8 grid gap-4 text-sm text-[#44474e]">
                {researchItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="text-[#00639c]" aria-hidden="true">
                      ◎
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-[#c4c6cf] shadow-md">
                <OptimizedFillImage
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80"
                  alt="Policy research documents and notebooks"
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-24 grid max-w-[1280px] items-center gap-14 px-6 md:grid-cols-2 md:px-16">
            <div className="order-2 md:order-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md shadow-lg">
                <OptimizedFillImage
                  src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=80"
                  alt="International conference hall"
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#00639c]">
                Operations 02
              </p>
              <h2 className="font-serif text-[32px] font-bold leading-10 text-[#000613]">
                Educational Programs
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#44474e]">
                From negotiation workshops to Model UN participation, our
                programs are designed to provide practical experience. We host
                annual summits and monthly masterclasses led by former
                ambassadors and international law experts.
              </p>
              <Link
                href="/programs"
                className="mt-8 inline-flex text-xs font-semibold uppercase tracking-[0.08em] text-[#000613] hover:text-[#00639c]"
              >
                View Program Calendar →
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-24 grid max-w-[1280px] items-center gap-14 px-6 md:grid-cols-2 md:px-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#00639c]">
                Operations 03
              </p>
              <h2 className="font-serif text-[32px] font-bold leading-10 text-[#000613]">
                Diplomatic Dialogue
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#44474e]">
                We facilitate The Round Table, a monthly forum where students
                engage in moderated debates on current geopolitical events.
                These sessions are designed to sharpen rhetorical skills and
                promote the understanding of diverse viewpoints within the
                Somali global community.
              </p>
              <blockquote className="mt-8 border-l-4 border-[#e9c176] bg-white px-5 py-4 font-serif text-sm italic text-[#000613]">
                Where consensus is the goal, and rigorous debate is the path.
              </blockquote>
            </div>
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md shadow-lg">
                <OptimizedFillImage
                  src="https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1000&q=80"
                  alt="Diplomatic round table"
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#000613] px-6 py-20 text-center text-white md:px-16">
          <h2 className="font-serif text-[32px] font-bold leading-10">
            Ready to shape the future?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#eef1f3]">
            Join a community of scholars and future diplomats. Applications for
            the 2024 Fellowship are now open.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/membership"
              className="bg-[#ffdea5] px-8 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#000613]"
            >
              Apply for Membership
            </Link>
            <Link
              href="/contact"
              className="border border-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
