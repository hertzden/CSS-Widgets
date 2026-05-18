# Phase 5 — Pages & Post Listing UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the *content* layer up to parity with the live Gatsby site — formatted dates, computed reading time, post hero with cover image, post meta line, prev/next navigation, table of contents, homepage post cards with tag filtering, and the `/about` and `/guides` static pages. After this phase, the only spec features still missing are RSS / sitemap / manifest / GA / Disqus / OG images (Phase 6) and final QA (Phase 7).

**Architecture:** Data layer (`lib/posts.ts`, `lib/date.ts`) gains formatted dates, reading-time calc, and prev/next neighbour lookup. New components live under `components/<Name>/<Name>.tsx` + `.module.css`. The post route (`app/[slug]/page.tsx`) becomes a composition of `PageTitle` (hero with optional cover background), the article body, `PrevNext`, and optional `Toc`. The homepage becomes server-rendered server-side data passed to a small client `<TagFilter>` that filters cards. Static pages live at `app/about/page.tsx` and `app/guides/page.tsx` as plain TSX (prose embedded inline — short enough that MDX is overkill, but the path is open if you want it later).

**Tech Stack:** Next.js 16 (App Router), TypeScript, CSS Modules. No new runtime libraries (one tiny test of `Intl.DateTimeFormat` for dates, native IntersectionObserver for Toc).

**Spec:** `docs/superpowers/specs/2026-05-17-gatsby-to-nextjs-migration-design.md`

**Starting state:** Branch `next-migration`. Phases 1-4 complete. Header, Footer, dark mode, theme tokens working. Posts render with full plugin chain but no cover hero, no formatted dates, no prev/next, no tags, no Toc.

---

## File structure after Phase 5

```
/
├── app/
│   ├── layout.tsx                # unchanged
│   ├── page.tsx                  # MODIFIED: rich post listing with tag filter
│   ├── [slug]/page.tsx           # MODIFIED: PageTitle + PostMeta + PrevNext + Toc
│   ├── about/page.tsx            # NEW
│   └── guides/page.tsx           # NEW
├── components/
│   ├── PageTitle/                # NEW (hero with optional cover bg)
│   ├── PostExcerpt/              # NEW (homepage card)
│   ├── PostMeta/                 # NEW (date + reading time + inline tags)
│   ├── PrevNext/                 # NEW (post nav)
│   ├── TagList/                  # NEW (tag chips — display + filter modes)
│   ├── Toc/                      # NEW (client component, IntersectionObserver)
│   └── HomePostList/             # NEW (client wrapper that does tag-filtering)
├── lib/
│   ├── posts.ts                  # MODIFIED: normalize date to ISO string, add timeToRead, prev/next, all-tags
│   └── date.ts                   # NEW (formatDate helper)
└── content/posts/                # unchanged
```

---

## Task 1: Data layer upgrades — `lib/posts.ts` + `lib/date.ts`

**Files:**
- Create: `lib/date.ts`
- Modify: `lib/posts.ts`

Three additions feed every UI piece downstream:
- **`date` as canonical ISO string.** Today `gray-matter` parses YAML dates into JS `Date` objects, which then render ugly. Normalise to `YYYY-MM-DD` strings at the boundary so the rest of the app sees `string`.
- **`timeToRead` (minutes).** Count words in the MDX body, divide by 200 (typical reading speed), round up. Surfaced as a number on each `Post`.
- **`getAdjacentPosts(slug)`** returning `{ prev, next }` based on date-descending sort. Newest neighbour = `prev`, oldest = `next` (mirrors Gatsby's reading order).
- **`getAllTags()`** returning a `{ title, count }[]` index, sorted by count desc.

- [ ] **Step 1:** Create `lib/date.ts` with EXACTLY this content:

```ts
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Format an ISO `YYYY-MM-DD` (or any string the Date constructor accepts) as "June 4, 2020". */
export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}
```

- [ ] **Step 2:** Overwrite `lib/posts.ts` with EXACTLY this content (adds three new exports, normalises date, no other behavior change):

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const WORDS_PER_MINUTE = 200;

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  cover?: { img: string; source?: string; url?: string };
  tags?: string[];
  showToc?: boolean;
  description?: string;
};

export type Post = {
  slug: string;
  rawSlug: string;
  frontmatter: PostFrontmatter;
  content: string;
  filePath: string;
  timeToRead: number;
};

export type TagCount = { title: string; count: number };

function normalizeSlug(rawSlug: string): string {
  return rawSlug.replace(/^\/+|\/+$/g, "");
}

function normalizeCodeFences(content: string): string {
  return content.replace(
    /^```\s*([A-Za-z0-9]+):title=([^\s`]+)\s*$/gm,
    (_match, lang: string, title: string) =>
      `\`\`\`${lang.toLowerCase()} title="${title}"`,
  );
}

function rewriteRelativeImages(content: string, slug: string): string {
  return content.replace(
    /(!\[[^\]]*\]\()([^)]+)(\))/g,
    (match, prefix: string, url: string, suffix: string) => {
      if (
        url.startsWith("/") ||
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:") ||
        url.startsWith("#")
      ) {
        return match;
      }
      return `${prefix}/posts/${slug}/${url}${suffix}`;
    },
  );
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    // Some frontmatter dates are full ISO strings; trim to YYYY-MM-DD.
    return value.slice(0, 10);
  }
  return "";
}

function countWords(input: string): number {
  return input.trim().split(/\s+/).filter(Boolean).length;
}

export function getAllPosts(): Post[] {
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const posts: Post[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "drafts") continue;

    const dir = path.join(POSTS_DIR, entry.name);
    const mdxFile = fs
      .readdirSync(dir)
      .find((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    if (!mdxFile) continue;

    const filePath = path.join(dir, mdxFile);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;

    if (!fm.slug) {
      throw new Error(`Post is missing 'slug' frontmatter: ${filePath}`);
    }

    const slug = normalizeSlug(fm.slug);
    const transformed = rewriteRelativeImages(
      normalizeCodeFences(content),
      slug,
    );
    const normalizedFm: PostFrontmatter = {
      ...fm,
      date: normalizeDate(fm.date),
    };
    const timeToRead = Math.max(1, Math.ceil(countWords(content) / WORDS_PER_MINUTE));

    posts.push({
      slug,
      rawSlug: fm.slug,
      frontmatter: normalizedFm,
      content: transformed,
      filePath,
      timeToRead,
    });
  }

  posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): {
  prev: Post | undefined;
  next: Post | undefined;
} {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  // Posts are sorted newest-first, so prev (newer) is at idx-1; next (older) is at idx+1.
  return {
    prev: posts[idx - 1],
    next: posts[idx + 1],
  };
}

export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([title, count]) => ({ title, count })).sort(
    (a, b) => b.count - a.count || a.title.localeCompare(b.title),
  );
}
```

- [ ] **Step 3:** TypeScript check + smoke test:
  ```
  npx tsc --noEmit --project tsconfig.json
  ```
  Expected: exit 0.

  Then:
  ```
  npx --yes tsx -e "import('./lib/posts.ts').then(m => { const p = m.getPostBySlug('how-to-get-started-with-css-in-js'); if (!p) throw new Error('missing'); console.log('date:', p.frontmatter.date, '|', 'timeToRead:', p.timeToRead); const {prev, next} = m.getAdjacentPosts('how-to-get-started-with-css-in-js'); console.log('prev:', prev?.slug, '| next:', next?.slug); console.log('tags:', JSON.stringify(m.getAllTags().slice(0,5))); });"
  ```
  Expected:
  - `date: 2020-06-04` (a plain `YYYY-MM-DD` string, NOT a Date)
  - `timeToRead:` a positive integer ≥ 1
  - For the newest post (`how-to-get-started-with-css-in-js`), `prev: undefined`. `next` will be `button-vs-link` (the second newest).
  - `tags:` a JSON array of `{title, count}` objects.

  If `date` still looks like an ISO timestamp with `T`, the `normalizeDate` function isn't applying — STOP and report what `typeof fm.date` actually is.

- [ ] **Step 4:** Commit:
  ```
  git add lib/date.ts lib/posts.ts
  git commit -m "feat: normalize date, compute timeToRead, add adjacency + tag index in lib/posts"
  ```

---

## Task 2: `<PostMeta>` component

**Files:**
- Create: `components/PostMeta/PostMeta.tsx`, `components/PostMeta/PostMeta.module.css`

Renders: formatted date, reading time, and (optionally) inline tags.

- [ ] **Step 1:** Create `components/PostMeta/PostMeta.tsx` with EXACTLY this content:

```tsx
import { formatDate } from "@/lib/date";
import styles from "./PostMeta.module.css";

export function PostMeta({
  date,
  timeToRead,
  tags,
  variant = "card",
}: {
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  variant?: "card" | "hero";
}) {
  return (
    <p
      className={`${styles.meta} ${variant === "hero" ? styles.hero : ""}`}
    >
      <span className={styles.item}>
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
      <span className={styles.dot} aria-hidden="true">·</span>
      <span className={styles.item}>{timeToRead} min read</span>
      {tags && tags.length > 0 && (
        <>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </span>
        </>
      )}
    </p>
  );
}
```

- [ ] **Step 2:** Create `components/PostMeta/PostMeta.module.css`:

```css
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  font-size: 1.4rem;
  color: var(--color-text);
  opacity: 0.85;
  margin: 0 0 1rem 0;
}
.hero {
  color: #fff;
  opacity: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
.dot { opacity: 0.6; }

.tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.tag {
  background: var(--color-accentBackground);
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  font-size: 1.2rem;
  white-space: nowrap;
}
.hero .tag {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
```

- [ ] **Step 3:** Sanity-check TS:
  `npx tsc --noEmit --project tsconfig.json`
  Expected: exit 0.

- [ ] **Step 4:** Commit:
  ```
  git add components/PostMeta
  git commit -m "feat: add PostMeta component (formatted date, reading time, tags)"
  ```

---

## Task 3: `<PageTitle>` component (post hero with optional cover)

**Files:**
- Create: `components/PageTitle/PageTitle.tsx`, `components/PageTitle/PageTitle.module.css`

Renders a hero block at the top of a page. For posts, accepts a `cover` (optional). Cover image lives at `/posts/<slug>/<filename>` (already copied by `lib/assets.ts`).

- [ ] **Step 1:** Create `components/PageTitle/PageTitle.tsx`:

```tsx
import type { ReactNode } from "react";
import styles from "./PageTitle.module.css";

export function PageTitle({
  cover,
  children,
}: {
  cover?: { src: string; source?: string; url?: string };
  children: ReactNode;
}) {
  return (
    <section
      className={`${styles.title} ${cover ? styles.withCover : ""}`}
      style={cover ? { backgroundImage: `url("${cover.src}")` } : undefined}
    >
      <div className={styles.inner}>{children}</div>
      {cover?.source && cover?.url && (
        <a
          className={styles.attribution}
          href={cover.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cover: {cover.source}
        </a>
      )}
    </section>
  );
}
```

- [ ] **Step 2:** Create `components/PageTitle/PageTitle.module.css`:

```css
.title {
  position: relative;
  padding: 4rem 2rem;
  background: var(--color-boxBackground);
}
.title h1 {
  font-size: 3.6rem;
  line-height: 1.15;
  margin: 0 0 1rem 0;
}

.withCover {
  background-size: cover;
  background-position: center;
  color: #fff;
  min-height: 32vh;
  display: flex;
  align-items: flex-end;
}
.withCover::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.65));
  pointer-events: none;
}
.withCover .inner { position: relative; z-index: 1; }
.withCover h1 { color: #fff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }

.inner {
  max-width: 1140px;
  margin: 0 auto;
  width: 100%;
}

.attribution {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  z-index: 1;
}
.attribution:hover { color: #fff; text-decoration: underline; }
```

- [ ] **Step 3:** TS check, commit:
  ```
  npx tsc --noEmit --project tsconfig.json
  git add components/PageTitle
  git commit -m "feat: add PageTitle component with optional cover image background"
  ```

---

## Task 4: `<PrevNext>` component

**Files:**
- Create: `components/PrevNext/PrevNext.tsx`, `components/PrevNext/PrevNext.module.css`

Renders two link cards at the bottom of a post — previous and next.

- [ ] **Step 1:** Create `components/PrevNext/PrevNext.tsx`:

```tsx
import Link from "next/link";
import styles from "./PrevNext.module.css";

type Neighbour = { slug: string; title: string };

export function PrevNext({
  prev,
  next,
}: {
  prev?: Neighbour;
  next?: Neighbour;
}) {
  if (!prev && !next) return null;
  return (
    <nav className={styles.nav} aria-label="Post navigation">
      {prev ? (
        <Link href={`/${prev.slug}`} rel="prev" className={styles.prev}>
          <span className={styles.label}>← Previous post</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/${next.slug}`} rel="next" className={styles.next}>
          <span className={styles.label}>Next post →</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
```

- [ ] **Step 2:** Create `components/PrevNext/PrevNext.module.css`:

```css
.nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 4rem 0 2rem;
}

.prev, .next {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.5rem;
  background: var(--color-boxBackground);
  border: 1px solid var(--color-accentBackground);
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
  transition: background 0.2s;
}
.prev:hover, .next:hover {
  background: var(--color-hoverBackground);
  text-decoration: none;
}
.next { text-align: right; }

.label {
  font-size: 1.3rem;
  color: var(--color-link);
}
.title {
  font-weight: 600;
}
```

- [ ] **Step 3:** Commit:
  ```
  git add components/PrevNext
  git commit -m "feat: add PrevNext component for post-to-post navigation"
  ```

---

## Task 5: `<Toc>` component (client, scroll-spy)

**Files:**
- Create: `components/Toc/Toc.tsx`, `components/Toc/Toc.module.css`

Reads headings from the rendered article, lists them, highlights the active one via `IntersectionObserver`. Activates only on posts where `frontmatter.showToc === true`.

- [ ] **Step 1:** Create `components/Toc/Toc.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import styles from "./Toc.module.css";

type Heading = { id: string; text: string; depth: number };

export function Toc({ selector = "article h2, article h3" }: { selector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    ).filter((n) => n.id);
    setHeadings(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent ?? "",
        depth: Number(n.nodeName[1]),
      })),
    );

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [selector]);

  if (headings.length === 0) return null;
  const minDepth = Math.min(...headings.map((h) => h.depth));

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.tocTitle}>Contents</p>
      <ul className={styles.list}>
        {headings.map((h) => (
          <li
            key={h.id}
            className={`${styles.item} ${activeId === h.id ? styles.active : ""}`}
            style={{ paddingLeft: `${(h.depth - minDepth) * 1.2}rem` }}
          >
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2:** Create `components/Toc/Toc.module.css`:

```css
.toc {
  background: var(--color-boxBackground);
  border-left: 3px solid var(--color-link);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  font-size: 1.4rem;
}
.tocTitle {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.2rem;
  color: var(--color-link);
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item {
  margin: 0.25rem 0;
  line-height: 1.4;
}
.item a {
  color: var(--color-text);
  text-decoration: none;
}
.item a:hover { color: var(--color-link); }
.active > a { color: var(--color-link); font-weight: 600; }

@media (min-width: 70em) {
  .toc {
    position: sticky;
    top: 16rem;
    align-self: flex-start;
  }
}
```

- [ ] **Step 3:** Commit:
  ```
  git add components/Toc
  git commit -m "feat: add Toc client component with IntersectionObserver scroll-spy"
  ```

---

## Task 6: Update post route `app/[slug]/page.tsx`

**Files:**
- Modify: `app/[slug]/page.tsx`

Compose the new pieces: `PageTitle` with cover, `PostMeta`, optional `Toc`, article body (unchanged), `PrevNext`.

- [ ] **Step 1:** Overwrite `app/[slug]/page.tsx` with EXACTLY this content:

```tsx
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
} from "@/lib/posts";
import { mdxOptions } from "@/lib/mdx";
import { PageTitle } from "@/components/PageTitle/PageTitle";
import { PostMeta } from "@/components/PostMeta/PostMeta";
import { PrevNext } from "@/components/PrevNext/PrevNext";
import { Toc } from "@/components/Toc/Toc";
import type { Metadata } from "next";
import styles from "./post.module.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: mdxOptions,
  });
  const { prev, next } = getAdjacentPosts(slug);

  const cover = post.frontmatter.cover
    ? {
        src: `/posts/${slug}/${post.frontmatter.cover.img}`,
        source: post.frontmatter.cover.source,
        url: post.frontmatter.cover.url,
      }
    : undefined;

  return (
    <>
      <PageTitle cover={cover}>
        <h1>{post.frontmatter.title}</h1>
        <PostMeta
          variant="hero"
          date={post.frontmatter.date}
          timeToRead={post.timeToRead}
          tags={post.frontmatter.tags}
        />
      </PageTitle>
      <div className={styles.layout}>
        {post.frontmatter.showToc && <Toc />}
        <article className={styles.article}>{content}</article>
      </div>
      <PrevNext
        prev={prev && { slug: prev.slug, title: prev.frontmatter.title }}
        next={next && { slug: next.slug, title: next.frontmatter.title }}
      />
    </>
  );
}
```

- [ ] **Step 2:** Create `app/[slug]/post.module.css`:

```css
.layout {
  display: grid;
  gap: 2rem;
  margin: 2rem 0;
}
@media (min-width: 70em) {
  .layout {
    grid-template-columns: 220px 1fr;
    gap: 3rem;
  }
}
.article {
  max-width: 780px;
  line-height: 3.2rem;
}
.article img { max-width: 100%; height: auto; border-radius: 0.5rem; }
.article h2, .article h3, .article h4, .article h5, .article h6 {
  color: var(--color-postHeading);
  margin-top: 3rem;
}
.article :global(.heading-anchor) {
  color: inherit;
  text-decoration: none;
}
.article :global(figure[data-rehype-pretty-code-figure]) {
  margin: 2rem 0;
}
.article :global([data-rehype-pretty-code-title]) {
  background: var(--color-postHeading);
  color: #fff;
  padding: 0.4rem 1rem;
  font-size: 1.4rem;
  border-radius: 0.4rem 0.4rem 0 0;
}
.article :global(pre) {
  padding: 1.2rem;
  border-radius: 0 0 0.4rem 0.4rem;
  overflow-x: auto;
  font-size: 1.4rem;
}
```

- [ ] **Step 3:** Build:
  ```
  rm -rf out && npm run build
  ```
  Expected: succeeds.

- [ ] **Step 4:** Spot check the css-in-js post (has cover, has Toc):
  ```
  grep -o 'background-image: url("/posts/how-to-get-started-with-css-in-js/css-in-js.svg")' out/how-to-get-started-with-css-in-js/index.html | head
  grep -oE 'aria-label="Table of contents"' out/how-to-get-started-with-css-in-js/index.html | head
  grep -oE 'aria-label="Post navigation"' out/how-to-get-started-with-css-in-js/index.html | head
  grep -o 'June 4, 2020' out/how-to-get-started-with-css-in-js/index.html | head
  ```
  Expected: each grep matches (Toc is rendered but text-content is empty on the server side since IntersectionObserver-based discovery happens on the client — the `<nav aria-label="Table of contents">` should still exist as a wrapper if any markup is server-rendered, OR the `<nav>` may only exist after client mount. If the Toc grep is empty, it's because the component returns null until headings load — this is acceptable; verify on the Netlify preview instead.).

- [ ] **Step 5:** Commit:
  ```
  git add 'app/[slug]/page.tsx' 'app/[slug]/post.module.css'
  git commit -m "feat: post page with cover hero, meta, toc, prev/next"
  ```

---

## Task 7: `<PostExcerpt>` + `<TagList>` + `<HomePostList>` (homepage)

**Files:**
- Create: `components/PostExcerpt/PostExcerpt.tsx`, `components/PostExcerpt/PostExcerpt.module.css`
- Create: `components/TagList/TagList.tsx`, `components/TagList/TagList.module.css`
- Create: `components/HomePostList/HomePostList.tsx`, `components/HomePostList/HomePostList.module.css`
- Modify: `app/page.tsx`

- [ ] **Step 1:** Create `components/PostExcerpt/PostExcerpt.tsx`:

```tsx
import Link from "next/link";
import { PostMeta } from "@/components/PostMeta/PostMeta";
import styles from "./PostExcerpt.module.css";

type Props = {
  slug: string;
  title: string;
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  description?: string;
  coverSrc?: string;
};

export function PostExcerpt({
  slug,
  title,
  date,
  timeToRead,
  tags,
  description,
  coverSrc,
}: Props) {
  return (
    <article className={styles.card}>
      {coverSrc && (
        <Link href={`/${slug}`} className={styles.coverLink}>
          <span
            className={styles.cover}
            role="img"
            aria-label={`Cover image for ${title}`}
            style={{ backgroundImage: `url("${coverSrc}")` }}
          />
        </Link>
      )}
      <div className={styles.body}>
        <h2 className={styles.heading}>
          <Link href={`/${slug}`}>{title}</Link>
        </h2>
        <PostMeta date={date} timeToRead={timeToRead} tags={tags} />
        {description && <p className={styles.description}>{description}</p>}
        <Link href={`/${slug}`} className={styles.readMore}>
          Read more →
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 2:** Create `components/PostExcerpt/PostExcerpt.module.css`:

```css
.card {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--color-boxBackground);
  border: 1px solid var(--color-accentBackground);
  border-radius: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
@media (min-width: 50em) {
  .card { grid-template-columns: 200px 1fr; }
}

.coverLink { display: block; }
.cover {
  display: block;
  width: 100%;
  height: 140px;
  background-size: cover;
  background-position: center;
  border-radius: 0.4rem;
}
@media (min-width: 50em) {
  .cover { height: 100%; min-height: 140px; }
}

.heading {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}
.heading a { color: var(--color-postHeading); text-decoration: none; }
.heading a:hover { text-decoration: underline; }

.description {
  margin: 0.5rem 0 1rem 0;
}

.readMore {
  font-weight: 600;
  color: var(--color-link);
}
```

- [ ] **Step 3:** Create `components/TagList/TagList.tsx`:

```tsx
"use client";

import styles from "./TagList.module.css";

type Tag = { title: string; count: number };

export function TagList({
  tags,
  activeTag,
  onSelect,
}: {
  tags: readonly Tag[];
  activeTag?: string;
  onSelect: (tag: string | undefined) => void;
}) {
  const all = { title: "All", count: tags.reduce((s, t) => s + t.count, 0) };
  const allTags = [all, ...tags];
  return (
    <div className={styles.list} role="group" aria-label="Filter posts by tag">
      {allTags.map((tag) => {
        const isAll = tag.title === "All";
        const isActive = isAll ? !activeTag : activeTag === tag.title;
        return (
          <button
            key={tag.title}
            type="button"
            className={`${styles.tag} ${isActive ? styles.active : ""}`}
            aria-pressed={isActive}
            onClick={() => onSelect(isAll ? undefined : tag.title)}
          >
            {tag.title}
            <span className={styles.count}>{tag.count}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4:** Create `components/TagList/TagList.module.css`:

```css
.list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 2rem 0;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: var(--color-boxBackground);
  border: 1px solid var(--color-accentBackground);
  border-radius: 999px;
  font-size: 1.4rem;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.tag:hover { border-color: var(--color-link); color: var(--color-link); }
.active {
  background: var(--color-link);
  color: #fff;
  border-color: var(--color-link);
}
.count {
  background: var(--color-accentBackground);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  font-size: 1.1rem;
}
.active .count { background: rgba(255, 255, 255, 0.25); }
```

- [ ] **Step 5:** Create `components/HomePostList/HomePostList.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PostExcerpt } from "@/components/PostExcerpt/PostExcerpt";
import { TagList } from "@/components/TagList/TagList";
import styles from "./HomePostList.module.css";

type ListPost = {
  slug: string;
  title: string;
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  description?: string;
  coverSrc?: string;
};

export function HomePostList({
  posts,
  tags,
}: {
  posts: readonly ListPost[];
  tags: readonly { title: string; count: number }[];
}) {
  const [activeTag, setActiveTag] = useState<string | undefined>();
  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  return (
    <>
      <TagList tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
      <div className={styles.list}>
        {filtered.map((post) => (
          <PostExcerpt key={post.slug} {...post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className={styles.empty}>No posts tagged "{activeTag}".</p>
      )}
    </>
  );
}
```

- [ ] **Step 6:** Create `components/HomePostList/HomePostList.module.css`:

```css
.list {
  display: grid;
  gap: 1.5rem;
}
.empty {
  text-align: center;
  opacity: 0.7;
  margin: 2rem 0;
}
```

- [ ] **Step 7:** Overwrite `app/page.tsx`:

```tsx
import { getAllPosts, getAllTags } from "@/lib/posts";
import { HomePostList } from "@/components/HomePostList/HomePostList";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const listPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    timeToRead: p.timeToRead,
    tags: p.frontmatter.tags,
    description: p.frontmatter.description,
    coverSrc: p.frontmatter.cover
      ? `/posts/${p.slug}/${p.frontmatter.cover.img}`
      : undefined,
  }));
  return (
    <>
      <h1>Posts</h1>
      <HomePostList posts={listPosts} tags={tags} />
    </>
  );
}
```

- [ ] **Step 8:** Build and verify:
  ```
  rm -rf out && npm run build
  ```
  Then:
  ```
  grep -o 'Filter posts by tag' out/index.html | head
  grep -oE 'aria-label="Cover image for [^"]+"' out/index.html | head -3
  grep -o 'June 4, 2020' out/index.html | head
  ```
  Expected: at least one match for each. If `Filter posts by tag` is empty, the `TagList` markup is missing — STOP.

- [ ] **Step 9:** Commit:
  ```
  git add components/PostExcerpt components/TagList components/HomePostList app/page.tsx
  git commit -m "feat: homepage with post cards, cover images, and tag filter"
  ```

---

## Task 8: `/about` and `/guides` static pages

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/guides/page.tsx`

`/about` port: prose from legacy `_legacy/src/pages/about.js`. `/guides` was a near-empty placeholder in the original — same idea here.

- [ ] **Step 1:** Create `app/about/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About CSS Widgets — a platform focused on CSS, HTML, Accessibility, and JavaScript.",
};

export default function AboutPage() {
  return (
    <>
      <h1>About CSS Widgets</h1>
      <p>
        Hello <span aria-label="waving hand" role="img">👋</span> reader, welcome to
        CSS Widgets — a platform focused on the basics of{" "}
        <strong>CSS, HTML, Accessibility, and JavaScript.</strong> Here you will
        learn and grow as a developer/designer irrespective of your experience.
      </p>
      <p>Here is what you will find on CSS Widgets:</p>
      <ul>
        <li>Practical tips to write accessible UI components.</li>
        <li>
          Basics of HTML semantics, CSS methodology, CSS Grid/Flex, color contrast,
          focus management, and ARIA.
        </li>
        <li>A community of like-minded developers/designers.</li>
        <li>Easy to customize and accessible code snippets.</li>
        <li>
          Complete "How-To" guides for Layouts, CSS Modules, CSS-in-JS, SASS, and
          Accessibility.
        </li>
        <li>Advanced guides and snippets on styling in Next.js.</li>
      </ul>
      <h2>Meet the Author</h2>
      <p>
        Hey, I'm <strong>Harshit Purwar.</strong> User Experience Engineer working on
        design systems, the JAMstack, accessibility, and user/developer experience.
      </p>
    </>
  );
}
```

- [ ] **Step 2:** Create `app/guides/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides",
  description: "Guides on CSS, HTML, Accessibility, and modern front-end practices.",
};

export default function GuidesPage() {
  return (
    <>
      <h1>Guides</h1>
      <p>Coming soon.</p>
    </>
  );
}
```

- [ ] **Step 3:** Build and verify both routes appear in the static output:
  ```
  rm -rf out && npm run build
  ls out/about/index.html out/guides/index.html
  grep -o 'About CSS Widgets' out/about/index.html | head
  grep -o 'Coming soon' out/guides/index.html | head
  ```
  Expected: both index.html files exist, both phrases present.

- [ ] **Step 4:** Commit:
  ```
  git add app/about app/guides
  git commit -m "feat: add /about and /guides static pages"
  ```

---

## Task 9: Push and verify on Netlify

**Files:** none (deploy)

- [ ] **Step 1:** Confirm clean tree: `git status --short` (only `.DS_Store` noise).

- [ ] **Step 2:** Push: `git push origin next-migration`.

- [ ] **Step 3:** User-driven: open the new deploy preview, click through:
  - **Homepage:** post cards (with cover images), filter by tag, date formatted ("June 4, 2020"), reading-time displayed.
  - **A post (`/how-to-get-started-with-css-in-js/`):** cover-image hero, post meta in hero, Toc on the left (visible above 70em width), article body, prev/next at bottom.
  - **`/about`:** prose page with About header + meet-the-author.
  - **`/guides`:** placeholder "Coming soon" page.
  - **Nav** links to `/about`, `/guides`, `/snippets` (the snippets page doesn't exist yet but the link is in nav from Phase 4 — clicking will 404; that's expected and fine for Phase 5).

  If anything is broken visually (e.g., cover doesn't load, dates malformed), capture screenshots and report. Stylistic preferences = Phase 7 polish.

---

## Done criteria

- ~9 new commits on `next-migration` (data layer, PostMeta, PageTitle, PrevNext, Toc, post route update, homepage list components + page update, static pages, push).
- Local `npm run build` succeeds and emits homepage + 5 posts + /about + /guides + /_not-found.
- Netlify preview is green and visually shows:
  - Rich post cards with cover image and tag filter on homepage.
  - Cover-image hero on posts.
  - Formatted dates ("June 4, 2020") site-wide.
  - Reading-time on every post.
  - Prev/next link cards at bottom of each post.
  - Table of contents on the css-in-js post (showToc: true).
- `master` untouched.

---

## What this plan deliberately does NOT do

- Snippets page (no inbound expectations beyond a 404 — was archived in legacy as `snippets-old.js`). Wire only if requested.
- Connect (social-links sidebar) — minor, can re-add in Phase 7 polish if visually missed.
- A search experience — Algolia is deferred per the spec.
- Disqus comment count on PostMeta — comes with Disqus integration in Phase 6.
- OG / social card image rendering — Phase 6.
- Pixel-perfect parity with the legacy site for spacing, fonts, and colors — Phase 7 polish.
- Custom `:focus` styling for accessibility beyond what's already in `globals.css`.
- Removing the legacy YAML files (`content/nav.yml`, `content/footer.yml`) — Phase 7 cleanup.
