# Gatsby → Next.js Migration — Design

**Date:** 2026-05-17
**Status:** Approved for planning
**Scope:** Replace the existing Gatsby 3 site at css-widgets.com with a Next.js (App Router) implementation, preserving content, URLs, and visual design.

---

## Goal

Move css-widgets.com off Gatsby 3 onto a modern, long-maintained stack. The site currently fails to start on Apple Silicon (sharp/libvips ABI mismatch), uses a 2021 stack with many deprecated dependencies, and depends on plugins that no longer receive updates. Next.js is chosen as the long-term framework.

The migration must:
- Preserve every existing post URL (slugs come from frontmatter today).
- Preserve the current visual design (1:1 port).
- Keep the site deployable from the same git repo, on the same Netlify account.
- Not require AdSense-incompatible hosting changes.

## Non-goals

- Redesigning the site.
- Adding new features beyond what exists today.
- Moving to a different hosting provider.
- Migrating content format (posts stay as MDX in `content/posts/`).

---

## Locked-in decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Long-term modern stack; user accepted higher learning curve |
| Styling | CSS Modules | Built into Next; lowest-effort port from styled-components for a small codebase |
| Build mode | `output: 'export'` (static) | Nothing in the feature set needs a server runtime; faster CDN serve; portable |
| Hosting | Netlify (unchanged) | Already used; free tier covers needs; allows AdSense |
| Deploy | Netlify auto-deploys from git; deploy previews per branch | No GH Actions needed |
| Migration strategy | Approach 2 — clean-cut on `next-migration` branch | Master keeps deploying current site; one set of deps; clean review surface |
| URLs | Identical to current site | SEO + inbound links preserved |
| Package manager | npm | Already in use |
| TypeScript | Yes for `.ts` / `.tsx` source; existing JS source ported as part of each component's port | App Router defaults |

---

## Features kept

Posts (MDX), static pages (`/about`, `/guides`), dark mode toggle, Disqus comments, Google Analytics, RSS feed, sitemap, PWA manifest, social cards (auto-generated OG images per post), CodePen embeds, VSCode-themed syntax highlighting.

## Features dropped

- `content/photos/` and all EXIF/GPS handling — folder is empty, never used.
- Plotly charts — wired but no post references it.
- `Map.js` (Google Maps marker clusterer) and `Masonry/` — only used by the dropped photos feature.
- Algolia search — commented out in current Gatsby config; never went live. Not worth wiring up from scratch.

---

## Architecture

### Folder layout (on `next-migration` branch)

```
/
├── app/                         # App Router root
│   ├── layout.tsx               # Root layout (HTML shell, providers, dark-mode)
│   ├── page.tsx                 # Homepage (post list)
│   ├── about/page.tsx           # /about (may be authored as .mdx instead — decided at port time)
│   ├── guides/page.tsx          # /guides
│   ├── [slug]/page.tsx          # Dynamic post route, reads MDX from /content
│   ├── rss.xml/route.ts         # RSS feed (route handler invoked at build)
│   ├── sitemap.ts               # Next built-in sitemap convention
│   ├── manifest.ts              # Next built-in manifest convention
│   ├── opengraph-image.tsx      # Default OG image (per-post overrides under app/[slug]/)
│   └── globals.css
├── components/                  # Ported components (CSS Modules)
├── content/
│   └── posts/                   # MDX posts — unchanged from current
├── lib/
│   ├── posts.ts                 # fs reads /content, returns post list + metadata + prev/next
│   ├── mdx.ts                   # MDX compile config (remark/rehype plugins)
│   └── assets.ts                # Build-time copy of post-adjacent assets to public/
├── public/                      # Static assets (favicon, fonts, processed post images)
├── next.config.mjs              # output: 'export', MDX config, image config
├── netlify.toml                 # publish=out, command=next build
├── tsconfig.json
└── package.json
```

### Content pipeline

- `@next/mdx` registers `.mdx` as a page extension, so `app/about/page.mdx` works natively.
- Posts live in `content/posts/<YYYY-MM-DD~slug>/<slug>.mdx`. A dynamic route `app/[slug]/page.tsx` reads the MDX by slug at build time using `next-mdx-remote/rsc` and the same remark/rehype plugin chain.
- `generateStaticParams()` enumerates all post slugs by reading `content/posts/`. Static export emits one HTML file per post.
- Frontmatter parsed with `gray-matter` — same fields as today (slug, date, title, tags, description).
- Prev/next nav computed in `lib/posts.ts` (sort by date DESC, find index, return neighbours).
- Post-adjacent assets (images, SVGs co-located with each `.mdx`) are copied to `public/posts/<slug>/` by a small build script (`lib/assets.ts`) so MDX can reference them by stable URL.

### Styling port

For each existing styled-component:
1. Extract the template-string CSS into `Component.module.css` as a class.
2. Replace `<StyledFoo>` with `<div className={styles.foo}>`.
3. Theme tokens → CSS custom properties in `app/globals.css`, referenced via `var(--…)`.
4. Dark mode swap = `[data-theme="dark"]` selector on `<html>`, set by `DarkToggle` via `next-themes`.

No styled-components runtime in the bundle. No `babel-plugin-styled-components`.

Fonts: drop `@fontsource/*` packages, use `next/font/google` (or `next/font/local` for custom).
Icons: `@styled-icons/*` → swap to `lucide-react` (lighter, no styled-components dep).

### Component port table

| Current component | Becomes | Notes |
|---|---|---|
| `Header/`, `Nav/`, `Footer/` | Server components | Rendered in `app/layout.tsx` |
| `DarkToggle/` | Client component | `next-themes` |
| `PostExcerpt/`, `PostMeta/`, `PrevNext/`, `TagList/`, `PageTitle/` | Server components | Pure rendering from props |
| `Scroll/`, `Modal/`, `Spinners/`, `Toc/` | Client components | DOM/state interaction |
| `Seo.js` | Deleted | Replaced by App Router's `generateMetadata` exports |
| `Map.js`, `Masonry/`, `Plotly.js` | Deleted | Per drop list |
| `Connect/` (social links) | Server component | |

### Feature mapping (Gatsby → Next.js)

| Feature | Today | After |
|---|---|---|
| MDX rendering | `gatsby-plugin-mdx` | `@next/mdx` (pages) + `next-mdx-remote/rsc` (post content) |
| Image processing | `gatsby-plugin-sharp` + `gatsby-remark-images` | `next/image` with `unoptimized: true`; sizes pre-generated by a build script using `sharp` directly |
| Syntax highlighting | `gatsby-remark-vscode` | `rehype-pretty-code` (Shiki with VSCode themes) |
| Code block titles | `gatsby-remark-code-titles` | Built into `rehype-pretty-code` meta strings |
| Smartypants | `gatsby-remark-smartypants` | `remark-smartypants` |
| Autolink headers | `gatsby-remark-autolink-headers` | `rehype-slug` + `rehype-autolink-headings` |
| Sub/sup | `gatsby-remark-sub-sup` | `remark-supersub` |
| Emojis | `gatsby-remark-emojis` | `remark-emoji` |
| CodePen embeds | `@weknow/gatsby-remark-codepen` | `<CodePen>` MDX component used directly in posts |
| YouTube/Twitter embeds | `gatsby-remark-embed-video` + `gatsby-remark-embedder` | `@remark-embedder/core` + `@remark-embedder/transformer-oembed` |
| Responsive iframes | `gatsby-remark-responsive-iframe` | CSS `aspect-ratio` in `globals.css` |
| Copy linked files | `gatsby-remark-copy-linked-files` | `lib/assets.ts` build script copies post-adjacent files to `public/posts/<slug>/` |
| SVG → dataURI inline (size-threshold) | Custom `createResolvers` in `gatsby-node.js` | Build-time pass in `lib/assets.ts`: SVGs under threshold inlined to a JSON map imported by MDX components |
| EXIF photo metadata | Custom in `gatsby-node.js` | Dropped |
| Social cards (OG images) | Local `gatsby-plugin-my-social-cards` | `app/<route>/opengraph-image.tsx` (Next's built-in dynamic OG image generation) |
| RSS feed | `gatsby-plugin-feed` | `app/rss.xml/route.ts` route handler reading `lib/posts.ts` |
| Sitemap | `gatsby-plugin-sitemap` | `app/sitemap.ts` (Next built-in convention) |
| PWA manifest | `gatsby-plugin-manifest` | `app/manifest.ts` (Next built-in convention) |
| Google Analytics | `gatsby-plugin-google-analytics` | `@next/third-parties/google` in `app/layout.tsx` |
| Disqus | `disqus-react` | Same package, used as a client component |
| Catch internal links | `gatsby-plugin-catch-links` | Not needed — `next/link` handles client-side nav |
| Dark mode | `gatsby-plugin-dark-mode` | `next-themes` |
| React helmet | `gatsby-plugin-react-helmet` | App Router `metadata` / `generateMetadata` exports |
| Absolute imports from `src/` | webpack alias in `gatsby-node.js` | `tsconfig.json` `paths`: `"@/*": ["./*"]` |

---

## Data flow

1. **Build start.**
2. `lib/assets.ts` walks `content/posts/`, copies post-adjacent images/SVGs into `public/posts/<slug>/`, inlines small SVGs into a generated map.
3. `lib/posts.ts` builds the post index (sorted by date, with prev/next neighbours) from frontmatter — used by homepage, post pages, RSS, sitemap.
4. `app/[slug]/page.tsx` `generateStaticParams()` returns one entry per post slug.
5. For each slug, the page reads its MDX file, compiles via `next-mdx-remote/rsc` with the remark/rehype plugin chain, renders as static HTML.
6. `app/sitemap.ts`, `app/rss.xml/route.ts`, `app/manifest.ts` emit their static artefacts.
7. `app/<route>/opengraph-image.tsx` generates one OG image per static route.
8. **Build end.** Output in `out/`. Netlify publishes it.

---

## Build & deploy

**`next.config.mjs`:**
```js
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [/* smartypants, emoji, embedder, codepen, supersub */],
    rehypePlugins: [/* slug, autolink-headings, pretty-code */],
  },
})

export default withMDX({
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: { unoptimized: true },
  trailingSlash: true,
})
```

**`netlify.toml`:**
```toml
[build]
  command = "next build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"
```

**Branch strategy:**
- `master` continues to deploy the current Gatsby site, untouched, until cutover.
- `next-migration` branch holds the rewrite. Netlify deploy previews run on every push.
- Cutover = merge `next-migration` → `master`. Master's next build runs Next.js and publishes the new site.
- Rollback = Netlify "publish previous deploy" (one click).

**Redirects:** `netlify.toml [[redirects]]` is the place for any legacy URL fix-ups discovered during QA. Expected to be empty since slugs are preserved.

---

## Error handling

This is a static-export build — there is no runtime to fail at request time. Failure surfaces are:

- **Build failures.** Netlify build log shows the failing step. Most likely sources: MDX compile errors (bad frontmatter, bad syntax), missing referenced assets, broken plugin config.
  - Mitigation: each migration phase ends in a working preview deploy, so regressions are caught immediately.
- **Broken links.** Caught by an internal-link check during final QA phase.
- **Missing images / 404 assets.** Caught by the same QA pass. `lib/assets.ts` will warn if it sees a post referencing a file that doesn't exist.

---

## Testing

Lightweight for a personal blog — no test suite migration. The validation surface is:

- **Per-phase preview deploy.** Each phase ends in a Netlify preview URL the user clicks through.
- **Final parity QA.** Side-by-side comparison of every page on the preview vs the live Gatsby site:
  - All 5 posts render with code blocks, embeds, images, headings, prev/next nav.
  - All static pages (`/about`, `/guides`, homepage) render.
  - RSS feed validates (https://validator.w3.org/feed/).
  - Sitemap has expected URLs.
  - PWA manifest installs.
  - Dark mode toggle works and persists.
  - Disqus loads on a post page.
  - GA event fires on navigation.
  - OG images render for each post (use Twitter/LinkedIn preview validators).
  - Lighthouse score not worse than current site.
- **Smoke test post-cutover.** After merge to master, hit the live URLs once more.

---

## Migration sequence

Seven phases on the `next-migration` branch. Each phase ends in a green preview deploy.

1. **Scaffold.** Delete Gatsby files (preserving `content/` and `license`). `npx create-next-app@latest .` with TS + App Router. Configure `next.config.mjs`, `netlify.toml`, `tsconfig` paths, basic globals.
2. **Content pipeline.** Wire MDX (`@next/mdx`, `next-mdx-remote`, `gray-matter`). Get one post (`/css-in-js`) rendering at the right URL with raw frontmatter, no styling.
3. **Remark/rehype plugins.** Add the full plugin chain. Verify the same post renders correctly with code blocks, embeds, autolinks, emoji, smartypants.
4. **Layout & dark mode.** Port `app/layout.tsx`, `Header`, `Nav`, `Footer`, `DarkToggle`. First milestone where site looks recognisable.
5. **Pages & post listing.** Homepage, `/about`, `/guides`, `PostExcerpt`, `PrevNext`, `TagList`, `Toc`, `PageTitle`, `PostMeta`.
6. **Cross-cutting features.** RSS, sitemap, manifest, GA, Disqus, social cards (OG images).
7. **QA + cutover.** Parity check against live Gatsby site. Lighthouse. Merge to master.

Each phase is a small PR or one squashed PR at the end — author's call.

---

## Known small decisions for phase 1

- **`src/pages/404-old.js` and `src/pages/snippets-old.js`** are currently routed in Gatsby as `/404-old` and `/snippets-old`. Filename suffix suggests they're archived. Decision at port time: drop both unless inbound traffic shows they're hit. If kept, port as `app/404-old/page.tsx` and `app/snippets-old/page.tsx`.
- **404 page**: Gatsby's `404-old.js` is the archived version. Next App Router uses `app/not-found.tsx` — port whichever current 404 is actually served on the live site.
- **About/guides authoring**: each may be `.tsx` or `.mdx` — depends on whether the existing JS file contains prose vs. components. Decided when porting that file.

## Open questions

None — all major design decisions captured above.
