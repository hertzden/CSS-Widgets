# Phase 6 — Cross-Cutting Features (RSS, Sitemap, Manifest, GA, Disqus, OG Images) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the six cross-cutting features that turn a content site into a complete, discoverable, social-friendly product: RSS feed, sitemap, PWA manifest, Google Analytics, Disqus comments, and per-post Open Graph images. After this phase the only remaining work is parity QA (Phase 7) and cutover.

**Architecture:** Three Next.js built-in conventions (`app/sitemap.ts`, `app/manifest.ts`, `app/[slug]/opengraph-image.tsx`), one route handler (`app/rss.xml/route.ts`), one third-party Script (`@next/third-parties/google` for GA in `app/layout.tsx`), and one client component (`<DisqusThread>` rendered conditionally inside the post route). Per-page `generateMetadata` gains OG/Twitter tags so social previews look right.

**Tech Stack:** Next.js 16 App Router static export, `@next/third-parties` for GA, `disqus-react` for comments (already in legacy ecosystem). No new HTML/CSS scaffolding — this phase is all glue/metadata.

**Spec:** `docs/superpowers/specs/2026-05-17-gatsby-to-nextjs-migration-design.md`

**Starting state:** Branch `next-migration`. Phases 1-5 complete. The site is visually complete; this phase makes it discoverable + social + commentable.

---

## Locked-in legacy values to carry forward

- **GA measurement ID:** `G-LHTW9V1F9R` (from old `gatsby-config.js`).
- **PWA manifest:** name "CSS Widgets", display `standalone`, theme color `#150956`, background `#150956`, icon `/favicon.svg`.
- **Site URL for absolute links:** `https://css-widgets.com` (already in `lib/site.ts` as `siteMetadata.url`).
- **Disqus shortname:** lived in the legacy `.env` file as `GATSBY_DISQUS_NAME`. The user must set `NEXT_PUBLIC_DISQUS_NAME` in Netlify environment variables before this phase ships. The Disqus component renders nothing if the var is missing (so preview builds don't break).
- **Twitter handle:** `harshitpurwar` (already in `lib/site.ts`).

---

## File structure after Phase 6

```
/
├── app/
│   ├── layout.tsx                # MODIFIED: add GA + OG defaults in metadata
│   ├── manifest.ts               # NEW
│   ├── sitemap.ts                # NEW
│   ├── rss.xml/
│   │   └── route.ts              # NEW
│   ├── opengraph-image.tsx       # NEW (default site OG)
│   ├── [slug]/
│   │   ├── page.tsx              # MODIFIED: per-post OG/Twitter metadata, Disqus mount
│   │   └── opengraph-image.tsx   # NEW (dynamic per-post)
│   ├── about/page.tsx            # MODIFIED: OG metadata (small tweak)
│   └── guides/page.tsx           # MODIFIED: OG metadata (small tweak)
├── components/
│   └── DisqusThread/
│       ├── DisqusThread.tsx      # NEW (client)
│       └── DisqusThread.module.css
├── lib/
│   └── posts.ts                  # MODIFIED: add `excerpt` helper used by RSS
└── package.json                  # MODIFIED: + @next/third-parties, disqus-react
```

---

## Task 1: PWA manifest

**Files:**
- Create: `app/manifest.ts`

- [ ] **Step 1:** Create `app/manifest.ts` with EXACTLY this content:

```ts
import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.title,
    short_name: siteMetadata.title,
    description: siteMetadata.description,
    start_url: "/",
    display: "standalone",
    background_color: "#150956",
    theme_color: "#150956",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
```

- [ ] **Step 2:** Build and verify the manifest is emitted as a static file:
  ```
  rm -rf out && npm run build
  cat out/manifest.webmanifest | head -20
  ```
  Expected: the file exists and contains JSON with `"name": "CSS Widgets"`, the colors, and the icon entry.

  (Next emits `app/manifest.ts` to `out/manifest.webmanifest`. If it's emitted somewhere else by your Next version, find it: `find out -name "manifest*"`.)

- [ ] **Step 3:** Commit:
  ```
  git add app/manifest.ts
  git commit -m "feat: add PWA manifest (name, theme color, favicon)"
  ```

---

## Task 2: Sitemap

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1:** Create `app/sitemap.ts` with EXACTLY this content:

```ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteMetadata } from "@/lib/site";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "about", changeFrequency: "yearly", priority: 0.6 },
  { path: "guides", changeFrequency: "yearly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMetadata.url;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: path ? `${base}/${path}/` : `${base}/`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/${post.slug}/`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...postEntries];
}
```

- [ ] **Step 2:** Build and verify:
  ```
  rm -rf out && npm run build
  head -30 out/sitemap.xml
  ```
  Expected: XML output starting with `<?xml version="1.0"`, containing `<url>` entries for `/`, `/about/`, `/guides/`, and each post slug.

  Verify total entry count: `grep -c '<url>' out/sitemap.xml` should equal 8 (homepage + about + guides + 5 posts).

- [ ] **Step 3:** Commit:
  ```
  git add app/sitemap.ts
  git commit -m "feat: add sitemap.xml for homepage, static pages, and all posts"
  ```

---

## Task 3: RSS feed

**Files:**
- Modify: `lib/posts.ts` (add an `excerpt` derived field)
- Create: `app/rss.xml/route.ts`

The RSS feed needs a short description per post. Frontmatter has an optional `description` but not all posts use it. Fall back to the first ~200 characters of the MDX body (stripped of MDX/markdown syntax).

- [ ] **Step 1:** Modify `lib/posts.ts` — add an `excerpt` derived field on `Post`. Apply this targeted change:

a. Edit the `Post` type to add `excerpt`:
```ts
export type Post = {
  slug: string;
  rawSlug: string;
  frontmatter: PostFrontmatter;
  content: string;
  filePath: string;
  timeToRead: number;
  excerpt: string;
};
```

b. Add this helper above `getAllPosts`:
```ts
function deriveExcerpt(fm: PostFrontmatter, body: string, max = 200): string {
  if (fm.description) return fm.description;
  // Strip MDX/markdown syntax: code fences, headings, images, links, html tags, multiple whitespace.
  const stripped = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`>#~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > max ? stripped.slice(0, max).trimEnd() + "…" : stripped;
}
```

c. Inside the `for` loop in `getAllPosts`, where you compute `timeToRead`, also compute the excerpt and include it in the `posts.push` object:
```ts
const timeToRead = Math.max(1, Math.ceil(countWords(content) / WORDS_PER_MINUTE));
const excerpt = deriveExcerpt(normalizedFm, content);

posts.push({
  slug,
  rawSlug: fm.slug,
  frontmatter: normalizedFm,
  content: transformed,
  filePath,
  timeToRead,
  excerpt,
});
```

- [ ] **Step 2:** Smoke-test the excerpt is populated:
  ```
  npx --yes tsx -e "import('./lib/posts.ts').then(m => { const p = m.getPostBySlug('how-to-get-started-with-css-in-js'); if (!p) throw new Error('missing'); console.log('excerpt:', p.excerpt.slice(0, 100)); });"
  ```
  Expected: a one-line preview of the post body, no markdown syntax visible.

- [ ] **Step 3:** Create `app/rss.xml/route.ts` with EXACTLY this content:

```ts
import { getAllPosts } from "@/lib/posts";
import { siteMetadata } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const posts = getAllPosts();
  const base = siteMetadata.url;
  const now = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${base}/${post.slug}/`;
      const pubDate = new Date(post.frontmatter.date).toUTCString();
      return `
    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${base}/</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
```

- [ ] **Step 4:** Build and verify:
  ```
  rm -rf out && npm run build
  head -30 out/rss.xml
  grep -c '<item>' out/rss.xml
  ```
  Expected:
  - XML output with `<channel>`, `<title>CSS Widgets</title>`, base URL.
  - `<item>` count = 5 (one per post).

  Optionally paste a few chars into a feed validator (https://validator.w3.org/feed/) during QA.

- [ ] **Step 5:** Commit:
  ```
  git add lib/posts.ts app/rss.xml
  git commit -m "feat: add RSS feed at /rss.xml with derived post excerpts"
  ```

---

## Task 4: Google Analytics

**Files:**
- Modify: `package.json` (add `@next/third-parties`)
- Modify: `app/layout.tsx`

- [ ] **Step 1:** Install:
  ```
  npm install @next/third-parties
  ```
  Expected: clean install. The package brings type-safe wrappers for GA, GTM, etc.

- [ ] **Step 2:** Edit `app/layout.tsx` — add the GA component before `</body>`. Apply this targeted change:

a. Add the import near the top (after the other `@/` imports):
```ts
import { GoogleAnalytics } from "@next/third-parties/google";
```

b. Inside the `<body>` element, after `<Footer />`, add:
```tsx
<GoogleAnalytics gaId="G-LHTW9V1F9R" />
```

After the edit, the body section reads:
```tsx
<body>
  <ThemeProvider>
    <a href="#main" className="skip-main">Skip to content</a>
    <Header />
    <main id="main">{children}</main>
    <Footer />
  </ThemeProvider>
  <GoogleAnalytics gaId="G-LHTW9V1F9R" />
</body>
```

- [ ] **Step 3:** Build and verify the GA script tag is present:
  ```
  rm -rf out && npm run build
  grep -o 'G-LHTW9V1F9R' out/index.html | head -2
  grep -o 'googletagmanager' out/index.html | head -2
  ```
  Expected: both grep return ≥ 1 match (the GA script tag is injected).

- [ ] **Step 4:** Commit:
  ```
  git add package.json package-lock.json app/layout.tsx
  git commit -m "feat: wire Google Analytics via @next/third-parties"
  ```

---

## Task 5: Disqus comments

**Files:**
- Modify: `package.json` (add `disqus-react`)
- Create: `components/DisqusThread/DisqusThread.tsx`, `components/DisqusThread/DisqusThread.module.css`
- Modify: `app/[slug]/page.tsx` (mount DisqusThread)

- [ ] **Step 1:** Install:
  ```
  npm install disqus-react
  ```

- [ ] **Step 2:** Create `components/DisqusThread/DisqusThread.tsx`:

```tsx
"use client";

import { DiscussionEmbed } from "disqus-react";
import styles from "./DisqusThread.module.css";

const SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_NAME;

export function DisqusThread({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  if (!SHORTNAME) return null;
  return (
    <section className={styles.thread} id="disqus_thread">
      <DiscussionEmbed
        shortname={SHORTNAME}
        config={{ identifier: slug, title, url: undefined }}
      />
    </section>
  );
}
```

- [ ] **Step 3:** Create `components/DisqusThread/DisqusThread.module.css`:

```css
.thread {
  margin: 4rem 0 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-accentBackground);
}
```

- [ ] **Step 4:** Mount in `app/[slug]/page.tsx`. Targeted change:

a. Add import:
```ts
import { DisqusThread } from "@/components/DisqusThread/DisqusThread";
```

b. After `<article>...</article>` and before `<PrevNext ...>`, add:
```tsx
<DisqusThread slug={post.slug} title={post.frontmatter.title} />
```

The render section now reads:
```tsx
<div className={styles.layout}>
  {post.frontmatter.showToc && <Toc />}
  <article className={styles.article}>{content}</article>
</div>
<DisqusThread slug={post.slug} title={post.frontmatter.title} />
<PrevNext
  prev={prev && { slug: prev.slug, title: prev.frontmatter.title }}
  next={next && { slug: next.slug, title: next.frontmatter.title }}
/>
```

- [ ] **Step 5:** Build:
  ```
  rm -rf out && npm run build
  ```
  Expected: succeeds. Because `NEXT_PUBLIC_DISQUS_NAME` is not set locally, `DisqusThread` returns `null` — no Disqus markup appears in the build output. That's the intended preview-safe behavior.

  Verify the build still emits 8 routes (5 posts + 3 static).

- [ ] **Step 6:** Commit:
  ```
  git add package.json package-lock.json components/DisqusThread 'app/[slug]/page.tsx'
  git commit -m "feat: mount DisqusThread on post pages (off when NEXT_PUBLIC_DISQUS_NAME unset)"
  ```

- [ ] **Step 7:** **MANUAL** — note for the user: in Netlify Site Settings → Build & Deploy → Environment, add a new variable `NEXT_PUBLIC_DISQUS_NAME` with the same shortname that was in the old `GATSBY_DISQUS_NAME`. After the next deploy, Disqus will render on post pages. (The implementer reports this — does not perform the action.)

---

## Task 6: Default site OG image + per-post OG images

**Files:**
- Create: `app/opengraph-image.tsx` (default fallback for any route)
- Create: `app/[slug]/opengraph-image.tsx` (per-post)

Uses Next's built-in `ImageResponse` (Satori-rendered JSX → static PNG at build time). Both files run during static export and emit PNGs into the right route directories.

- [ ] **Step 1:** Create `app/opengraph-image.tsx` with EXACTLY this content:

```tsx
import { ImageResponse } from "next/og";

export const alt = "CSS Widgets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #150956 0%, #2c0b8e 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: 32, opacity: 0.8, margin: 0 }}>css-widgets.com</p>
        <h1 style={{ fontSize: 96, fontWeight: 700, margin: "16px 0 0 0", lineHeight: 1.1 }}>
          CSS Widgets
        </h1>
        <p style={{ fontSize: 36, opacity: 0.85, margin: "32px 0 0 0" }}>
          Front-end Technologies — CSS, HTML, Accessibility
        </p>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 2:** Create `app/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const alt = "Post cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.frontmatter.title ?? "CSS Widgets";
  const tags = (post?.frontmatter.tags ?? []).slice(0, 3).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #150956 0%, #2c0b8e 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: 32, opacity: 0.85, margin: 0 }}>
          css-widgets.com
        </p>
        <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
          {title}
        </h1>
        <p style={{ fontSize: 30, opacity: 0.8, margin: 0 }}>{tags}</p>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 3:** Build and verify generated images:
  ```
  rm -rf out && npm run build
  ls out/opengraph-image*.png 2>/dev/null | head
  ls out/how-to-get-started-with-css-in-js/opengraph-image*.png 2>/dev/null | head
  ```
  Expected:
  - At least one PNG at the site root (default OG).
  - One PNG inside each post slug directory (e.g., `out/how-to-get-started-with-css-in-js/opengraph-image-<hash>.png`).

  If `next/og` reports an error like "satori not supported in this environment", capture it and STOP — escalate. Static export + `next/og` should work in Next 16, but if it doesn't, we fall back to a single static PNG referenced in metadata (Task 7).

- [ ] **Step 4:** Commit:
  ```
  git add app/opengraph-image.tsx 'app/[slug]/opengraph-image.tsx'
  git commit -m "feat: generate per-route OG images at build time"
  ```

---

## Task 7: Per-page OG / Twitter metadata via `generateMetadata`

**Files:**
- Modify: `app/layout.tsx` (set the site-wide OG defaults via the root `metadata` export)
- Modify: `app/[slug]/page.tsx` (per-post metadata block)
- Modify: `app/about/page.tsx`, `app/guides/page.tsx` (small additions)

The OG image files from Task 6 are picked up automatically by Next's metadata system — but only if the routes don't override OG fields incorrectly. Refine the root layout metadata to include site-wide twitter/openGraph defaults, and refine per-post metadata to include the post title + description.

- [ ] **Step 1:** Edit `app/layout.tsx` — expand the `metadata` export:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: { default: siteMetadata.title, template: `%s · ${siteMetadata.title}` },
  description: siteMetadata.description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: siteMetadata.title,
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: `@${siteMetadata.social.twitter}`,
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
};
```

(Keep the rest of `app/layout.tsx` unchanged.)

- [ ] **Step 2:** Edit `app/[slug]/page.tsx`'s `generateMetadata`:

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const description = post.frontmatter.description ?? post.excerpt;
  return {
    title: post.frontmatter.title,
    description,
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description,
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags ? [...post.frontmatter.tags] : undefined,
    },
    twitter: {
      title: post.frontmatter.title,
      description,
    },
  };
}
```

(The OG image is picked up automatically from `app/[slug]/opengraph-image.tsx` — no need to specify it here.)

- [ ] **Step 3:** Edit `app/about/page.tsx` — replace the `metadata` export with:

```ts
export const metadata: Metadata = {
  title: "About",
  description: "About CSS Widgets — a platform focused on CSS, HTML, Accessibility, and JavaScript.",
  openGraph: {
    title: "About CSS Widgets",
    description: "About CSS Widgets — a platform focused on CSS, HTML, Accessibility, and JavaScript.",
  },
};
```

- [ ] **Step 4:** Edit `app/guides/page.tsx` — replace `metadata` with:

```ts
export const metadata: Metadata = {
  title: "Guides",
  description: "Guides on CSS, HTML, Accessibility, and modern front-end practices.",
  openGraph: {
    title: "Guides",
    description: "Guides on CSS, HTML, Accessibility, and modern front-end practices.",
  },
};
```

- [ ] **Step 5:** Build and verify OG meta tags appear in HTML:

```
rm -rf out && npm run build
grep -oE '<meta property="og:[^"]+"' out/how-to-get-started-with-css-in-js/index.html | sort -u
grep -oE '<meta name="twitter:[^"]+"' out/how-to-get-started-with-css-in-js/index.html | sort -u
grep -oE 'opengraph-image[^"]*' out/how-to-get-started-with-css-in-js/index.html | head -1
```
Expected:
- og:type, og:title, og:description, og:image, og:url, og:site_name (most of these).
- twitter:card, twitter:creator, twitter:title, twitter:description, twitter:image.
- An `opengraph-image-<hash>.png` reference in the HTML (proving the image-from-file convention linked through).

If `opengraph-image` doesn't appear in the post HTML's meta tags, the OG image file isn't being auto-discovered — capture `head -c 5000 out/how-to-get-started-with-css-in-js/index.html | grep -A1 'og:image\|twitter:image'` and STOP.

- [ ] **Step 6:** Commit:
  ```
  git add app/layout.tsx 'app/[slug]/page.tsx' app/about/page.tsx app/guides/page.tsx
  git commit -m "feat: per-page OpenGraph and Twitter card metadata"
  ```

---

## Task 8: Push and verify Netlify preview

**Files:** none (deploy)

- [ ] **Step 1:** Confirm tree state:
  ```
  git status --short
  git log --oneline master..next-migration | head -10
  ```
  Expected: only `.DS_Store` noise; ~7-8 new commits from this phase.

- [ ] **Step 2:** Push:
  ```
  git push origin next-migration
  ```

- [ ] **Step 3:** User-driven verification once the preview is green:
  - **`/rss.xml`** — open in browser: should show RSS feed with 5 items. Optionally feed-validate.
  - **`/sitemap.xml`** — open in browser: lists 8 URLs.
  - **`/manifest.webmanifest`** — open in browser: returns JSON with name + theme colors. (Some browsers download instead of show — view source.)
  - **GA**: open DevTools → Network → filter "collect" while clicking a link. Expect a `https://www.google-analytics.com/g/collect?...` request on each pageview.
  - **OG image**: paste a post URL into the LinkedIn or Twitter card validator. Should show the dark gradient with title.
  - **Disqus**: will be empty unless `NEXT_PUBLIC_DISQUS_NAME` is set in Netlify env vars. After setting + redeploy, comments appear at the bottom of post pages.

  Paste the preview URL when verified.

---

## Done criteria

- 7-8 new commits on `next-migration` covering manifest, sitemap, RSS, GA, Disqus, OG images, per-page metadata.
- Local `npm run build` succeeds and emits: `out/manifest.webmanifest`, `out/sitemap.xml`, `out/rss.xml`, `out/opengraph-image*.png`, `out/<slug>/opengraph-image*.png`.
- HTML for every page contains correct OG and Twitter meta tags pointing to the right OG image.
- GA script loaded site-wide.
- Disqus mount renders empty (correct behavior) without env var; renders the thread when var is set.
- Master untouched.

---

## What this plan deliberately does NOT do

- Add Plausible / Fathom / any alternative analytics. GA only, per spec.
- Add Disqus moderation tools, custom themes, or alternative comment systems.
- Migrate existing Disqus threads — they should follow through unchanged since slugs are preserved and `identifier: slug` matches the legacy `disqusConfig`.
- Custom RSS fields beyond standard RSS 2.0 (no `<content:encoded>` HTML body — that was the legacy behavior but is heavier; can be re-added in Phase 7 polish if missed).
- Atom feed alongside RSS.
- Schema.org / JSON-LD structured data (out of spec; can be added later).
- `robots.txt` — not in spec but you may want one in Phase 7 polish.
- A signed-image OG variant (e.g., one that pulls the post's cover image into the OG). Could be a Phase 7 polish if visually missed.
