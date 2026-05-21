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
2026-05-20.
