# Phase 7 — Parity QA + Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the Next.js preview reaches parity with the live Gatsby site at css-widgets.com, configure production environment variables on Netlify, merge `next-migration` → `master` so Netlify rebuilds master with the Next.js stack, smoke-test the live site, and clean up the now-unused legacy code. After Phase 7 the migration is done.

**Architecture:** Mostly procedural. Three categories of work:
- **Mechanical (subagent-doable):** Drop `_legacy/`, drop unused YAML files, update `readme.md`, commit, merge.
- **User-driven:** Visual side-by-side QA, Lighthouse, OG preview validators, Netlify Dashboard UI changes (build settings, env vars), final merge approval.
- **Automated where useful:** A small parity-check script that diffs key page properties between live and preview.

**Tech Stack:** No new dependencies. Uses `curl`, basic shell, and Netlify's dashboard.

**Spec:** `docs/superpowers/specs/2026-05-17-gatsby-to-nextjs-migration-design.md`

**Starting state:** Branch `next-migration` ahead of `master` by ~50 commits. PR #8 open and green. Master still deploys the current Gatsby site at css-widgets.com.

---

## Task 1: Side-by-side parity check (automated diff)

**Files:**
- Create: `scripts/parity-check.ts` (one-shot script, deleted in Task 8)

A small script that fetches each public URL on both the live site and the Netlify preview, then prints a diff of: page titles, post counts, post slugs, link counts, image counts, meta tag presence. Catches obvious omissions in seconds.

- [ ] **Step 1:** Create `scripts/parity-check.ts` with EXACTLY this content:

```ts
const LIVE = "https://css-widgets.com";
const PREVIEW = process.argv[2];

if (!PREVIEW || !PREVIEW.startsWith("http")) {
  console.error("Usage: tsx scripts/parity-check.ts <preview-url>");
  process.exit(1);
}

const ROUTES = [
  "/",
  "/about/",
  "/guides/",
  "/how-to-get-started-with-css-in-js/",
  "/button-vs-link/",
  "/sass-architecture/",
  "/custom-accessible-checkbox/",
  "/css-grid-accessibility/",
];

type Snap = {
  url: string;
  status: number;
  titleTag: string | null;
  h1: string | null;
  linkCount: number;
  imgCount: number;
  hasOgImage: boolean;
};

async function snap(base: string, path: string): Promise<Snap> {
  const url = base + path;
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, "").trim() ?? null;
  const links = (html.match(/<a [^>]*href="/g) ?? []).length;
  const imgs = (html.match(/<img [^>]*src="/g) ?? []).length;
  const hasOgImage = /<meta property="og:image"/i.test(html);
  return { url, status: res.status, titleTag: title, h1, linkCount: links, imgCount: imgs, hasOgImage };
}

function row(label: string, a: unknown, b: unknown): string {
  const match = JSON.stringify(a) === JSON.stringify(b) ? " " : "*";
  return `  ${match} ${label.padEnd(13)} live=${JSON.stringify(a)}  preview=${JSON.stringify(b)}`;
}

const ok: string[] = [];
const diffs: string[] = [];

for (const route of ROUTES) {
  const [live, preview] = await Promise.all([
    snap(LIVE, route).catch((e) => ({ error: String(e), status: 0 }) as never),
    snap(PREVIEW, route).catch((e) => ({ error: String(e), status: 0 }) as never),
  ]);
  const block = [
    `\nROUTE ${route}`,
    row("status",      live.status, preview.status),
    row("title",       live.titleTag, preview.titleTag),
    row("h1",          live.h1, preview.h1),
    row("link_count",  live.linkCount, preview.linkCount),
    row("img_count",   live.imgCount, preview.imgCount),
    row("og:image",    live.hasOgImage, preview.hasOgImage),
  ].join("\n");
  (block.includes("*") ? diffs : ok).push(block);
}

console.log("== differences ==");
for (const d of diffs) console.log(d);
console.log("\n== unchanged ==");
for (const r of ok) console.log(r);
console.log(`\nsummary: ${diffs.length} routes with diffs, ${ok.length} routes clean`);
```

- [ ] **Step 2:** Get the most recent deploy preview URL from PR #8:
  Either ask the user to paste the latest `https://deploy-preview-8--css-widgets.netlify.app/` (or specific hash URL), or use the alias `deploy-preview-8--css-widgets.netlify.app` if it consistently points to the latest preview.

- [ ] **Step 3:** Run the script:
  ```
  npx --yes tsx scripts/parity-check.ts https://deploy-preview-8--css-widgets.netlify.app
  ```

  Expected: a "== differences ==" section showing per-route diffs (status, titles, h1, link/img counts, og:image presence). Most differences are expected — the new site has cards instead of plain `<ul>`s, more `<img>`s on cards, etc. Real concerns:
  - Status not 200 on preview (route missing).
  - Title completely wrong (e.g., a post page showing site title instead of post title).
  - h1 missing on preview where live has one (or vice versa).
  - og:image false on preview where live has it.

  Capture the output. Bring concerns into the next task as visual-QA targets.

- [ ] **Step 4:** Do NOT commit the script yet. It's a one-shot tool deleted in Task 8.

---

## Task 2: Visual parity QA (user-driven)

**Files:** none

For each route, open both pages side-by-side and compare. Use the latest deploy preview URL.

- [ ] **Step 1:** **Homepage** (live vs preview):
  - Same nav links?
  - Post cards visible with covers, dates, reading time, tags?
  - Filter chips work?
  - Footer present with correct copyright?

- [ ] **Step 2:** **`/how-to-get-started-with-css-in-js/`** (the most complex post — cover + Toc + body):
  - Cover hero with correct background image?
  - Title + meta (date "June 4, 2020" + reading time + tags) overlaid on cover?
  - Toc panel on left (≥70em width)?
  - Article body renders correctly (code blocks, images, headings, smartypants quotes/dashes)?
  - PrevNext at bottom (only "Next post" since this is the newest)?

- [ ] **Step 3:** **Code-heavy posts** (`/custom-accessible-checkbox/`, `/button-vs-link/`):
  - Syntax highlighting working?
  - Code titles ("Single-checkbox", "Visually-hide-input", etc.) above each block?
  - Inline images load?

- [ ] **Step 4:** **`/about/`** and **`/guides/`**:
  - Prose renders, no missing content vs live About?
  - "Coming soon" placeholder on Guides?

- [ ] **Step 5:** **Dark/light/system toggle:**
  - Cycles through three states?
  - Colours visibly change (background, headings, cards)?
  - State persists across page reloads (localStorage)?

- [ ] **Step 6:** **Mobile (<800px width):**
  - Nav collapses to hamburger?
  - Drawer opens/closes?
  - Post cards stack vertically?

- [ ] **Step 7:** Capture any visible issue (broken layout, wrong colour, missing element) as a short list. Decide for each:
  - **Block cutover** — clearly wrong (broken layout, missing content, broken link)
  - **Fix-after-cutover** — polish (slightly off spacing, font weight)

  Address blockers as commits on `next-migration`; defer polish to a follow-up branch.

---

## Task 3: Functional QA (user-driven)

**Files:** none

- [ ] **Step 1:** **RSS feed:**
  - Validate at https://validator.w3.org/feed/ — paste `<preview-url>/rss.xml`. Expected: "This is a valid RSS feed."

- [ ] **Step 2:** **Sitemap:**
  - Open `<preview-url>/sitemap.xml` in a browser. Confirm 8 URLs, all using `https://css-widgets.com` as the base (not the preview URL).

- [ ] **Step 3:** **PWA manifest:**
  - Open `<preview-url>/manifest.webmanifest`. JSON returns with name + theme colors.
  - In Chrome DevTools → Application → Manifest: should display the icon and metadata.

- [ ] **Step 4:** **Open Graph previews:**
  - Paste a post URL into https://www.opengraph.xyz/ — should show dark-gradient OG image with the post title.
  - Optional: Twitter card validator at https://cards-dev.twitter.com/validator (requires login).
  - Optional: LinkedIn at https://www.linkedin.com/post-inspector/.

- [ ] **Step 5:** **Google Analytics:**
  - Open the preview homepage, open DevTools → Network, filter for `collect`.
  - Click any link. Expect a request to `https://www.google-analytics.com/g/collect?...` containing `tid=G-LHTW9V1F9R`.

- [ ] **Step 6:** **Disqus (after env var set — see Task 5):**
  - On a post page, scroll to the bottom. Disqus comment box should load.
  - Comment counts on homepage cards: NOT currently rendered (deferred — was a Phase 5 cut). Acceptable.

---

## Task 4: Lighthouse (user-driven)

**Files:** none

- [ ] **Step 1:** Run Lighthouse on Chrome (DevTools → Lighthouse → "Analyze page load") for:
  - Live: `https://css-widgets.com/`
  - Preview: `<preview-url>/`
  - Live: `https://css-widgets.com/how-to-get-started-with-css-in-js/`
  - Preview: `<preview-url>/how-to-get-started-with-css-in-js/`

  Compare scores in four categories: Performance, Accessibility, Best Practices, SEO.

- [ ] **Step 2:** Decision rule:
  - **Performance**: a drop of >10 points is a regression — investigate before merging. Common culprits: unoptimised images, large CSS bundle, render-blocking scripts.
  - **Accessibility / Best Practices / SEO**: should be equal or better on the new site. Investigate any drop.

  Record final scores in the notes section of PR #8 as part of cutover documentation.

---

## Task 5: Pre-cutover Netlify configuration (user-driven)

**Files:** none

Netlify's Dashboard sometimes overrides `netlify.toml`. Pre-cutover, ensure the dashboard matches the new repo config.

- [ ] **Step 1:** In Netlify Dashboard for the css-widgets site:
  - **Site Configuration → Build & Deploy → Build settings:**
    - Build command: Should either be empty (let `netlify.toml` win) or explicitly `next build`.
    - Publish directory: empty (let `netlify.toml` win) or `out`.
    - If currently set to Gatsby's `gatsby build` / `public`, clear them so `netlify.toml` is authoritative.
  - **Site Configuration → Build & Deploy → Environment variables:**
    - **Add** `NEXT_PUBLIC_DISQUS_NAME` with the same value that was set for `GATSBY_DISQUS_NAME` (or your current Disqus shortname).
    - Leave `GATSBY_DISQUS_NAME` alone — it's inert in Next but harmless to keep for now.
    - Any other `GATSBY_*` env vars (e.g. Algolia keys if they existed): leave them; we don't need them but they don't conflict.
  - **Site Configuration → Build & Deploy → Branches and deploy contexts:**
    - **Production branch**: confirm it's `master`.
    - **Deploy Previews**: enabled (we've been using them).

- [ ] **Step 2:** Trigger ONE more preview build by pushing an empty commit OR clicking "Trigger deploy" on the preview deploy. Verify the preview still works *with* `NEXT_PUBLIC_DISQUS_NAME` now set — Disqus should appear on a post page bottom.

---

## Task 6: Clean up legacy code

**Files:**
- Delete: `_legacy/`
- Delete: `content/nav.yml`, `content/footer.yml`

These were preserved as reference during the port. Now safe to drop — git history retains them.

- [ ] **Step 1:** Remove the legacy directory:
  ```
  git rm -r _legacy
  ```

- [ ] **Step 2:** Remove the unused YAML data files (replaced by `lib/site.ts`):
  ```
  git rm content/nav.yml content/footer.yml
  ```

- [ ] **Step 3:** Verify the build still works with these removed:
  ```
  rm -rf out && npm run build
  ```
  Expected: succeeds. No code references `_legacy/` (it was for human reference only) or the YAML files.

- [ ] **Step 4:** Commit:
  ```
  git commit -m "chore: remove _legacy/ and unused YAML data files"
  ```

---

## Task 7: Update the readme

**Files:**
- Modify: `readme.md`

Replace Gatsby-era content with a short Next.js README.

- [ ] **Step 1:** Overwrite `readme.md` with EXACTLY this content:

```markdown
# CSS Widgets

Personal blog at [css-widgets.com](https://css-widgets.com). Front-end
technologies — CSS, HTML, Accessibility, and JavaScript.

## Stack

- Next.js (App Router, TypeScript, static export via `output: 'export'`)
- MDX content compiled with `next-mdx-remote` and a remark/rehype plugin chain
  (syntax highlighting via `rehype-pretty-code`, smartypants, autolink headings,
  emoji)
- CSS Modules with light/dark theme via CSS custom properties + `next-themes`
- Hosted on Netlify, deployed automatically from `master`

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Authoring a post

1. Create a folder under `content/posts/` named `YYYY-MM-DD~slug/`.
2. Add a `<slug>.mdx` file with frontmatter (`title`, `slug`, `date`, optional
   `cover`, `tags`, `showToc`, `description`).
3. Co-locate any images/SVGs in the same folder — they are copied to
   `public/posts/<slug>/` at build time by `lib/assets.ts`.

## Project layout

- `app/` — App Router pages, layout, OG images, RSS, sitemap, manifest
- `components/` — Components paired with their `.module.css`
- `lib/` — Data layer (`posts.ts`, `date.ts`, `assets.ts`, `mdx.ts`, `site.ts`)
- `content/posts/` — MDX source
- `public/` — Static assets (favicon, images). `public/posts/` is generated.

## Migration history

See `docs/superpowers/specs/` and `docs/superpowers/plans/` for the design and
phased implementation plans for the Gatsby → Next.js migration completed
2026-05-18.
```

- [ ] **Step 2:** Commit:
  ```
  git add readme.md
  git commit -m "docs: replace Gatsby-era readme with Next.js + Netlify quickstart"
  ```

---

## Task 8: Remove the parity-check script

**Files:**
- Delete: `scripts/parity-check.ts`

One-shot tool; keeping it in the repo means it'll rot. The script content lives in this plan if ever needed again.

- [ ] **Step 1:** Remove and commit:
  ```
  rm -rf scripts
  git status --short  # confirm scripts/ no longer tracked
  ```

(If `scripts/` was never staged because Task 1 explicitly said "do NOT commit", this step is a no-op — just delete the local file.)

---

## Task 9: Push, mark PR ready, merge (user-driven for the merge)

**Files:** none — git/PR ops only

- [ ] **Step 1:** Push the cleanup commits:
  ```
  git push origin next-migration
  ```

- [ ] **Step 2:** Confirm PR #8's Deploy Preview goes green one more time. Run the parity check script one final time against the green preview, save the output as evidence in the PR.

- [ ] **Step 3:** **MANUAL** — On GitHub, click PR #8's "Ready for review" button (it's currently a draft). Optionally re-review the PR description and add a note: "Migration complete; ready to merge per plan Phase 7."

- [ ] **Step 4:** **MANUAL** — Merge the PR.
  - Recommended merge method: **squash and merge** (one clean commit on master with the migration summary) OR **merge commit** (preserve the granular history).
  - Recommendation: merge commit. The granular commits document the phased approach and are useful as a reference for future work.

  Master will rebuild on Netlify with the new `netlify.toml` (next build, output to `out/`). Watch the build.

- [ ] **Step 5:** **MANUAL** — If the master build fails:
  - Check Netlify build log for the failure.
  - The Netlify dashboard's "Production deploys" tab shows previous successful Gatsby deploys. Click on the most recent green Gatsby deploy and click **"Publish deploy"** to roll back instantly while you investigate.

---

## Task 10: Post-cutover smoke test (user-driven)

**Files:** none

After master deploys, hit the live URLs:

- [ ] **Step 1:** Open https://css-widgets.com/ — homepage loads with new post cards.
- [ ] **Step 2:** Click a post — loads with hero, meta, body, prev/next.
- [ ] **Step 3:** Open https://css-widgets.com/rss.xml — XML loads.
- [ ] **Step 4:** Open https://css-widgets.com/sitemap.xml — XML loads.
- [ ] **Step 5:** Toggle dark mode — persists across page navigation.
- [ ] **Step 6:** Scroll to bottom of a post — Disqus loads (with env var set).
- [ ] **Step 7:** DevTools → Network → click around — GA `collect` requests fire.
- [ ] **Step 8:** Search-engine signal: optionally inspect with Google's mobile-friendly test (https://search.google.com/test/mobile-friendly) and resubmit the sitemap in Search Console.

- [ ] **Step 9:** Done. Mark the spec at `docs/superpowers/specs/2026-05-17-gatsby-to-nextjs-migration-design.md` with a final "Status: Shipped on 2026-MM-DD" line.

---

## Done criteria

- `_legacy/` and the unused YAML files removed; `readme.md` updated; one final commit before merge.
- Parity check shows no unexpected per-route diffs.
- Lighthouse scores on the new site are not measurably worse than the old.
- PR #8 merged to `master`; Netlify deploys master via Next.js; live URLs serve the new site.
- Disqus and GA functioning on the live site.
- Rollback path verified (one click in Netlify if needed) but not used.
- The spec doc is marked as Shipped with the date.

---

## What this plan deliberately does NOT do

- Run Lighthouse via CI — manual run is enough for a personal blog at this scale.
- Add a robots.txt — not in spec; add later if you start running ads or want fine-grained crawler control.
- Set up Sentry / error tracking — not in spec.
- Wire up CodePen / oEmbed plugins (deferred from Phase 3) — no content needs them.
- Add JSON-LD / Schema.org — not in spec.
- Image-quality polish on OG cards (custom fonts, per-post cover image as background) — Phase 7+ polish.
- Delete the migration plans/specs from the repo — they're useful as architectural reference.
- Migrate the Disqus database — slugs are preserved so Disqus's existing threads should map automatically via the `identifier: slug` config.
