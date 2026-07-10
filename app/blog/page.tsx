import Link from "next/link";
import { PublicPageShell } from "@/app/_components/public-shell";
import type { BlogRecord } from "@/lib/blog/blog-service";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Research",
  description:
    "Explore SSDU research publications, policy papers, and student diplomacy analysis.",
  path: "/blog",
});

type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type ResearchPublication = {
  id: string;
  title: string;
  slug?: string;
  category: string;
  excerpt: string;
  publishedAt: Date;
  imageUrl: string;
  imageAlt: string;
  actionLabel: string;
  actionMeta: string;
};

const PAGE_SIZE = 12;
const heroFallback = {
  title: "Youth in Governance: Barriers and Opportunities (2024)",
  category: "Diplomacy",
  excerpt:
    "This flagship publication explores the structural challenges and untapped potential of Somali diaspora youth in international policy-making and regional governance frameworks.",
  publishedAt: new Date("2024-01-24T00:00:00.000Z"),
};

const samplePublications: ResearchPublication[] = [
  {
    id: "sample-regional-peace",
    title: "Peace & Stability: A Regional Comparative Study",
    category: "Strategic Affairs",
    excerpt:
      "An in-depth analysis of peace-building initiatives in the Horn of Africa, comparing institutional frameworks and grassroots conflict resolution.",
    publishedAt: new Date("2024-03-12T00:00:00.000Z"),
    imageUrl:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Diplomatic roundtable meeting",
    actionLabel: "Download PDF",
    actionMeta: "4.2 MB",
  },
  {
    id: "sample-global-ties",
    title: "Diplomatic Relations: Strengthening Global Ties",
    category: "Regional Stability",
    excerpt:
      "Investigating the evolving nature of bilateral agreements between Somali educational unions and international governing bodies in the diplomatic sector.",
    publishedAt: new Date("2024-02-28T00:00:00.000Z"),
    imageUrl:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Two globes on a research desk",
    actionLabel: "Read Online",
    actionMeta: "12 min read",
  },
  {
    id: "sample-reconstruction",
    title: "Youth in Post-Conflict Reconstruction",
    category: "Public Policy",
    excerpt:
      "A policy paper outlining recommendations for integrating youth leadership into national reconstruction efforts and economic recovery frameworks.",
    publishedAt: new Date("2024-01-15T00:00:00.000Z"),
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Urban development and reconstruction planning",
    actionLabel: "Download PDF",
    actionMeta: "3.8 MB",
  },
];

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatFileSize(sizeBytes: number | null | undefined): string {
  if (!sizeBytes) {
    return "Read online";
  }

  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}

function createPageHref(
  params: {
    query: string;
    category: string;
    year: string;
  },
  page: number,
): string {
  const search = new URLSearchParams();

  if (params.query) {
    search.set("q", params.query);
  }
  if (params.category) {
    search.set("category", params.category);
  }
  if (params.year) {
    search.set("year", params.year);
  }
  if (page > 1) {
    search.set("page", String(page));
  }

  const queryString = search.toString();

  return queryString ? `/blog?${queryString}` : "/blog";
}

function getPrimaryMedia(post: BlogRecord) {
  return post.media[0] ?? null;
}

function toResearchPublication(post: BlogRecord): ResearchPublication {
  const media = getPrimaryMedia(post);

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: excerptFor(post),
    publishedAt: post.publishedAt,
    imageUrl: media?.url ?? "",
    imageAlt: media?.altText ?? post.title,
    actionLabel: media ? "Read Online" : "Read Publication",
    actionMeta: media ? formatFileSize(media.sizeBytes) : "12 min read",
  };
}

function excerptFor(post: BlogRecord): string {
  return (
    post.excerpt ??
    post.content.replace(/\s+/g, " ").slice(0, 150).trimEnd()
  );
}

async function getBlogPosts() {
  try {
    return await prismaBlogRepository.listPublic();
  } catch {
    return [];
  }
}

function filterPosts(
  posts: ResearchPublication[],
  filters: {
    query: string;
    category: string;
    year: string;
  },
) {
  const query = filters.query.toLowerCase().trim();

  return posts.filter((post) => {
    const matchesQuery = query
      ? [post.title, post.category, post.excerpt]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;
    const matchesCategory = filters.category
      ? post.category === filters.category
      : true;
    const matchesYear = filters.year
      ? String(post.publishedAt.getFullYear()) === filters.year
      : true;

    return matchesQuery && matchesCategory && matchesYear;
  });
}

function ResearchImage({ post }: { post: ResearchPublication }) {
  if (post.imageUrl) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt={post.imageAlt}
          className="h-48 w-full object-cover"
        />
      </>
    );
  }

  return (
    <div className="flex h-48 w-full items-center justify-center bg-[#002e5f] px-6 text-center">
      <p className="font-serif text-2xl font-bold leading-snug text-white">
        SSDU Research Publication
      </p>
    </div>
  );
}

function PublicationCard({ post }: { post: ResearchPublication }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#cbd2da] bg-white shadow-sm">
      <div className="relative">
        <ResearchImage post={post} />
        <span className="absolute left-5 top-5 rounded-md bg-[#40acfe] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#002e5f]">
          {post.category}
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs font-medium text-[#5c636b]">
          {formatDate(post.publishedAt)}
        </p>
        <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-[#000613]">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="mt-5 line-clamp-3 text-sm leading-7 text-[#43474e]">
          {post.excerpt}
        </p>
        <div className="mt-7 flex items-center justify-between border-t border-[#d6dbe0] pt-5 text-xs">
          {post.slug ? (
            <Link
              href={`/blog/${post.slug}`}
              className="font-bold uppercase tracking-[0.08em] text-[#00639c] hover:underline"
            >
              {post.actionLabel}
            </Link>
          ) : (
            <span className="font-bold uppercase tracking-[0.08em] text-[#00639c]">
              {post.actionLabel}
            </span>
          )}
          <span className="text-[#6b7280]">
            {post.actionMeta}
          </span>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = (await searchParams) ?? {};
  const posts = await getBlogPosts();
  const hasPublishedPosts = posts.length > 0;
  const publications = hasPublishedPosts
    ? posts.map(toResearchPublication)
    : samplePublications;
  const query = firstParam(params.q);
  const category = firstParam(params.category);
  const year = firstParam(params.year);
  const pageParam = Number.parseInt(firstParam(params.page), 10);
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const categories = Array.from(
    new Set(publications.map((post) => post.category)),
  ).sort();
  const years = Array.from(
    new Set(publications.map((post) => String(post.publishedAt.getFullYear()))),
  ).sort((a, b) => Number(b) - Number(a));
  const filteredPosts = filterPosts(publications, { query, category, year });
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const visiblePosts = filteredPosts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const featuredPost = publications[0] ?? null;
  const featuredTitle =
    hasPublishedPosts && featuredPost ? featuredPost.title : heroFallback.title;
  const featuredCategory =
    hasPublishedPosts && featuredPost
      ? featuredPost.category
      : heroFallback.category;
  const featuredDate =
    hasPublishedPosts && featuredPost
      ? featuredPost.publishedAt
      : heroFallback.publishedAt;
  const featuredExcerpt =
    hasPublishedPosts && featuredPost ? featuredPost.excerpt : heroFallback.excerpt;

  return (
    <PublicPageShell activeHref="/blog">
      <main className="pt-[129px] md:pt-20">
        <section
          className="relative flex min-h-[620px] items-center border-b border-[#e9c176] bg-[#000613] px-6 py-24 text-white md:px-16"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0, 6, 19, 0.9) 0%, rgba(0, 6, 19, 0.72) 46%, rgba(0, 6, 19, 0.52) 100%), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="max-w-2xl">
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-[#40acfe] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#002e5f]">
                  {featuredCategory}
                </span>
                <time className="text-sm font-medium text-white">
                  {formatDate(featuredDate)}
                </time>
              </div>
              <h1 className="max-w-xl font-serif text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {featuredTitle}
              </h1>
              <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-white">
                {featuredExcerpt}
              </p>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                {featuredPost?.slug ? (
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex h-14 items-center justify-center rounded-md bg-[#e8f0ff] px-8 text-sm font-bold tracking-[0.04em] text-[#000613] transition hover:bg-white"
                  >
                    Read Publication
                  </Link>
                ) : (
                  <Link
                    href="#directory"
                    className="inline-flex h-14 items-center justify-center rounded-md bg-[#e8f0ff] px-8 text-sm font-bold tracking-[0.04em] text-[#000613] transition hover:bg-white"
                  >
                    Read Publication
                  </Link>
                )}
                <Link
                  href="#directory"
                  className="inline-flex h-14 items-center justify-center rounded-md border border-white/70 px-8 text-sm font-bold tracking-[0.04em] text-white transition hover:bg-white hover:text-[#000613]"
                >
                  View Abstract
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#d6dbe0] bg-[#f8f9fa] px-6 py-8 md:px-16">
          <form
            action="/blog"
            className="mx-auto flex max-w-[1280px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <label className="sr-only" htmlFor="research-search">
              Search research
            </label>
            <input
              id="research-search"
              name="q"
              defaultValue={query}
              placeholder="Search research papers, authors, or keywords..."
              className="h-14 w-full rounded-md border border-[#cbd2da] bg-white px-5 text-sm text-[#000613] outline-none transition placeholder:text-[#6b7280] focus:border-[#00639c] focus:ring-2 focus:ring-[#40acfe]/30 lg:max-w-[450px]"
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label
                className="text-xs font-bold uppercase tracking-[0.1em] text-[#000613]"
                htmlFor="research-category"
              >
                Category:
              </label>
              <select
                id="research-category"
                name="category"
                defaultValue={category}
                className="h-12 rounded-md border border-[#cbd2da] bg-white px-4 text-sm text-[#000613] outline-none focus:border-[#00639c]"
              >
                <option value="">All Research</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <label
                className="text-xs font-bold uppercase tracking-[0.1em] text-[#000613]"
                htmlFor="research-year"
              >
                Year:
              </label>
              <select
                id="research-year"
                name="year"
                defaultValue={year}
                className="h-12 rounded-md border border-[#cbd2da] bg-white px-4 text-sm text-[#000613] outline-none focus:border-[#00639c]"
              >
                <option value="">All Years</option>
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-12 rounded-md bg-[#000613] px-5 text-sm font-bold text-white transition hover:bg-[#002e5f]"
              >
                Apply
              </button>
            </div>
          </form>
        </section>

        <section id="directory" className="bg-[#f8f9fa] px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-4xl font-bold text-[#000613]">
                  Academic Directory
                </h2>
                <div className="mt-5 h-px w-24 bg-[#e9c176]" />
              </div>
              <p className="text-sm text-[#43474e]">
                {hasPublishedPosts
                  ? `Showing ${visiblePosts.length} of ${filteredPosts.length} publications`
                  : "Showing 12 of 48 publications"}
              </p>
            </div>

            {visiblePosts.length > 0 ? (
              <>
                <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                  {visiblePosts.map((post) => (
                    <PublicationCard key={post.id} post={post} />
                  ))}
                </div>

                {pageCount > 1 ? (
                  <nav
                    className="mt-16 flex items-center justify-center gap-2"
                    aria-label="Research pagination"
                  >
                    <Link
                      href={createPageHref(
                        { query, category, year },
                        Math.max(1, safePage - 1),
                      )}
                      className="flex size-10 items-center justify-center rounded-md border border-[#cbd2da] bg-white text-sm font-bold text-[#000613] hover:bg-[#000613] hover:text-white"
                      aria-label="Previous page"
                    >
                      &lt;
                    </Link>
                    {Array.from({ length: pageCount }).map((_, index) => {
                      const page = index + 1;
                      return (
                        <Link
                          key={page}
                          href={createPageHref({ query, category, year }, page)}
                          className={`flex size-10 items-center justify-center rounded-md border text-sm font-bold ${
                            page === safePage
                              ? "border-[#000613] bg-[#000613] text-white"
                              : "border-[#cbd2da] bg-white text-[#000613] hover:bg-[#000613] hover:text-white"
                          }`}
                        >
                          {page}
                        </Link>
                      );
                    })}
                    <Link
                      href={createPageHref(
                        { query, category, year },
                        Math.min(pageCount, safePage + 1),
                      )}
                      className="flex size-10 items-center justify-center rounded-md border border-[#cbd2da] bg-white text-sm font-bold text-[#000613] hover:bg-[#000613] hover:text-white"
                      aria-label="Next page"
                    >
                      &gt;
                    </Link>
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="rounded-lg border border-[#cbd2da] bg-white p-8 text-center shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-[#000613]">
                  Research publications will appear here.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#43474e]">
                  Published research posts from the admin dashboard will display
                  in this directory after approval.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#000613] px-6 py-24 text-white md:px-16">
          <div className="absolute right-0 top-0 hidden h-full w-[31%] opacity-10 lg:block">
            <div className="mt-0 h-14 bg-white" />
            <div className="mx-auto mt-10 flex max-w-xs justify-between">
              <div className="h-28 w-9 bg-white" />
              <div className="h-28 w-9 bg-white" />
              <div className="h-28 w-9 bg-white" />
            </div>
            <div className="absolute bottom-28 right-0 h-14 w-full bg-white" />
          </div>
          <div className="relative mx-auto max-w-[1280px] text-center">
            <h2 className="font-serif text-4xl font-bold">
              Contribute to the Union Archive
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/86">
              Are you a scholar, policy analyst, or student researcher? SSDU
              invites high-quality submissions for our quarterly journal and
              digital archive. Share your insights with a global network of
              diplomats and academics.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-md bg-[#f9d28b] px-10 text-sm font-bold tracking-[0.08em] text-[#000613] transition hover:bg-[#e9c176]"
              >
                Submit Research
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-md border border-white/50 px-10 text-sm font-bold tracking-[0.08em] text-white transition hover:bg-white hover:text-[#000613]"
              >
                Author Guidelines
              </Link>
            </div>
            <p className="mt-14 text-xs uppercase tracking-[0.18em] text-white/50">
              Next submission deadline: June 30, 2024
            </p>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
