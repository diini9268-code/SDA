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
import { getSiteCmsContent } from "@/lib/site/cms-content";
import { createPageMetadata } from "@/lib/site/metadata";
import { leadershipProfiles } from "@/lib/site/official-content";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  description:
    "The Somali Diplomacy Association empowers Somali youth through diplomatic education, leadership development, and international engagement.",
  path: "/",
});

async function getHomeData() {
  const [blogResult, leadershipResult, cms] = await Promise.all([
    Promise.resolve(prismaBlogRepository.listPublic()).then(
      (value) => ({ status: "fulfilled" as const, value }),
      (reason) => ({ status: "rejected" as const, reason }),
    ),
    Promise.resolve(prismaLeadershipRepository.listPublic()).then(
      (value) => ({ status: "fulfilled" as const, value }),
      (reason) => ({ status: "rejected" as const, reason }),
    ),
    getSiteCmsContent(),
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
    cms,
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
  const navigationItems = data.cms.navigation;
  const globalContent = data.cms.global.content;
  const homeContent = data.cms.home.content;
  const principles: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
  }> = [
    {
      title: "Our Mission",
      description: globalContent.mission ?? "",
      icon: Target,
    },
    {
      title: "Our Objectives",
      description: (globalContent.objectives ?? []).slice(0, 2).join(" "),
      icon: Globe2,
    },
    {
      title: "Our Values",
      description: `${(globalContent.values ?? []).join(", ")}.`,
      icon: HeartHandshake,
    },
  ];
  const heroTitle = homeContent.title ?? "Shaping Somalia's Diplomatic Future";
  const diplomaticIndex = heroTitle.toLowerCase().indexOf("diplomatic");
  const heroBefore =
    diplomaticIndex >= 0
      ? heroTitle.slice(0, diplomaticIndex).trim()
      : heroTitle;
  const heroAfter =
    diplomaticIndex >= 0
      ? heroTitle.slice(diplomaticIndex + "diplomatic".length).trim()
      : "";
  const brand = {
    organizationName: globalContent.organizationName,
    motto: globalContent.motto,
    logoUrl: data.cms.global.media.hero?.url,
  };

  return (
    <div className="home-shell min-w-0 bg-white text-[#0a294d]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 font-semibold text-[#0a294d] shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <HomeHeader
        brand={brand}
        items={navigationItems}
        secondaryItem={{ href: "/login", label: "Login" }}
        joinHref="/membership"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="relative min-h-[700px] overflow-hidden bg-[#0a294d] text-white sm:min-h-[720px] xl:min-h-[650px]">
          <OptimizedFillImage
            src={data.cms.home.media.hero?.url ?? "/official/sda-official-venue-group.jpg"}
            alt="Somali Diplomacy Association members gathered at an official venue"
            className="h-full w-full object-cover object-[58%_center]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[#061b34]/30" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,24,48,0.94)_0%,rgba(4,24,48,0.76)_40%,rgba(4,24,48,0.34)_72%,rgba(4,24,48,0.18)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#061b34]/35 to-transparent" />

          <div className="home-container relative grid min-h-[700px] items-center pb-16 pt-28 sm:min-h-[720px] sm:pt-32 xl:min-h-[650px] xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] xl:pb-12 xl:pt-[92px]">
            <div className="home-fade-up min-w-0 max-w-[680px] xl:max-w-[620px]">
              <p className="max-w-full text-[11px] font-bold uppercase tracking-[0.2em] text-[#2cb6f6] sm:text-[14px] sm:tracking-[0.32em]">
                {homeContent.eyebrow}
              </p>
              <h1
                aria-label="Shaping Somalia's Diplomatic Future"
                className="mt-6 font-serif text-[clamp(3rem,6vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.02em] xl:mt-5 xl:text-[64px] xl:leading-[1.01]"
              >
                <span className="block">{heroBefore}</span>
                {diplomaticIndex >= 0 ? (
                  <span className="block text-[#28b1f2]">Diplomatic</span>
                ) : null}
                {heroAfter ? <span className="block">{heroAfter}</span> : null}
              </h1>
              <p className="mt-7 max-w-[590px] text-[17px] leading-8 text-[#dce6ee] sm:text-[19px] sm:leading-8 xl:mt-6 xl:text-[18px]">
                {homeContent.description}
              </p>
              <div className="mt-9 flex flex-wrap items-start gap-4 sm:gap-5">
                <Link
                  href="/membership"
                  className="group inline-flex h-14 items-center gap-3 rounded-lg bg-[#1778b8] px-7 text-[17px] font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-[0_16px_34px_rgba(0,0,0,0.25)] motion-reduce:transform-none sm:px-8 sm:text-lg"
                >
                  {homeContent.primaryLabel ?? "Join SDA"}
                  <ArrowRight
                    className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-14 items-center rounded-lg border border-white/55 bg-white/5 px-7 text-[17px] font-semibold text-white backdrop-blur-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/12 motion-reduce:transform-none sm:px-8 sm:text-lg"
                >
                  {homeContent.secondaryLabel ?? "Learn More"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="home-container">
            <div className="home-reveal mx-auto max-w-[820px] text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Who We Are
              </p>
              <h2 className="mt-5 font-serif text-[36px] font-bold leading-[1.12] tracking-[-0.015em] text-[#0a294d] sm:text-[44px] lg:text-[48px]">
                Built on Principles, Driven by Purpose
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-[#52657c] sm:text-[18px]">
                SDA is an independent, youth-led organization building diplomatic
                knowledge, leadership skills, and meaningful international engagement.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 xl:grid-cols-3">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article
                    key={principle.title}
                    className="home-reveal rounded-2xl border border-[#dce4eb] bg-white p-7 shadow-[0_10px_34px_rgba(10,41,77,0.045)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#b8cfde] hover:shadow-[0_18px_42px_rgba(10,41,77,0.1)] motion-reduce:transform-none sm:p-8 md:last:col-span-2 md:last:w-[calc(50%-0.75rem)] md:last:justify-self-center xl:last:col-span-1 xl:last:w-auto"
                  >
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e8f1f7] text-[#0874b9]">
                      <Icon
                        className="size-7"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-7 font-serif text-[24px] font-bold text-[#071f3c]">
                      {principle.title}
                    </h3>
                    <p className="mt-4 text-[16px] leading-7 text-[#52657c]">
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
          className="scroll-mt-20 border-y border-[#e8edf2] bg-[#f4f7fb] py-20 sm:scroll-mt-[90px] sm:py-24 lg:py-28"
        >
          <div className="home-container">
            <div className="home-reveal flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                  News &amp; Insights
                </p>
                <h2 className="mt-4 font-serif text-[36px] font-bold leading-tight tracking-[-0.015em] text-[#0a294d] sm:text-[44px] lg:text-[48px]">
                  From the SDA Desk
                </h2>
              </div>
              <Link
                href="/blog"
                className="group hidden h-12 items-center gap-3 rounded-lg border border-[#0874b9] px-5 font-semibold text-[#0874b9] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#e7f3fb] motion-reduce:transform-none sm:inline-flex"
              >
                All Articles
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {data.blog.length > 0 ? (
              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {data.blog.map((post) => {
                  const media = post.media[0];
                  return (
                    <article
                      key={post.id}
                      className="home-reveal group flex min-h-[470px] flex-col overflow-hidden rounded-2xl border border-[#dce4eb] bg-white shadow-[0_10px_34px_rgba(10,41,77,0.05)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#b8cfde] hover:shadow-[0_20px_46px_rgba(10,41,77,0.12)] focus-within:-translate-y-1 focus-within:border-[#b8cfde] focus-within:shadow-[0_20px_46px_rgba(10,41,77,0.12)] motion-reduce:transform-none"
                    >
                      {media ? (
                        <div className="relative aspect-[16/9] overflow-hidden bg-[#e8eef4]">
                          <OptimizedFillImage
                            src={media.url}
                            alt={media.altText ?? post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
                            sizes="(min-width: 1024px) 33vw, 100vw"
                          />
                        </div>
                      ) : null}
                      <div className="flex grow flex-col p-7">
                        <div className="flex flex-wrap items-center gap-3 text-[15px] text-[#52657c]">
                          <span className="rounded-full bg-[#e8f1f7] px-3 py-1 text-[#0874b9]">
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="size-4" aria-hidden="true" />
                            {estimateReadingTime(post.content)} min read
                          </span>
                        </div>
                        <h3 className="mt-5 line-clamp-2 font-serif text-[23px] font-bold leading-8 text-[#071f3c] transition-colors group-hover:text-[#0874b9] group-focus-within:text-[#0874b9]">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="rounded-sm"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-3 line-clamp-2 text-[16px] leading-7 text-[#52657c]">
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
              <div className="mt-12">
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
          className="scroll-mt-20 bg-white py-20 sm:scroll-mt-[90px] sm:py-24 lg:py-28"
        >
          <div className="home-container text-center">
            <div className="home-reveal mx-auto max-w-[820px]">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Our Leaders
              </p>
              <h2 className="mt-5 font-serif text-[36px] font-bold leading-tight tracking-[-0.015em] text-[#0a294d] sm:text-[44px] lg:text-[48px]">
                Guided by Purpose, Driven by Service
              </h2>
            </div>

            {leadershipProfiles.length > 0 ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 xl:grid-cols-4">
                {leadershipProfiles.map((leader) => (
                  <article
                    key={leader.name}
                    className="home-reveal group flex min-h-[340px] flex-col items-center rounded-2xl border border-[#dce4eb] bg-[#f8fafc] px-5 py-8 text-center shadow-[0_10px_32px_rgba(10,41,77,0.04)] transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#b8cfde] hover:bg-white hover:shadow-[0_18px_42px_rgba(10,41,77,0.1)] motion-reduce:transform-none"
                  >
                    {leader.photo ? (
                      <div className="relative mx-auto size-36 overflow-hidden rounded-2xl border border-[#c9d6e0] bg-white shadow-sm">
                        <OptimizedFillImage
                          src={leader.photo}
                          alt={`Portrait of ${leader.name}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
                          sizes="144px"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex size-36 items-center justify-center rounded-2xl bg-[#e4edf5] text-[#0874b9]">
                        <UserRound
                          className="size-12"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <h3 className="mt-6 text-[18px] font-bold leading-6 text-[#071f3c]">
                      {leader.name}
                    </h3>
                    <p className="mt-2 max-w-[260px] text-[15px] leading-6 text-[#0874b9]">
                      {leader.position}
                    </p>
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
              className="group mt-12 inline-flex h-14 items-center gap-3 rounded-lg border border-[#0874b9] px-7 text-[17px] font-semibold text-[#0874b9] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#e7f3fb] motion-reduce:transform-none lg:mt-14"
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
          className="relative min-h-[520px] scroll-mt-20 overflow-hidden bg-[#126da8] text-white sm:scroll-mt-[90px]"
        >
          <OptimizedFillImage
            src={data.cms.home.media.feature?.url ?? "/official/sda-workshop-provided.jpg"}
            alt="SDA diplomacy workshop participants"
            className="h-full w-full object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#075d95]/68" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,61,101,0.78)_0%,rgba(8,116,185,0.62)_50%,rgba(5,61,101,0.74)_100%)]" />
          <div className="home-container relative flex min-h-[520px] items-center justify-center py-20 text-center">
            <div className="home-reveal max-w-[820px]">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#c9e8fa]">
                Become a Member
              </p>
              <h2 className="mt-6 font-serif text-[38px] font-bold leading-[1.06] tracking-[-0.015em] sm:text-[48px] lg:text-[54px]">
                Ready to Represent Somalia to the World?
              </h2>
              <p className="mx-auto mt-6 max-w-[760px] text-[17px] leading-8 text-[#e5f1f8] sm:text-[18px]">
                Contact SDA to learn about membership, diplomatic education,
                professional networks, and opportunities to contribute
                to the organization&apos;s work.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex h-14 items-center gap-3 rounded-lg bg-white px-8 text-[17px] font-semibold text-[#0874b9] shadow-[0_12px_28px_rgba(3,43,72,0.2)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#edf7fc] hover:shadow-[0_16px_34px_rgba(3,43,72,0.26)] motion-reduce:transform-none"
                >
                  Membership Inquiry
                  <ArrowRight
                    className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-14 items-center rounded-lg border border-white/60 bg-white/5 px-8 text-[17px] font-semibold text-white backdrop-blur-sm transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/12 motion-reduce:transform-none"
                >
                  Learn About SDA
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="trusted-partners-heading"
          className="bg-white py-16 sm:py-20"
        >
          <div className="home-container text-center">
            <h2
              id="trusted-partners-heading"
              className="home-reveal text-xs font-bold uppercase tracking-[0.3em] text-[#52657c]"
            >
              Trusted Partners &amp; Supporters
            </h2>
            <ul className="mt-9 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.cms.partners.map((partner) => (
                <li
                  key={partner.name}
                  className="home-reveal flex min-h-24 items-center justify-center rounded-xl border border-[#e4eaf0] bg-[#f8fafc] px-4 py-4 text-[14px] font-medium leading-5 text-[#687b91] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#c6d7e3] hover:bg-white hover:text-[#0874b9] motion-reduce:transform-none"
                >
                  {partner.website ? (
                    <a href={partner.website} className="group grid h-full w-full place-content-center justify-items-center gap-3 transition-colors hover:text-[#0874b9]">
                      {partner.logoAsset ? (
                        <span className="relative block h-10 w-28">
                          <OptimizedFillImage
                            src={partner.logoAsset.url}
                            alt={`${partner.name} logo`}
                            className="h-full w-full object-contain grayscale transition group-hover:grayscale-0"
                            sizes="112px"
                          />
                        </span>
                      ) : null}
                      <span>{partner.name}</span>
                    </a>
                  ) : (
                    <span className="grid justify-items-center gap-3">
                      {partner.logoAsset ? (
                        <span className="relative block h-10 w-28">
                          <OptimizedFillImage
                            src={partner.logoAsset.url}
                            alt={`${partner.name} logo`}
                            className="h-full w-full object-contain grayscale"
                            sizes="112px"
                          />
                        </span>
                      ) : null}
                      <span>{partner.name}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a294d] text-[#c3cfda]">
        <div className="home-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.1fr] lg:gap-10 lg:py-18">
          <div>
            <BrandLogo brand={brand} inverse />
            <p className="mt-6 max-w-[340px] text-[15px] leading-7">
              {globalContent.mission}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Quick Links
            </h2>
            <ul className="mt-6 space-y-3.5 text-[15px]">
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
            <ul className="mt-6 space-y-3.5 text-[15px]">
              <li><Link href="/about" className="rounded-sm transition-colors hover:text-white">About SDA</Link></li>
              <li><Link href="/leadership" className="rounded-sm transition-colors hover:text-white">Leadership</Link></li>
              <li><Link href="/blog" className="rounded-sm transition-colors hover:text-white">News and insights</Link></li>
              <li><Link href="/membership" className="rounded-sm transition-colors hover:text-white">Membership</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Contact
            </h2>
            <p className="mt-6 text-[15px] leading-7">
              Questions about membership, activities, or partnerships are handled
              through the SDA contact form.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-sm text-[15px] text-white transition-colors hover:text-[#28b1f2]"
            >
              <Mail className="size-5" aria-hidden="true" /> Contact SDA
            </Link>
          </div>
        </div>

        <div className="home-container flex flex-col gap-4 border-t border-white/10 py-6 text-sm md:flex-row md:items-center md:justify-between">
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
