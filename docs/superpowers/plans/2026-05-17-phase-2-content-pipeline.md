# Phase 2 — Content Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Read MDX posts from `content/posts/` and render them at their real URLs. End state: all 5 existing posts are reachable at their original Gatsby URLs (slugs from frontmatter), rendering plain HTML with title + body. No remark/rehype plugin chain yet (Phase 3), no styled components (Phase 4), no cover images / embeds yet (Phase 3).

**Architecture:** Filesystem-driven static routes. `lib/posts.ts` walks `content/posts/`, parses frontmatter with `gray-matter`, returns a typed post list. `app/[slug]/page.tsx` is a dynamic route with `generateStaticParams()` that emits one HTML file per post. Post body is compiled with `next-mdx-remote/rsc` at build time. Homepage lists posts with simple anchor links.

**Tech Stack:** Next.js 16 (App Router), TypeScript, `gray-matter`, `next-mdx-remote`.

**Spec:** `docs/superpowers/specs/2026-05-17-gatsby-to-nextjs-migration-design.md`

**Starting state:** Branch `next-migration`, Phase 1 complete. App shows the "migration in progress" placeholder. Posts live at `content/posts/<YYYY-MM-DD>~<dir>/<slug>.mdx`.

---

## Frontmatter shape (observed)

```yaml
---
title: How to get started with CSS-in-JS
slug: /how-to-get-started-with-css-in-js/
date: 2020-06-04
cover:
  img: css-in-js.svg
  source: Vecteezy
  url: https://www.vecteezy.com/...
tags:
  - CSS-in-JS
  - CSS Architecture
showToc: true
---
```

Fields used in Phase 2: `title`, `slug`, `date`. Others parsed and carried in the type but unused this phase.

---

## File structure after Phase 2

```
/
├── app/
│   ├── [slug]/
│   │   └── page.tsx          # NEW: dynamic post route
│   ├── layout.tsx            # unchanged
│   ├── page.tsx              # MODIFIED: list of posts
│   └── globals.css           # unchanged
├── lib/                       # NEW
│   └── posts.ts              # NEW: filesystem read + frontmatter parse
├── content/posts/             # unchanged
└── package.json               # MODIFIED: + gray-matter, next-mdx-remote
```

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install `gray-matter` and `next-mdx-remote`**

Run:
```
npm install gray-matter next-mdx-remote
```

Expected: both added under `dependencies` in `package.json`. No peer-dep warnings that block the install. (Some `npm warn deprecated` lines from transitive deps are acceptable noise.)

- [ ] **Step 2: Confirm install**

Run: `grep -E '"(gray-matter|next-mdx-remote)"' package.json`
Expected: two lines, each showing the package and its installed version.

- [ ] **Step 3: Commit**

Run:
```
git add package.json package-lock.json
git commit -m "feat: add gray-matter and next-mdx-remote for MDX content pipeline"
```

---

## Task 2: Create `lib/posts.ts`

**Files:**
- Create: `lib/posts.ts`

Responsibility of this file: synchronous read of `content/posts/`, return a typed array of post metadata + raw MDX source. One function, two exported types.

- [ ] **Step 1: Create the file with this content:**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

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
  /** Normalized slug without leading/trailing slashes — used in URLs and as the [slug] route param. */
  slug: string;
  /** Raw slug exactly as written in frontmatter (may include leading/trailing slashes). */
  rawSlug: string;
  frontmatter: PostFrontmatter;
  /** Raw MDX source (frontmatter stripped). */
  content: string;
  /** Absolute path to the .mdx file (useful for resolving co-located assets later). */
  filePath: string;
};

function normalizeSlug(rawSlug: string): string {
  return rawSlug.replace(/^\/+|\/+$/g, "");
}

/** Reads all posts at build time. Sorted by date descending (newest first). */
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

    posts.push({
      slug: normalizeSlug(fm.slug),
      rawSlug: fm.slug,
      frontmatter: fm,
      content,
      filePath,
    });
  }

  posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
```

- [ ] **Step 2: Sanity check it compiles**

Run:
```
npx tsc --noEmit --project tsconfig.json
```
Expected: exits 0 (no type errors).

If it errors on `path.join(process.cwd(), ...)`, ensure `@types/node` is installed (it should be from create-next-app's defaults — if not, `npm install -D @types/node` and retry).

- [ ] **Step 3: Sanity check it runs and finds posts**

Write a one-shot script (no commit):
```
cat > /tmp/check-posts.ts <<'EOF'
import { getAllPosts } from "../Users/harshitpurwar/CSS-Widgets/lib/posts.ts";
const posts = getAllPosts();
console.log(`Found ${posts.length} posts:`);
for (const p of posts) console.log(` - ${p.slug}\t(${p.frontmatter.date})\t${p.frontmatter.title}`);
EOF
```

Actually simpler — run from the repo root using `tsx`:
```
npx --yes tsx -e "import('./lib/posts.ts').then(m => { const ps = m.getAllPosts(); console.log('count:', ps.length); for (const p of ps) console.log(p.slug, '|', p.frontmatter.date, '|', p.frontmatter.title); });"
```

Expected output:
```
count: 5
how-to-get-started-with-css-in-js | 2020-06-04 | How to get started with CSS-in-JS
... (4 more)
```

If `count: 5` is shown and slugs look like real URLs (no leading/trailing slashes), the function works.

- [ ] **Step 4: Commit**

Run:
```
git add lib/posts.ts
git commit -m "feat: add lib/posts.ts to read MDX content from filesystem"
```

---

## Task 3: Create dynamic post route `app/[slug]/page.tsx`

**Files:**
- Create: `app/[slug]/page.tsx`

- [ ] **Step 1: Create the directory and file**

Run: `mkdir -p app/\[slug\]` — note: brackets must be escaped for the shell, or just create via the editor.

- [ ] **Step 2: Write `app/[slug]/page.tsx` with this content:**

```tsx
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";

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
    options: { parseFrontmatter: false },
  });

  return (
    <article>
      <header>
        <h1>{post.frontmatter.title}</h1>
        <p>
          <time dateTime={post.frontmatter.date}>{post.frontmatter.date}</time>
        </p>
      </header>
      {content}
    </article>
  );
}
```

Notes on the code (do not add as comments — they're here for the engineer):
- `params` is a `Promise` in Next.js 15+ App Router and must be awaited.
- `parseFrontmatter: false` because we already stripped frontmatter in `lib/posts.ts`.
- No custom MDX components yet — Phase 3 will add the remark/rehype plugin chain and component map.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --project tsconfig.json`
Expected: exits 0.

If the import path `@/lib/posts` doesn't resolve, check `tsconfig.json` — create-next-app's default `"paths": { "@/*": ["./*"] }` should already cover it. If not, add it.

- [ ] **Step 4: Build and verify all 5 posts produced HTML**

Run:
```
rm -rf out && npm run build
```
Expected: build succeeds. The build log should show ≥5 static routes generated (e.g., a `Route` table listing dynamic routes resolved to specific slugs).

Verify the output files:
```
ls out/
```
Expected: should now include directories named after each post slug (e.g., `how-to-get-started-with-css-in-js/`), each containing an `index.html`. The directory structure depends on `trailingSlash: true` from Phase 1.

- [ ] **Step 5: Verify content of one post HTML**

Run:
```
grep -o '<h1>[^<]*</h1>' out/how-to-get-started-with-css-in-js/index.html
```
Expected: `<h1>How to get started with CSS-in-JS</h1>`

Also check that body content is present (look for a known phrase from the post):
```
grep -c 'CSS-in-JS bridges the gap' out/how-to-get-started-with-css-in-js/index.html
```
Expected: a count ≥ 1.

If either fails, capture the build log and STOP.

- [ ] **Step 6: Commit**

Run:
```
git add 'app/[slug]/page.tsx'
git commit -m "feat: add dynamic post route rendering MDX content"
```

(Single quotes around the path are important — the brackets are shell-special.)

---

## Task 4: List posts on the homepage

**Files:**
- Modify: `app/page.tsx`

Replace the migration placeholder with a real index of posts (still unstyled).

- [ ] **Step 1: Overwrite `app/page.tsx` with this content:**

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  return (
    <main>
      <h1>CSS Widgets</h1>
      <p>Front-end Technologies | CSS, HTML, Accessibility.</p>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`}>{post.frontmatter.title}</Link>{" "}
            <small>
              <time dateTime={post.frontmatter.date}>
                {post.frontmatter.date}
              </time>
            </small>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify the homepage lists all 5 posts**

Run:
```
rm -rf out && npm run build
grep -c '<li>' out/index.html
```
Expected: count ≥ 5 (one `<li>` per post).

Verify the links resolve to slug-based URLs:
```
grep -oE 'href="/[a-z-]+/?"' out/index.html
```
Expected: 5 hrefs, each pointing to a post slug.

- [ ] **Step 3: Commit**

Run:
```
git add app/page.tsx
git commit -m "feat: render real post list on homepage"
```

---

## Task 5: Push and verify Netlify preview

**Files:** none (CI action)

- [ ] **Step 1: Confirm branch state**

Run: `git log master..next-migration --oneline | head`
Expected: includes 4 new Phase 2 commits at the top (deps, lib/posts.ts, [slug]/page.tsx, homepage).

Run: `git status --short`
Expected: only the pre-existing `.DS_Store` mess (` M .DS_Store`, possibly `?? *_legacy/.DS_Store` etc.) — no untracked/unstaged work.

- [ ] **Step 2: Push the branch**

Run: `git push origin next-migration`
Expected: branch updated on origin. The existing draft PR #8 picks up the new commits automatically. Netlify retriggers the deploy preview.

- [ ] **Step 3: Wait for and verify Netlify preview**

User-driven step. After ~1-3 minutes, the new deploy preview should be green on PR #8.

Open the preview URL in a browser and verify:
- Homepage shows a list of 5 post titles, each a clickable link.
- Clicking any title navigates to a URL like `/how-to-get-started-with-css-in-js/`.
- That page shows the post's title in an `<h1>`, the date, and the unstyled post body.
- The browser tab title becomes the post title.

If anything is off, capture the preview build log link from PR checks and STOP.

- [ ] **Step 4: Smoke-check URL preservation**

For at least 2 posts, compare the new preview URL against the current live Gatsby URL on css-widgets.com:
- Live: `https://css-widgets.com/<slug>/`
- Preview: `<preview-url>/<slug>/`

The slug segment must match exactly. This is the SEO promise.

---

## Done criteria

- 4 new commits added to `next-migration` (deps, posts lib, dynamic route, homepage list).
- `npm run build` succeeds and emits HTML for the homepage + 5 posts.
- Each post URL matches the original Gatsby slug.
- Netlify preview deploy on PR #8 is green and visually shows the list + post pages.
- Master is unchanged.

---

## What this plan deliberately does NOT do

(Pushed to later phases — listed so the engineer doesn't get tempted.)

- Apply any remark/rehype plugin (syntax highlighting, smartypants, autolink, emojis, embeds) — Phase 3.
- Process or display cover images, post-adjacent assets, or SVG inlining — Phase 3.
- Render styled components / CSS Modules — Phase 4.
- Render prev/next navigation, tag lists, table of contents — Phase 5.
- Generate RSS feed, sitemap, manifest, OG images — Phase 6.
- Add unit tests / test infrastructure (the build itself is the validation surface).
