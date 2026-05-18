# Phase 4 — Layout, Header, Nav, Footer, Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the visual shell of the site to life. After Phase 4, the Netlify preview shows a header with logo + nav + dark-mode toggle, the hero SVG curve, the homepage and post pages wrapped in the styled layout, and a footer. Theme tokens drive light/dark mode via CSS custom properties controlled by `next-themes`. Visual fidelity to the current Gatsby site should be high but does not need to be pixel-perfect — small differences in animations or spacing are acceptable; QA in Phase 7 catches anything important.

**Architecture:** A single root layout (`app/layout.tsx`) renders `<Header>`, page content, and `<Footer>`. Theme is set on `<html data-theme="...">` by `next-themes` (client-only). Components live in `components/<Name>/<Name>.tsx` paired with `<Name>.module.css`. All styled-components are dropped — colors come from CSS custom properties defined in `app/globals.css` and swapped by a `[data-theme]` selector. Nav and footer data (currently in `content/nav.yml` and `content/footer.yml`) become TypeScript constants in `lib/site.ts` — simpler than introducing a YAML parser for 6 lines of data. Static assets (logo, logo-text, circle arrow) live under `public/images/`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, CSS Modules, `next-themes`, `next/font/google` (Baloo 2 + Roboto fallbacks).

**Spec:** `docs/superpowers/specs/2026-05-17-gatsby-to-nextjs-migration-design.md`

**Starting state:** Branch `next-migration`. Phases 1-3 complete. Layout currently has just `<html><body>{children}</body></html>` with a placeholder font, no header/nav/footer, no theme switching.

---

## File structure after Phase 4

```
/
├── app/
│   ├── layout.tsx               # MODIFIED: fonts, ThemeProvider, Header, Footer
│   ├── page.tsx                 # MODIFIED: drop inline <h1>/intro (now in Header / hero pattern)
│   ├── [slug]/page.tsx          # MODIFIED: trim inline title since article header stays
│   └── globals.css              # MODIFIED: CSS custom properties, base typography
├── components/                  # NEW directory
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   ├── Nav/
│   │   ├── Nav.tsx              # Client (open/close state)
│   │   └── Nav.module.css
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   ├── DarkToggle/
│   │   ├── DarkToggle.tsx       # Client (next-themes hook)
│   │   └── DarkToggle.module.css
│   └── ThemeProvider.tsx        # Thin wrapper around next-themes
├── lib/
│   └── site.ts                  # NEW: nav + footer constants (replaces .yml)
├── public/
│   └── images/
│       ├── logo.svg
│       ├── logo-text.svg
│       └── circle-arrow.svg
├── package.json                 # MODIFIED: + next-themes
└── content/
    ├── nav.yml                  # KEEP but no longer read (sourced from lib/site.ts; YAML can be deleted in Phase 7 cleanup)
    └── footer.yml               # same
```

---

## Task 1: Copy required assets to `public/images/`

**Files:**
- Create: `public/images/logo.svg`, `public/images/logo-text.svg`, `public/images/circle-arrow.svg`

Source files are in `_legacy/src/images/`. Copy (don't move) — `_legacy/` stays as reference until Phase 7 cleanup.

- [ ] **Step 1:** Identify assets needed by the visual port:
  ```
  ls _legacy/src/images/ | head
  ```
  Expected: `logo.svg`, `logo-text.svg`, `circle-arrow.svg` and others.

- [ ] **Step 2:** Copy the three needed:
  ```
  mkdir -p public/images
  cp _legacy/src/images/logo.svg public/images/logo.svg
  cp _legacy/src/images/logo-text.svg public/images/logo-text.svg
  cp _legacy/src/images/circle-arrow.svg public/images/circle-arrow.svg
  ```

- [ ] **Step 3:** Verify:
  ```
  ls -l public/images/
  ```
  Expected: three SVG files, each > 0 bytes.

- [ ] **Step 4:** Commit:
  ```
  git add public/images
  git commit -m "feat: copy logo, logo-text, and arrow SVGs to public/images/"
  ```

---

## Task 2: CSS custom properties + base typography in `globals.css`

**Files:**
- Modify: `app/globals.css`

Replace the minimal placeholder stylesheet with theme tokens, base typography (matching the Gatsby site as closely as practical without re-creating every selector), and the responsive content wrappers used by Header/Nav.

- [ ] **Step 1:** Overwrite `app/globals.css` with EXACTLY this content:

```css
/* ===== Theme tokens =====
   Light is the default. Dark applies when [data-theme="dark"] is on <html>.
   Names mirror the legacy MODE_COLORS dictionary so a future polish pass
   can search-and-replace where necessary. */

:root,
[data-theme="light"] {
  color-scheme: light;
  --color-text: #0a0c10;
  --color-heading: #2d3748;
  --color-articleText: #0a0c10;
  --color-postHeading: #2c0b8e;
  --color-link: #1f59cd;
  --color-outline: #2c0b8e;
  --color-background: #f8f8f8;
  --color-headerBackground: #ffffff;
  --color-boxBackground: #ffffff;
  --color-blockquoteBG: #e2edf7;
  --color-accentBackground: rgba(0, 0, 0, 0.05);
  --color-hoverBackground: rgb(243 187 187 / 15%);
  --color-textHighlight: #f0f0f0;
  --color-filter: 0;
}

[data-theme="dark"] {
  color-scheme: dark;
  --color-text: #c7c7c7;
  --color-heading: #e5e5e5;
  --color-articleText: #b5bdbd;
  --color-postHeading: #ecc54f;
  --color-link: #279AF1;
  --color-outline: #ecc54f;
  --color-background: #0c1213;
  --color-headerBackground: #0e141b;
  --color-boxBackground: #131a23;
  --color-blockquoteBG: #17252f;
  --color-accentBackground: rgba(0, 0, 0, 0.7);
  --color-hoverBackground: rgb(35 51 68 / 70%);
  --color-textHighlight: #0d1314;
  --color-filter: 1;
}

/* ===== Reset / base ===== */
html { font-size: 62.5%; }

body {
  margin: 0;
  font-family: var(--font-baloo-2), Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 1.8rem;
  line-height: 2.8rem;
  background: var(--color-background);
  color: var(--color-text);
  -webkit-text-size-adjust: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: var(--color-link);
  text-decoration: none;
}
a:hover { text-decoration: underline; }

h1, h2, h3, h4, h5, h6 {
  color: var(--color-heading);
  letter-spacing: 1px;
  line-height: initial;
}
h1, h2 { font-weight: 600; }
h3, h4, h5, h6 { font-weight: 500; }

p { margin: 0 0 2rem 0; -webkit-font-smoothing: antialiased; }
strong { font-weight: 600; }

::selection {
  color: var(--color-textHighlight);
  background: var(--color-outline);
}

blockquote, details {
  border-left: 0.25em solid var(--color-link);
  background: var(--color-blockquoteBG);
  padding: 0.1em 0.3em 0.1em 1em;
  margin: 3rem 0 4rem 0;
}

/* Skip link */
.skip-main {
  left: -999px;
  position: absolute;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: -999;
}
.skip-main:focus,
.skip-main:active {
  color: #d33a2c;
  background: #fff;
  left: 10px;
  top: 10px;
  width: auto;
  height: auto;
  padding: .5em 1em;
  text-align: center;
  font-size: 1.2em;
  z-index: 999;
}

/* Layout helpers */
.wrapper { max-width: 1140px; margin: 0 auto; }
.inner-wrapper { padding: 0 2rem; }

main { flex: 1; max-width: 1140px; margin: 0 auto; padding: 2rem; }

iframe { margin: 3rem 0; border: 2px solid var(--color-text); }

@media (prefers-reduced-motion: no-preference) {
  :focus-visible {
    transition: outline-offset .25s ease;
    outline-offset: 2px;
    outline: 2px dashed var(--color-outline);
  }
}
:focus:not(:focus-visible) { outline: 0; }
```

- [ ] **Step 2:** Sanity-check the file written:
  ```
  head -5 app/globals.css
  ```
  Expected: starts with the `/* ===== Theme tokens ====` comment.

- [ ] **Step 3:** Commit:
  ```
  git add app/globals.css
  git commit -m "feat: define light/dark theme tokens and base typography in globals.css"
  ```

---

## Task 3: Install next-themes; create `components/ThemeProvider.tsx`

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `components/ThemeProvider.tsx`

- [ ] **Step 1:** Install `next-themes`:
  ```
  npm install next-themes
  ```

  Expected: clean install, no peer-dep blockers.

- [ ] **Step 2:** Create `components/ThemeProvider.tsx` with EXACTLY this content:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
```

The `attribute="data-theme"` setting matches the CSS selectors in `globals.css`. `defaultTheme="system"` honours OS preference until the user picks one.

- [ ] **Step 3:** TypeScript check:
  ```
  npx tsc --noEmit --project tsconfig.json
  ```
  Expected: exit 0.

- [ ] **Step 4:** Commit:
  ```
  git add package.json package-lock.json components/ThemeProvider.tsx
  git commit -m "feat: add next-themes ThemeProvider wrapper"
  ```

---

## Task 4: Site data constants — `lib/site.ts`

**Files:**
- Create: `lib/site.ts`

Replaces the role of `content/nav.yml` and `content/footer.yml`. Six lines of data each — moving them into TypeScript avoids pulling in a YAML parser.

- [ ] **Step 1:** Create `lib/site.ts` with EXACTLY this content:

```ts
export const siteMetadata = {
  title: "CSS Widgets",
  description: "Front-end Technologies | CSS, HTML, Accessibility.",
  author: "Harshit Purwar",
  url: "https://css-widgets.com",
  social: {
    twitter: "harshitpurwar",
  },
} as const;

export const navLinks = [
  { title: "Snippets", url: "/snippets" },
  { title: "Guides", url: "/guides" },
  { title: "About", url: "/about" },
] as const;

export const footerContent = {
  copyright: "All Rights Reserved.",
  poweredBy: [
    { title: "Next.js", url: "https://nextjs.org" },
    { title: "Netlify", url: "https://netlify.com" },
  ],
} as const;
```

(Note: `poweredBy` updated to reflect the new stack — Next.js replaces Gatsby. Same shape as before.)

- [ ] **Step 2:** TypeScript check:
  ```
  npx tsc --noEmit --project tsconfig.json
  ```
  Expected: exit 0.

- [ ] **Step 3:** Commit:
  ```
  git add lib/site.ts
  git commit -m "feat: add lib/site.ts with nav and footer data as typed constants"
  ```

---

## Task 5: `<Header>` component

**Files:**
- Create: `components/Header/Header.tsx`, `components/Header/Header.module.css`

The header has: logo (image link to `/`), logo text (a separate SVG used as a background image so it can be filtered for dark mode), the dark-mode toggle, the nav, and a decorative hero curve at the bottom. Sticky-positioned on scroll.

- [ ] **Step 1:** Create `components/Header/Header.tsx` with EXACTLY this content:

```tsx
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav/Nav";
import { DarkToggle } from "@/components/DarkToggle/DarkToggle";
import { siteMetadata } from "@/lib/site";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          title={siteMetadata.title}
          rel="home"
          className={styles.logo}
        >
          <Image
            src="/images/logo.svg"
            alt="CSS Widgets Logo"
            width={70}
            height={70}
            className={styles.logoMark}
            priority
          />
          <span
            className={styles.logoText}
            role="img"
            aria-label={siteMetadata.title}
          />
        </Link>
        <div className={styles.toggleMobile}>
          <DarkToggle />
        </div>
        <Nav />
        <div className={styles.toggleDesktop}>
          <DarkToggle />
        </div>
      </div>
      <div className={styles.hero} aria-hidden="true">
        <svg
          preserveAspectRatio="none"
          width="100%"
          height="74"
          viewBox="0 0 1440 74"
          className={styles.heroSvg}
        >
          <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z" />
        </svg>
      </div>
    </header>
  );
}
```

- [ ] **Step 2:** Create `components/Header/Header.module.css` with EXACTLY this content:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 3;
  background: var(--color-headerBackground);
  padding: 2rem 2rem 0;
  height: 105px;
}

@media (min-width: 50em) {
  .header { height: 140px; }
}

.inner {
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-gap: 0 25px;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.logoMark {
  height: 60px;
  width: 60px;
}
@media (min-width: 50em) {
  .logoMark { height: 70px; width: 70px; }
}

.logoText {
  display: inline-block;
  width: 150px;
  height: 62px;
  background-image: url("/images/logo-text.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: brightness(var(--color-filter));
}
@media (min-width: 50em) {
  .logoText { height: 70px; background-position: 5px; }
}

.toggleMobile { display: block; }
.toggleDesktop { display: none; }
@media (min-width: 50em) {
  .toggleMobile { display: none; }
  .toggleDesktop { display: block; }
}

.hero {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  pointer-events: none;
}

.heroSvg {
  fill: var(--color-background);
  display: block;
  height: 30px;
}
@media (min-width: 50em) {
  .heroSvg { height: 60px; }
}
```

- [ ] **Step 3:** Verify file structure:
  ```
  ls components/Header/
  ```
  Expected: `Header.module.css`, `Header.tsx`.

- [ ] **Step 4:** No commit yet — Header imports `Nav` and `DarkToggle` which don't exist. We'll commit at the end of Task 7 once they're all in place.

---

## Task 6: `<Nav>` component

**Files:**
- Create: `components/Nav/Nav.tsx`, `components/Nav/Nav.module.css`

The Nav is a horizontal link list on desktop; on mobile (under 50em), it becomes a drawer toggled by a hamburger button. Open/close state requires client behaviour.

- [ ] **Step 1:** Create `components/Nav/Nav.tsx` with EXACTLY this content:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/site";
import styles from "./Nav.module.css";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.opener}
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={styles.openerBar} />
        <span className={styles.openerBar} />
        <span className={styles.openerBar} />
      </button>

      <nav
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-label="Site navigation"
      >
        <button
          type="button"
          className={styles.closer}
          aria-label="Close navigation"
          aria-expanded={open}
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <ul className={styles.list}>
          {navLinks.map((link) => (
            <li key={link.url}>
              <Link
                href={link.url}
                className={styles.link}
                onClick={() => setOpen(false)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
```

- [ ] **Step 2:** Create `components/Nav/Nav.module.css` with EXACTLY this content:

```css
.opener {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.openerBar {
  display: block;
  height: 3px;
  background: var(--color-text);
  border-radius: 2px;
}

.closer {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  line-height: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  display: block;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(80vw, 320px);
  background: var(--color-headerBackground);
  padding: 4rem 2rem 2rem;
  transform: translateX(100%);
  transition: transform 0.25s ease;
  z-index: 4;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
}

.drawerOpen { transform: translateX(0); }

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.link {
  display: block;
  font-size: 1.8rem;
  color: var(--color-text);
  text-decoration: none;
}
.link:hover { color: var(--color-link); }

@media (min-width: 50em) {
  .opener { display: none; }
  .closer { display: none; }
  .drawer {
    position: static;
    width: auto;
    background: transparent;
    padding: 0;
    transform: none;
    box-shadow: none;
  }
  .list {
    flex-direction: row;
    gap: 2rem;
  }
}
```

- [ ] **Step 3:** Verify file structure:
  ```
  ls components/Nav/
  ```
  Expected: `Nav.module.css`, `Nav.tsx`.

---

## Task 7: `<Footer>` and `<DarkToggle>` components

**Files:**
- Create: `components/Footer/Footer.tsx`, `components/Footer/Footer.module.css`
- Create: `components/DarkToggle/DarkToggle.tsx`, `components/DarkToggle/DarkToggle.module.css`

- [ ] **Step 1:** Create `components/Footer/Footer.tsx`:

```tsx
import { footerContent } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} CSS Widgets — {footerContent.copyright}
        </p>
        <p className={styles.poweredBy}>
          Powered by{" "}
          {footerContent.poweredBy.map((p, i, arr) => (
            <span key={p.title}>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.title}
              </a>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2:** Create `components/Footer/Footer.module.css`:

```css
.footer {
  background: var(--color-headerBackground);
  border-top: 1px solid var(--color-accentBackground);
  padding: 2rem;
  margin-top: 4rem;
  font-size: 1.4rem;
}
.wrap {
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}
@media (min-width: 50em) {
  .wrap {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}
.copyright, .poweredBy { margin: 0; }
.poweredBy a { color: var(--color-link); }
```

- [ ] **Step 3:** Create `components/DarkToggle/DarkToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import styles from "./DarkToggle.module.css";

export function DarkToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Avoid hydration mismatch — render a stable placeholder until mounted.
  useEffect(() => setMounted(true), []);

  const current = mounted ? (theme === "system" ? "system" : resolvedTheme) : "system";
  const isDark = current === "dark";

  function cycle() {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }

  const label =
    theme === "system" ? "Auto mode" : isDark ? "Dark mode" : "Light mode";

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={`Switch theme (currently ${label})`}
      onClick={cycle}
      title={label}
    >
      <span className={styles.icon} aria-hidden="true">
        {mounted ? (theme === "system" ? "◐" : isDark ? "🌙" : "☀") : "◐"}
      </span>
    </button>
  );
}
```

(Three-state cycle matches the Gatsby behaviour: light → dark → system → light. Animation is intentionally simplified to no animation — visual port acceptable per the spec scope, animation polish lives in Phase 7 QA if it matters.)

- [ ] **Step 4:** Create `components/DarkToggle/DarkToggle.module.css`:

```css
.toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  padding: 0.5rem;
  line-height: 1;
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.toggle:hover { color: var(--color-link); }
.icon {
  display: inline-block;
  width: 1.6em;
  height: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 5:** TypeScript check across the new component graph:
  ```
  npx tsc --noEmit --project tsconfig.json
  ```
  Expected: exit 0.

  If imports of `@/components/...` fail to resolve, recheck `tsconfig.json` — the default `"@/*": ["./*"]` should cover it. If not, add `"@/components/*": ["./components/*"]` (specific) instead of disabling type checks.

- [ ] **Step 6:** Commit all four components together (they were built as a unit):
  ```
  git add components/Header components/Nav components/Footer components/DarkToggle
  git commit -m "feat: add Header, Nav, Footer, DarkToggle components with CSS Modules"
  ```

---

## Task 8: Wire layout, page, and post route

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/[slug]/page.tsx`

- [ ] **Step 1:** Replace `app/layout.tsx` with EXACTLY this content:

```tsx
import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { siteMetadata } from "@/lib/site";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo-2",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteMetadata.title, template: `%s · ${siteMetadata.title}` },
  description: siteMetadata.description,
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={baloo.variable}>
      <body>
        <ThemeProvider>
          <a href="#main" className="skip-main">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

(`suppressHydrationWarning` on `<html>` is required when using `next-themes` because the theme attribute is set on the client and would otherwise mismatch SSR.)

- [ ] **Step 2:** Replace `app/page.tsx` — trim the redundant title (Header now provides site identity):

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  return (
    <>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`}>{post.frontmatter.title}</Link>{" "}
            <small>
              <time dateTime={String(post.frontmatter.date)}>
                {String(post.frontmatter.date)}
              </time>
            </small>
          </li>
        ))}
      </ul>
    </>
  );
}
```

- [ ] **Step 3:** Replace `app/[slug]/page.tsx` — drop the outer `<main>` since `app/layout.tsx` now provides one:

```tsx
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { mdxOptions } from "@/lib/mdx";
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
    options: mdxOptions,
  });

  return (
    <article>
      <header>
        <h1>{post.frontmatter.title}</h1>
        <p>
          <time dateTime={String(post.frontmatter.date)}>
            {String(post.frontmatter.date)}
          </time>
        </p>
      </header>
      {content}
    </article>
  );
}
```

(The post page body is unchanged from Phase 3 — only `app/page.tsx` and `app/layout.tsx` changed in this task. `app/[slug]/page.tsx` is reprinted here for clarity; you can leave it alone since it already matches.)

- [ ] **Step 4:** Build:
  ```
  rm -rf out && npm run build
  ```
  Expected: succeeds.

  Common pitfalls:
  - "Font Baloo_2 not found" — Next 16's `next/font/google` may have renamed; check with `npx next info`. If broken, swap to `import { Baloo_2 } from "next/font/google"` exact name or fall back to a local fontsource package.
  - Hydration warning about server/client mismatch on the theme — confirms `suppressHydrationWarning` is on `<html>` per Step 1.
  - "next-themes must be used in client component" — verify `ThemeProvider.tsx` and `DarkToggle.tsx` both have `"use client"` at the top.

  If the build fails, capture the exact error and STOP.

- [ ] **Step 5:** Spot-check the rendered HTML now contains the new shell:
  ```
  grep -o 'CSS Widgets Logo' out/index.html | head
  grep -oE 'data-theme="[^"]*"|className="skip-main"' out/index.html | head
  grep -o '<footer' out/index.html | head
  grep -oE '<svg[^>]*viewBox="0 0 1440 74"' out/index.html | head
  ```
  Expected:
  - Logo alt text present
  - Either `data-theme` attribute on html (from next-themes) or at least the skip-main link is in the markup
  - `<footer` element present
  - Hero SVG with the specific viewBox present

  If any of these are empty, the layout isn't wiring components in. STOP and report.

- [ ] **Step 6:** Commit:
  ```
  git add app/layout.tsx app/page.tsx 'app/[slug]/page.tsx'
  git commit -m "feat: wire Header, Footer, and ThemeProvider into root layout"
  ```

---

## Task 9: Push and verify Netlify preview

**Files:** none (deploy)

- [ ] **Step 1:** Confirm clean tree:
  ```
  git status --short
  ```
  Expected: only `.DS_Store` mess.

- [ ] **Step 2:** Push:
  ```
  git push origin next-migration
  ```
  Expected: PR #8 picks up the new commits; Netlify rebuilds.

- [ ] **Step 3:** User-driven: when the preview is green, paste the URL and verify:
  - Homepage shows the CSS Widgets logo + nav links + dark/light toggle in the header.
  - Footer at the bottom with "© <year> CSS Widgets" and "Powered by Next.js · Netlify".
  - Clicking the dark-mode toggle visibly swaps colours (background, header, headings).
  - The hero SVG curve is visible under the header.
  - Mobile (resize to <800px): nav becomes a hamburger button; tapping opens a slide-in drawer.
  - Post pages still render with the new shell + the article body from Phase 3.

  If anything is broken visually (NOT just stylistic taste — actually missing/broken), capture screenshots and report.

---

## Done criteria

- 7 new commits on `next-migration` (assets, globals.css, ThemeProvider + dep, lib/site.ts, components, layout wiring, push).
- Local `npm run build` succeeds.
- Netlify preview on PR #8 is green and shows the visible header, nav, dark-mode toggle, hero curve, and footer.
- Theme tokens swap on toggle click; persists via localStorage (next-themes default).
- All 5 posts and the homepage still load successfully under the new shell.
- Master untouched.

---

## What this plan deliberately does NOT do

- Pixel-perfect parity with every spacing/colour from the legacy site — close-enough is the bar; QA in Phase 7 catches anything that matters.
- DarkToggle animation polish (the legacy used react-spring slide-in; this plan uses no animation). Add later only if visually missed.
- Header search box (was commented out in legacy).
- Photo masonry / EXIF anything (dropped per spec).
- Cover image rendering on homepage cards or post hero (Phase 5).
- Post meta UI (prev/next, TagList, ToC) — Phase 5.
- Delete the old YAML files (`content/nav.yml`, `content/footer.yml`) — kept until Phase 7 cleanup so nothing accidentally references them.
- Polish for the `react-spring`-driven scroll-to-top button (the legacy had one); not in scope here.
