import Link from "next/link";
import { ArrowRight, FileText, Mail, Search } from "lucide-react";
import { BrandLogo, HomeHeader } from "@/app/_components/home-header";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import type { BlogRecord } from "@/lib/blog/blog-service";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import type { ProgramRecord } from "@/lib/programs/program-service";
import { createPageMetadata } from "@/lib/site/metadata";
import { publicNavigation } from "@/lib/site/official-content";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Read published SDA analysis, news, program updates, and perspectives on diplomacy and leadership.",
  path: "/blog",
});

type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const navigationItems = publicNavigation;

const PAGE_SIZE = 12;

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function excerptFor(post: BlogRecord): string {
  return (
    post.excerpt ??
    `${post.content.replace(/\s+/g, " ").slice(0, 180).trimEnd()}${post.content.length > 180 ? "..." : ""}`
  );
}

function readingTime(post: BlogRecord): number {
  const words = post.content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function primaryImage(post: BlogRecord) {
  return (
    post.media.find((media) => media.mimeType.startsWith("image/")) ?? null
  );
}

function filterPosts(
  posts: BlogRecord[],
  query: string,
  category: string,
): BlogRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesQuery = normalizedQuery
      ? [post.title, post.category, post.excerpt ?? "", post.content]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      : true;
    const matchesCategory = category ? post.category === category : true;
    return matchesQuery && matchesCategory;
  });
}

function createBlogHref({
  query,
  category,
  page,
}: {
  query?: string;
  category?: string;
  page?: number;
}): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/blog?${search}` : "/blog";
}

async function getBlogData(): Promise<{
  posts: BlogRecord[];
  programs: ProgramRecord[];
  available: boolean;
}> {
  const [postsResult, programsResult] = await Promise.allSettled([
    prismaBlogRepository.listPublic(),
    prismaProgramRepository.listPublic(),
  ]);

  return {
    posts: postsResult.status === "fulfilled" ? postsResult.value : [],
    programs: programsResult.status === "fulfilled" ? programsResult.value : [],
    available: postsResult.status === "fulfilled",
  };
}

function PostImage({
  post,
  featured = false,
}: {
  post: BlogRecord;
  featured?: boolean;
}) {
  const media = primaryImage(post);

  if (!media) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center bg-[#e7f1f8] px-8 text-center text-[#0874b9]">
        <FileText className="size-14" strokeWidth={1.4} aria-hidden="true" />
        <span className="sr-only">No image published for {post.title}</span>
      </div>
    );
  }

  return (
    <OptimizedFillImage
      src={media.url}
      alt={media.altText ?? post.title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
      sizes={
        featured
          ? "(min-width: 1024px) 50vw, 100vw"
          : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      }
    />
  );
}

function BlogCard({ post }: { post: BlogRecord }) {
  return (
    <article className="group flex min-h-[520px] flex-col overflow-hidden rounded-[18px] border border-[#dbe3ea] bg-white transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#abc7d8] hover:shadow-xl motion-reduce:transform-none">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block h-[260px] overflow-hidden bg-[#e7f1f8]"
        aria-label={`Read ${post.title}`}
      >
        <PostImage post={post} />
      </Link>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#52657c]">
          <span className="rounded-full bg-[#e7f1f8] px-3 py-1 text-[#0874b9]">
            {post.category}
          </span>
          <span>{readingTime(post)} min read</span>
        </div>
        <h2 className="mt-5 font-serif text-[25px] font-bold leading-[1.35] text-[#071f3c]">
          <Link
            href={`/blog/${post.slug}`}
            className="rounded-sm hover:text-[#0874b9]"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 line-clamp-3 text-[16px] leading-7 text-[#52657c]">
          {excerptFor(post)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-7 text-sm text-[#52657c]">
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#0874b9] hover:text-[#0a6098]"
          >
            Read <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = (await searchParams) ?? {};
  const query = firstParam(params.q);
  const category = firstParam(params.category);
  const requestedPage = Number.parseInt(firstParam(params.page), 10);
  const data = await getBlogData();
  const categories = Array.from(
    new Set(data.posts.map((post) => post.category)),
  ).sort();
  const featured = data.posts[0] ?? null;
  const hasFilters = Boolean(query || category);
  const directorySource = hasFilters ? data.posts : data.posts.slice(1);
  const filteredPosts = filterPosts(directorySource, query, category);
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    pageCount,
  );
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="min-w-0 bg-white text-[#0a294d]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 font-semibold text-[#0a294d] shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <HomeHeader
        items={navigationItems}
        activeHref="/blog"
        overlay={false}
        secondaryItem={{ href: "/login", label: "Login" }}
        joinHref="/membership"
      />

      <main id="main-content" className="pt-20 sm:pt-[90px]">
        <section className="bg-[#0a294d] px-5 py-20 text-center text-white sm:py-24 md:px-10 lg:py-28">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#29b6f6]">
            Insights &amp; News
          </p>
          <h1 className="mt-7 font-serif text-[48px] font-bold leading-none sm:text-[62px] lg:text-[70px]">
            The SDA Blog
          </h1>
          <p className="mx-auto mt-7 max-w-[850px] text-lg leading-8 text-[#c3cfda] sm:text-xl">
            Published analysis, news, and perspectives from the SDA community.
          </p>
          <form action="/blog" className="relative mx-auto mt-11 max-w-[680px]">
            <label htmlFor="blog-search" className="sr-only">
              Search published articles
            </label>
            <Search
              className="pointer-events-none absolute left-6 top-1/2 size-5 -translate-y-1/2 text-[#91a4b8]"
              aria-hidden="true"
            />
            <input
              id="blog-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search articles..."
              className="h-[68px] w-full rounded-full border border-[#5b7089] bg-white/10 pl-14 pr-6 text-lg text-white outline-none transition placeholder:text-[#91a4b8] focus:border-[#29b6f6] focus:ring-4 focus:ring-[#29b6f6]/20"
            />
          </form>
        </section>

        {featured && !hasFilters ? (
          <section className="py-20 lg:py-24">
            <article className="group mx-auto grid max-w-[1780px] items-center gap-10 px-5 md:px-10 lg:grid-cols-2 xl:gap-16 xl:px-12">
              <Link
                href={`/blog/${featured.slug}`}
                className="relative block min-h-[360px] overflow-hidden rounded-[20px] bg-[#e7f1f8] sm:min-h-[480px]"
                aria-label={`Read ${featured.title}`}
              >
                <PostImage post={featured} featured />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#52657c]">
                  <span className="rounded-full bg-[#e7f1f8] px-3 py-1 text-[#0874b9]">
                    {featured.category}
                  </span>
                  <span className="rounded-full bg-[#f3f6fa] px-3 py-1">
                    Latest
                  </span>
                </div>
                <h2 className="mt-6 max-w-[760px] font-serif text-[38px] font-bold leading-[1.25] text-[#071f3c] sm:text-[46px]">
                  {featured.title}
                </h2>
                <p className="mt-7 max-w-[760px] text-lg leading-8 text-[#52657c]">
                  {excerptFor(featured)}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px] text-[#52657c]">
                  <time dateTime={featured.publishedAt.toISOString()}>
                    {formatDate(featured.publishedAt)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{readingTime(featured)} min read</span>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group/button mt-9 inline-flex h-14 items-center gap-3 rounded-[8px] bg-[#1778b8] px-7 text-lg font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-lg motion-reduce:transform-none"
                >
                  Read Article
                  <ArrowRight
                    className="size-5 transition-transform group-hover/button:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          </section>
        ) : null}

        <section className="bg-[#f4f7fb] py-16 lg:py-20">
          <div className="mx-auto max-w-[1780px] px-5 md:px-10 xl:px-12">
            <nav
              className="flex gap-3 overflow-x-auto pb-2"
              aria-label="Blog categories"
            >
              <Link
                href={createBlogHref({ query })}
                aria-current={!category ? "page" : undefined}
                className={`inline-flex min-h-12 shrink-0 items-center rounded-full border px-6 text-[16px] transition-colors ${!category ? "border-[#0a294d] bg-[#0a294d] text-white" : "border-[#dbe3ea] bg-white text-[#52657c] hover:border-[#87b5d0] hover:text-[#0874b9]"}`}
              >
                All
              </Link>
              {categories.map((item) => (
                <Link
                  key={item}
                  href={createBlogHref({ query, category: item })}
                  aria-current={category === item ? "page" : undefined}
                  className={`inline-flex min-h-12 shrink-0 items-center rounded-full border px-6 text-[16px] transition-colors ${category === item ? "border-[#0a294d] bg-[#0a294d] text-white" : "border-[#dbe3ea] bg-white text-[#52657c] hover:border-[#87b5d0] hover:text-[#0874b9]"}`}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {visiblePosts.length > 0 ? (
              <>
                <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                  {visiblePosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
                {pageCount > 1 ? (
                  <nav
                    className="mt-14 flex flex-wrap justify-center gap-2"
                    aria-label="Blog pagination"
                  >
                    {Array.from(
                      { length: pageCount },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <Link
                        key={page}
                        href={createBlogHref({ query, category, page })}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex size-11 items-center justify-center rounded-md border font-semibold ${page === currentPage ? "border-[#0a294d] bg-[#0a294d] text-white" : "border-[#cbd6df] bg-white text-[#52657c] hover:border-[#0874b9] hover:text-[#0874b9]"}`}
                      >
                        {page}
                      </Link>
                    ))}
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="mt-12 rounded-[18px] border border-dashed border-[#b9c7d4] bg-white px-6 py-14 text-center">
                <h2 className="font-serif text-3xl font-bold text-[#071f3c]">
                  {hasFilters
                    ? "No articles match these filters."
                    : "No articles have been published yet."}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-8 text-[#52657c]">
                  {data.available
                    ? hasFilters
                      ? "Try another search or choose a different category."
                      : "Published posts will appear here after an administrator makes them public."
                    : "Published articles are temporarily unavailable. Please try again later."}
                </p>
                {hasFilters ? (
                  <Link
                    href="/blog"
                    className="mt-7 inline-flex min-h-11 items-center font-semibold text-[#0874b9] hover:text-[#0a6098]"
                  >
                    Clear filters
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-[#0a294d] text-[#c3cfda]">
        <div className="mx-auto grid max-w-[1780px] gap-12 px-5 py-20 md:grid-cols-2 md:px-10 xl:grid-cols-4 xl:px-12">
          <div>
            <BrandLogo inverse />
            <p className="mt-7 max-w-sm text-[16px] leading-7">
              Empowering Somali youth through training, dialogue, research, and
              international engagement.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Quick Links
            </h2>
            <ul className="mt-7 space-y-4">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Public Programs
            </h2>
            {data.programs.length > 0 ? (
              <ul className="mt-7 space-y-4">
                {data.programs.slice(0, 5).map((program) => (
                  <li key={program.id}>
                    <Link
                      href={`/programs/${program.slug}`}
                      className="transition-colors hover:text-white"
                    >
                      {program.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-7 leading-7">
                No public programs are listed yet.
              </p>
            )}
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Contact
            </h2>
            <p className="mt-7 leading-7">
              Questions about articles, programs, or partnerships are handled
              through the existing contact form.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex min-h-11 items-center gap-3 text-white transition-colors hover:text-[#28b1f2]"
            >
              <Mail className="size-5" aria-hidden="true" /> Contact SDA
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1780px] flex-col gap-4 border-t border-white/10 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10 xl:px-12">
          <p>
            &copy; 2026 Somali Diplomacy Association. All rights reserved.
          </p>
          <Link href="/contact" className="transition-colors hover:text-white">
            Privacy and terms inquiries
          </Link>
        </div>
      </footer>
    </div>
  );
}
