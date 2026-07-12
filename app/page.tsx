import Link from "next/link";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  description:
    "SSDU advances Somali student diplomacy through policy insight, leadership development, and international engagement.",
  path: "/",
});

type InsightCard = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCAC130QuFwZkKk9c8l1X2idjNLXzebCC4ZvV7rz_NXoQP5QgnHDRzh3sh1HSw1tEdZc64HuJ_fUjfjzQJVGxbPjq4R740w7zt--DbR4NgZkMDYwoebGOoQDjoVYsUstgMyH1VCMG5EusRTNPLSM9-CRzCWdSxrLbN1ln1KgEd-Vk9W0d-LXh6y-C0rkVZMhtDsIRWXfv26Hgq2RertWviCXdT86iQsU2-6MM4KRm_cQKnN5M7bgVm-";

const embassyImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbzM95gXTre6vgshVZx4m9qicTf4XtogtO43kzN4RJy9LZfVTNNwkx2pAJpeyZ9FpkAc_igwYxy_sHLDasLNHelY0GrRaviYLJyEjG3Puc-moatNotdu7kNNNZz5ae1zoDN93zROitIg2JYwcYvj6sL7UQnmdB0JTZsHqGUCHfyekW_1CtLhTtta5kAizu8J7LxXWtErHAsYqEPBGSTRcmWPrG-_qeF365w4djk69oN2imXXI4rwRM";

const fallbackInsights: InsightCard[] = [
  {
    id: "policy-report",
    title: "Advancing Trade Agreements in the Horn of Africa",
    category: "Policy Report",
    excerpt:
      "An in-depth look at the shifting economic landscapes and the diplomatic hurdles of the upcoming summit...",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJBD7fdx7ZitLvWfmY-sZYgsdniO-BPFvUdXruzaTXj1uiMw0my2ahHr_ELhUWLa68wznMUFLrVUTtmXblMsJ0Js-tzaR0zQK-m_5h1EQUCknRp6wQ32tRpAhsFgGJsMwQSxMJo-N6MXTHnbNcy3tSKJg1DDAuq3FitTD93WH463Gti7ryvt02mpH6JIOyUDh-cpSU51beC9mMytkdCjipDeym8bbBAG0gfLcubIBl2CBVp2wUXbV6",
    imageAlt: "Formal policy document with a fountain pen",
    href: "/blog",
  },
  {
    id: "event-summary",
    title: "Highlights from the 2024 Diplomatic Gala",
    category: "Event Summary",
    excerpt:
      "Celebrating a decade of diplomatic excellence and the inauguration of our new Mogadishu headquarters...",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJd7F8sY7nXdiS6mMZcSQqkaLCVidz6W-epMLBQ8Bf8vzNSaGFuzo48-l8jQ06ZyFcKz3h5LSzOSMPvO4hyWKr6j3Uzw9wSW-lDL_EuaeEGLzv8XZGXFdhG3aLU20gN6ev1hKOnl2bUDeabkSBxdl8Oyb8zJqS80Z4fr1VzTjMy4jWLC41j8HUmX5WLxR2MQn1ZxWc7bQ5BKB258F4memqWaxdhjkmEkAGpZxvSc5TirENr7WvHFmQ",
    imageAlt: "International conference hall with seated delegates",
    href: "/programs",
  },
  {
    id: "intelligence",
    title: "The Future of Digital Diplomacy and Governance",
    category: "Intelligence",
    excerpt:
      "How emerging technologies are redefining the traditional roles of embassies and state-to-state communications...",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGFKQqQz7u_sRJa0mE6hO9l2jd2laRwAlQT9w7isRh_eDN5zgqTUXWP9Cm1lpMIYjSKfoJI2sYDARmb1PZdNVok7FMIUMBKK4-t4NE-WTP1qo9wKnJYxQapBJe1eig852A1ebh79dKuyFajzY8piW-evR0uS7rGaN9TaE9Ml5jZ7ECwzzHeyCfYgyvRtBb5UZwkJthRIkTUaMCMVBU5b6kmI2-LFAVtzrQ67xvGDYvW1E4h2kGyNTU",
    imageAlt: "Digital global diplomacy network map",
    href: "/blog",
  },
];

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/membership", label: "Membership" },
  { href: "/leadership", label: "Leadership" },
  { href: "/contact", label: "Contact" },
];

async function getInsights(): Promise<InsightCard[]> {
  try {
    const posts = await prismaBlogRepository.listPublic();

    if (posts.length === 0) {
      return fallbackInsights;
    }

    return posts.slice(0, 3).map((post, index) => {
      const media = post.media[0];

      return {
        id: post.id,
        title: post.title,
        category: post.category,
        excerpt:
          post.excerpt ??
          `${post.content.replace(/\s+/g, " ").slice(0, 125).trimEnd()}...`,
        imageUrl: media?.url ?? fallbackInsights[index]?.imageUrl ?? heroImage,
        imageAlt: media?.altText ?? post.title,
        href: `/blog/${post.slug}`,
      };
    });
  } catch {
    return fallbackInsights;
  }
}

function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#c3c6d1] bg-[#fcf9f8]">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-6 px-6 md:px-16">
        <Link
          href="/"
          className="font-serif text-3xl font-bold text-[#001e40]"
          aria-label="SSDU home"
        >
          SSDU
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/"
                  ? "border-b-2 border-[#775a19] py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#001e40]"
                  : "py-2 text-sm font-medium text-[#43474f] transition-colors hover:text-[#775a19]"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="hidden p-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#001e40] hover:text-[#775a19] sm:block"
          >
            Search
          </Link>
          <Link
            href="/admin"
            className="bg-[#001e40] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#003366]"
          >
            Admin Login
          </Link>
        </div>
      </div>

      <nav
        className="border-t border-[#c3c6d1] bg-[#fcf9f8] px-4 py-3 md:hidden"
        aria-label="Mobile primary"
      >
        <ul className="flex gap-5 overflow-x-auto text-xs font-semibold uppercase tracking-[0.12em] text-[#43474f]">
          {navigationItems.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[#303436] bg-[#1c1b1b] pt-20 text-[#fcf9f8]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-6 md:grid-cols-4 md:px-16">
        <div>
          <span className="mb-4 block font-serif text-3xl font-bold text-[#ffdea5]">
            SSDU
          </span>
          <p className="leading-7 text-[#e5e2e1]">
            Elevating Somali student diplomacy through policy innovation,
            leadership development, and professional excellence.
          </p>
          <div className="mt-8 flex gap-4">
            {["Globe", "Mail", "News"].map((label) => (
              <Link
                key={label}
                href="/contact"
                className="flex size-10 items-center justify-center border border-[#737780] text-xs hover:border-[#e9c176]"
              >
                {label.slice(0, 2)}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-8 font-serif text-2xl font-semibold">Navigation</h2>
          <ul className="space-y-4 text-[#e5e2e1]">
            <li>
              <Link href="/about" className="hover:text-[#fed488]">
                Strategic Mission
              </Link>
            </li>
            <li>
              <Link href="/leadership" className="hover:text-[#fed488]">
                Leadership Board
              </Link>
            </li>
            <li>
              <Link href="/programs" className="hover:text-[#fed488]">
                Annual Conference
              </Link>
            </li>
            <li>
              <Link href="/archive" className="hover:text-[#fed488]">
                Resource Archive
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-8 font-serif text-2xl font-semibold">Governance</h2>
          <ul className="space-y-4 text-[#e5e2e1]">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Press Kit</li>
            <li>Careers</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-8 font-serif text-2xl font-semibold">Newsletter</h2>
          <p className="mb-4 text-sm leading-6 text-[#e5e2e1]">
            Newsletter subscription is not connected yet. Contact SSDU for
            publication updates.
          </p>
          <div className="grid gap-2">
            <input
              className="border-0 bg-[#303436] px-4 py-3 text-[#fcf9f8]"
              placeholder="Professional Email"
              type="email"
              disabled
              aria-label="Professional email"
            />
            <Link
              href="/contact"
              className="bg-[#775a19] py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white hover:brightness-110"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-[1280px] border-t border-[#737780]/20 px-6 py-8 md:px-16">
        <p className="text-sm text-[#e5e2e1]">
          &copy; 2024 Somali Student Diplomacy Union. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function InsightArticle({ insight }: { insight: InsightCard }) {
  return (
    <article className="flex flex-col border border-[#c3c6d1] bg-[#fcf9f8] transition-colors hover:border-[#001e40]">
      <div className="relative h-64">
        <OptimizedFillImage
          src={insight.imageUrl}
          alt={insight.imageAlt}
          className="h-full w-full object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="flex grow flex-col p-8">
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#775a19]">
          {insight.category}
        </span>
        <h3 className="mb-4 font-serif text-2xl font-semibold leading-snug text-[#001e40]">
          {insight.title}
        </h3>
        <p className="mb-8 text-sm leading-6 text-[#43474f]">{insight.excerpt}</p>
        <Link
          href={insight.href}
          className="mt-auto text-xs font-semibold uppercase tracking-[0.14em] text-[#001e40] hover:text-[#775a19]"
        >
          Read Full Brief
        </Link>
      </div>
    </article>
  );
}

export default async function Home() {
  const insights = await getInsights();

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <SiteHeader />
      <main className="pt-[129px] md:pt-20">
        <section className="relative flex min-h-[819px] items-center overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedFillImage
              src={heroImage}
              alt="Grand diplomatic hall with formal seating"
              className="h-full w-full object-cover brightness-[0.42]"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 text-[#fcf9f8] md:px-16">
            <div className="max-w-2xl border-l-4 border-[#775a19] pl-8">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ffdea5]">
                Established 2024
              </span>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.08] tracking-tight md:text-[64px]">
                Fostering Excellence in Somali Diplomacy
              </h1>
              <p className="mt-8 text-lg leading-8 text-[#e5e2e1]">
                The Somali Student Diplomacy Union is dedicated to advancing
                student policy standards and representing the interests of
                Somali diplomatic leadership on the global stage.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/about"
                  className="bg-[#775a19] px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white hover:brightness-110"
                >
                  Explore Our Mission
                </Link>
                <Link
                  href="/blog"
                  className="border border-white px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#001e40]"
                >
                  Annual Report
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fcf9f8] py-20">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-6 md:grid-cols-12 md:px-16">
            <div className="md:col-span-6">
              <h2 className="font-serif text-4xl font-semibold leading-tight text-[#001e40] md:text-5xl">
                An Institution Built on Strategic Neutrality
              </h2>
              <p className="mt-8 leading-7 text-[#43474f]">
                Founded to bridge tradition and modern geopolitical
                requirements, SSDU provides a rigorous framework for policy
                analysis and international engagement. We serve as an
                intellectual hub for students, academics, and future diplomats.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Professional Accreditation & Training",
                  "Strategic Policy Advocacy",
                  "Global Inter-NGO Partnerships",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-sm font-semibold uppercase tracking-[0.08em] text-[#001e40]"
                  >
                    <span className="mr-3 size-2 bg-[#775a19]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative md:col-span-6">
              <div className="aspect-square border border-[#c3c6d1] p-8">
                <div className="relative h-full w-full">
                  <OptimizedFillImage
                    src={embassyImage}
                    alt="Modern institutional building facade"
                    className="h-full w-full object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </div>
              <div className="bg-[#fed488] p-8 lg:absolute lg:-bottom-8 lg:-right-8">
                <p className="font-serif text-2xl font-semibold text-[#785a1a]">
                  120+ partner institutions engage with SSDU annually
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f3f2] py-20">
          <div className="mx-auto max-w-[1280px] px-6 md:px-16">
            <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-serif text-4xl font-semibold text-[#001e40] md:text-5xl">
                  Diplomatic Insights
                </h2>
                <p className="mt-2 text-[#43474f]">
                  The latest analysis and updates from our student diplomacy
                  work.
                </p>
              </div>
              <Link
                href="/blog"
                className="border-b-2 border-[#775a19] pb-1 text-sm font-semibold text-[#001e40] hover:opacity-70"
              >
                View All Intelligence
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {insights.map((insight) => (
                <InsightArticle key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#1c1b1b] py-20 text-[#fcf9f8]">
          <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-16">
            <div className="border border-[#737780] bg-[#303436] p-10 text-center md:p-20">
              <h2 className="font-serif text-5xl font-bold leading-tight md:text-[64px]">
                Join the Vanguard of Diplomacy
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#999c9e]">
                Become part of SSDU. Gain access to research publications,
                professional networks, and programs designed for future
                international careers.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
                <Link
                  href="/membership"
                  className="bg-[#775a19] px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:brightness-110"
                >
                  Apply for Membership
                </Link>
                <Link
                  href="/contact"
                  className="border border-[#737780] px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#fcf9f8] hover:bg-[#fcf9f8] hover:text-[#001e40]"
                >
                  Download Brochure
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
