import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock3,
  Globe2,
  HeartHandshake,
  Mail,
  Target,
  UserRound,
} from "lucide-react";
import { BrandLogo, HomeHeader } from "@/app/_components/home-header";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { createPageMetadata } from "@/lib/site/metadata";
import {
  leadershipProfiles,
  officialMission,
  officialValues,
  publicNavigation,
  strategicObjectives,
} from "@/lib/site/official-content";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  description:
    "The Somali Diplomacy Association empowers Somali youth through diplomatic education, leadership development, and international engagement.",
  path: "/",
});

const navigationItems = publicNavigation;

const principles: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Our Mission",
    description: officialMission,
    icon: Target,
  },
  {
    title: "Our Objectives",
    description: strategicObjectives.slice(0, 2).join(" "),
    icon: Globe2,
  },
  {
    title: "Our Values",
    description: officialValues.join(", ") + ".",
    icon: HeartHandshake,
  },
];

async function getHomeData() {
  const [blogResult, leadershipResult] = await Promise.allSettled([
    prismaBlogRepository.listPublic(),
    prismaLeadershipRepository.listPublic(),
  ]);

  const blog = blogResult.status === "fulfilled" ? blogResult.value : [];
  const leadership =
    leadershipResult.status === "fulfilled" ? leadershipResult.value : [];
  return {
    blog: blog.slice(0, 3),
    leadership: leadership.slice(0, 4),
    availability: {
      blog: blogResult.status === "fulfilled",
      leadership: leadershipResult.status === "fulfilled",
    },
  };
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-dashed border-[#b9c7d4] bg-white px-6 py-12 text-center text-[17px] text-[#52657c]">
      {children}
    </div>
  );
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <div className="home-shell min-w-0 bg-white text-[#0a294d]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 font-semibold text-[#0a294d] shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <HomeHeader
        items={navigationItems}
        secondaryItem={{ href: "/login", label: "Login" }}
        joinHref="/membership"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="relative min-h-[760px] overflow-hidden bg-[#0a294d] text-white xl:min-h-[610px] 2xl:min-h-[640px]">
          <OptimizedFillImage
            src="/official/sda-official-venue-group.jpg"
            alt="Somali Diplomacy Association members gathered at an official venue"
            className="h-full w-full object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[#061b34]/45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,24,48,0.90)_0%,rgba(4,24,48,0.58)_50%,rgba(4,24,48,0.28)_100%)]" />

          <div className="relative mx-auto grid min-h-[760px] w-full min-w-0 max-w-[1600px] items-center gap-11 px-5 pb-20 pt-32 sm:pt-36 md:px-10 xl:min-h-[610px] xl:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] xl:gap-10 xl:px-10 xl:pb-10 xl:pt-[82px] 2xl:min-h-[640px]">
            <div className="home-fade-up min-w-0 xl:max-w-[760px] xl:translate-y-8">
              <p className="max-w-full text-[11px] font-bold uppercase tracking-[0.2em] text-[#2cb6f6] sm:text-[14px] sm:tracking-[0.32em]">
                Diplomacy / Leadership / Unity
              </p>
              <h1
                aria-label="Shaping Somalia's Diplomatic Future"
                className="mt-7 font-serif text-[44px] font-bold leading-[0.98] tracking-normal sm:text-[58px] md:text-[68px] xl:mt-5 xl:text-[54px] xl:leading-[1.06] 2xl:text-[58px]"
              >
                <span className="block">Shaping Somalia&apos;s</span>
                <span className="block text-[#28b1f2]">Diplomatic</span>
                <span className="block">Future</span>
              </h1>
              <p className="mt-8 max-w-[600px] text-[18px] leading-8 text-[#d7e0e8] sm:text-[21px] sm:leading-10 xl:mt-5 xl:max-w-[570px] xl:text-[17px] xl:leading-7">
                The Somali Diplomacy Association empowers Somali youth through
                diplomatic education, leadership development, and international engagement.
              </p>
              <div className="mt-10 flex flex-wrap items-start gap-4 sm:gap-5 xl:mt-7">
                <Link
                  href="/membership"
                  className="group inline-flex h-14 items-center gap-3 rounded-md bg-[#1778b8] px-7 text-[17px] font-semibold text-white shadow-lg transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-xl motion-reduce:transform-none sm:px-8 sm:text-lg"
                >
                  Join SDA
                  <ArrowRight
                    className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-14 items-center rounded-md border-2 border-[#8fc9eb] px-7 text-[17px] font-semibold text-white transition-colors hover:bg-white/10 sm:px-8 sm:text-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white pb-24 pt-9 lg:pb-28 xl:pb-16 xl:pt-7">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10 xl:px-10">
            <div className="mx-auto max-w-[960px] text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Who We Are
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold leading-tight text-[#0a294d] md:text-[48px] xl:text-[40px]">
                Built on Principles, Driven by Purpose
              </h2>
              <p className="mt-6 text-xl leading-8 text-[#52657c] xl:text-[17px] xl:leading-7">
                SDA is an independent, youth-led organization building diplomatic
                knowledge, leadership skills, and meaningful international engagement.
              </p>
            </div>

            <div className="mt-18 grid gap-8 md:grid-cols-2 xl:mt-12 xl:grid-cols-3 xl:gap-7">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article
                    key={principle.title}
                    className="min-h-[350px] rounded-[20px] border border-[#dce2e8] p-8 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#b8cfde] hover:shadow-lg motion-reduce:transform-none sm:p-10 md:last:col-span-2 md:last:w-[calc(50%-1rem)] md:last:justify-self-center xl:min-h-[275px] xl:last:col-span-1 xl:last:w-auto xl:p-7"
                  >
                    <div className="flex size-16 items-center justify-center rounded-[18px] bg-[#e8f1f7] text-[#0874b9] xl:size-14">
                      <Icon
                        className="size-7"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-8 font-serif text-[26px] font-bold text-[#071f3c] xl:mt-6 xl:text-[23px]">
                      {principle.title}
                    </h3>
                    <p className="mt-5 text-[18px] leading-8 text-[#52657c] xl:mt-4 xl:text-[16px] xl:leading-7">
                      {principle.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="articles"
          className="scroll-mt-20 bg-[#f4f7fb] pb-20 sm:scroll-mt-[90px] lg:pb-24 xl:pb-20"
        >
          <div className="mx-auto max-w-[1600px] px-5 md:px-10 xl:px-10">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-serif text-[42px] font-bold leading-tight text-[#0a294d] md:text-[50px] xl:text-[41px]">
                  From the SDA Desk
                </h2>
              </div>
              <Link
                href="/blog"
                className="group hidden h-12 items-center gap-3 rounded-[20px] border-2 border-[#0874b9] px-5 text-[#0874b9] transition-colors hover:bg-[#e7f3fb] sm:inline-flex"
              >
                All Articles
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {data.blog.length > 0 ? (
              <div className="mt-16 grid gap-8 md:grid-cols-2 xl:mt-12 xl:grid-cols-3 xl:gap-7">
                {data.blog.map((post) => {
                  const media = post.media[0];
                  return (
                    <article
                      key={post.id}
                      className="group flex min-h-[520px] flex-col overflow-hidden rounded-[20px] border border-[#dce2e8] bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#b8cfde] hover:shadow-xl focus-within:-translate-y-1 focus-within:border-[#b8cfde] focus-within:shadow-xl motion-reduce:transform-none xl:min-h-[430px]"
                    >
                      {media ? (
                        <div className="relative h-[260px] overflow-hidden xl:h-[220px]">
                          <OptimizedFillImage
                            src={media.url}
                            alt={media.altText ?? post.title}
                            className="h-full w-full object-cover"
                            sizes="(min-width: 1024px) 33vw, 100vw"
                          />
                        </div>
                      ) : null}
                      <div className="flex grow flex-col p-8 xl:p-7">
                        <div className="flex flex-wrap items-center gap-3 text-[15px] text-[#52657c]">
                          <span className="rounded-full bg-[#e8f1f7] px-3 py-1 text-[#0874b9]">
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="size-4" aria-hidden="true" />
                            {estimateReadingTime(post.content)} min read
                          </span>
                        </div>
                        <h3 className="mt-6 line-clamp-2 font-serif text-[25px] font-bold leading-9 text-[#071f3c] transition-colors group-hover:text-[#0874b9] group-focus-within:text-[#0874b9] xl:mt-5 xl:text-[22px] xl:leading-8">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="rounded-sm"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-4 line-clamp-2 text-[18px] leading-8 text-[#52657c] xl:text-[16px] xl:leading-7">
                          {post.excerpt ?? post.content}
                        </p>
                        <div className="mt-auto flex items-end justify-between gap-4 pt-7 text-[15px] text-[#52657c]">
                          <time dateTime={post.publishedAt.toISOString()}>
                            {formatDate(post.publishedAt)}
                          </time>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 rounded-sm text-[#0874b9]"
                          >
                            Read
                            <ArrowRight
                              className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-16">
                <EmptyState>
                  {data.availability.blog
                    ? "No published articles are available yet."
                    : "Published articles are temporarily unavailable."}
                </EmptyState>
              </div>
            )}
          </div>
        </section>

        <section
          id="leaders"
          className="scroll-mt-20 bg-[#f4f7fb] py-20 sm:scroll-mt-[90px] lg:py-24 xl:py-18"
        >
          <div className="mx-auto max-w-[1600px] px-5 text-center md:px-10 xl:px-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
              Our Leaders
            </p>
            <h2 className="mt-6 font-serif text-[42px] font-bold leading-tight text-[#0a294d] md:text-[50px] xl:text-[41px]">
              Guided by Purpose, Driven by Service
            </h2>

            {leadershipProfiles.length > 0 ? (
              <div className="mt-16 grid gap-12 sm:grid-cols-2 xl:mt-14 xl:grid-cols-4 xl:gap-10">
                {leadershipProfiles.map((leader) => (
                  <article key={leader.name} className="text-center">
                    {leader.photo ? (
                      <div className="relative mx-auto size-32 overflow-hidden rounded-[18px] border border-[#b9c7d4]">
                        <OptimizedFillImage
                          src={leader.photo}
                          alt={`Portrait of ${leader.name}`}
                          className="h-full w-full object-cover"
                          sizes="128px"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex size-32 items-center justify-center rounded-[18px] bg-[#e4edf5] text-[#0874b9] xl:size-28">
                        <UserRound
                          className="size-12"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <h3 className="mt-7 text-[19px] font-bold text-[#071f3c]">
                      {leader.name}
                    </h3>
                    <p className="mt-1 text-[#0874b9]">{leader.position}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-16">
                <EmptyState>
                  {data.availability.leadership
                    ? "No active leadership profiles are available yet."
                    : "Leadership profiles are temporarily unavailable."}
                </EmptyState>
              </div>
            )}

            <Link
              href="/leadership"
              className="group mt-16 inline-flex h-14 items-center gap-3 rounded-[8px] border-2 border-[#0874b9] px-7 text-lg text-[#0874b9] transition-colors hover:bg-[#e7f3fb]"
            >
              Meet All Leadership
              <ArrowRight
                className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        <section
          id="membership-cta"
          className="relative min-h-[580px] scroll-mt-20 overflow-hidden bg-[#126da8] text-white sm:scroll-mt-[90px] xl:min-h-[450px]"
        >
          <OptimizedFillImage
            src="/official/sda-workshop-provided.jpg"
            alt="SDA diplomacy workshop participants"
            className="h-full w-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#086ba8]/80" />
          <div className="relative mx-auto flex min-h-[580px] max-w-[1600px] items-center justify-center px-5 py-20 text-center md:px-10 xl:min-h-[450px] xl:px-10 xl:py-14">
            <div className="max-w-[900px]">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#c9e8fa]">
                Become a Member
              </p>
              <h2 className="mt-7 font-serif text-[40px] font-bold leading-[1.05] sm:text-[48px] md:text-[58px] xl:text-[46px]">
                Ready to Represent Somalia to the World?
              </h2>
              <p className="mx-auto mt-8 max-w-[830px] text-xl leading-9 text-[#e5f1f8] xl:mt-6 xl:text-[17px] xl:leading-8">
                Contact SDA to learn about membership, diplomatic education,
                professional networks, and opportunities to contribute
                to the organization&apos;s work.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-5 xl:mt-10">
                <Link
                  href="/contact"
                  className="group inline-flex h-14 items-center gap-3 rounded-md bg-white px-8 text-[17px] font-semibold text-[#0874b9] shadow-lg transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#edf7fc] hover:shadow-xl motion-reduce:transform-none sm:text-lg"
                >
                  Membership Inquiry
                  <ArrowRight
                    className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-14 items-center rounded-md border-2 border-white/60 px-8 text-[17px] font-semibold text-white transition-colors hover:bg-white/10 sm:text-lg"
                >
                  Learn About SDA
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a294d] text-[#c3cfda]">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-2 md:px-10 xl:grid-cols-4 xl:gap-10 xl:px-10 xl:py-14">
          <div>
            <BrandLogo inverse />
            <p className="mt-7 max-w-sm text-[16px] leading-7">
              Empowering the next generation of Somali diplomats through
              training, dialogue, research, and international engagement.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Quick Links
            </h2>
            <ul className="mt-7 space-y-4">
              {navigationItems.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    className="rounded-sm transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Organization
            </h2>
            <ul className="mt-7 space-y-4">
              <li><Link href="/about" className="rounded-sm transition-colors hover:text-white">About SDA</Link></li>
              <li><Link href="/leadership" className="rounded-sm transition-colors hover:text-white">Leadership</Link></li>
              <li><Link href="/archive" className="rounded-sm transition-colors hover:text-white">Archive</Link></li>
              <li><Link href="/blog" className="rounded-sm transition-colors hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Contact
            </h2>
            <p className="mt-7 leading-7">
              Questions about membership, activities, or partnerships are handled
              through the SDA contact form.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-sm text-white transition-colors hover:text-[#28b1f2]"
            >
              <Mail className="size-5" aria-hidden="true" /> Contact SDA
            </Link>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 border-t border-white/10 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10 xl:px-10 xl:py-6">
          <p>
            &copy; 2026 Somali Diplomacy Association. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/contact"
              className="rounded-sm transition-colors hover:text-white"
            >
              Privacy inquiries
            </Link>
            <Link
              href="/contact"
              className="rounded-sm transition-colors hover:text-white"
            >
              Terms inquiries
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
