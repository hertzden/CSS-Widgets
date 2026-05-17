# Phase 1 — Next.js Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a working Next.js (App Router, TypeScript) skeleton on a new `next-migration` branch, configured for static export and deploying via Netlify preview. Old Gatsby source preserved under `_legacy/` for reference during later phases.

**Architecture:** Replace Gatsby tooling at the repo root with a freshly-scaffolded Next.js app. Old `src/` and `plugins/` move to `_legacy/` so subsequent porting phases can copy from them without git-archeology. `content/` stays in place (posts and pages will be wired up in Phase 2). Master branch is untouched — it keeps deploying the current Gatsby site through cutover.

**Tech Stack:** Next.js (latest, App Router), TypeScript, CSS Modules, npm, Node 20, Netlify.

**Spec:** `docs/superpowers/specs/2026-05-17-gatsby-to-nextjs-migration-design.md`

---

## File structure after Phase 1

```
/
├── app/
│   ├── layout.tsx            # Created by create-next-app; minimal customization
│   ├── page.tsx              # Placeholder homepage ("Migration in progress")
│   └── globals.css           # Created by create-next-app; reset to minimal
├── public/
│   └── favicon.svg           # Moved from content/favicon.svg
├── content/
│   ├── footer.yml            # Stays — used in Phase 4
│   ├── nav.yml               # Stays — used in Phase 4
│   ├── pages/                # Stays — wired up in Phase 2/5
│   └── posts/                # Stays — wired up in Phase 2
├── _legacy/
│   ├── src/                  # Old Gatsby source for reference during porting
│   └── plugins/              # Old custom plugins (gatsby-plugin-my-social-cards)
├── docs/superpowers/         # Specs & plans
├── next.config.mjs           # output: 'export', trailingSlash, image config
├── netlify.toml              # Build command + publish dir
├── tsconfig.json             # Created by create-next-app; tweak paths
├── package.json              # Fresh, created by create-next-app
├── package-lock.json
├── .gitignore                # Created by create-next-app
├── readme.md                 # Preserved
└── license                   # Preserved
```

---

## Task 1: Create the migration branch

**Files:**
- Touch: git refs only

- [ ] **Step 1: Verify clean working tree on master**

Run: `git status --short`
Expected: only the pre-existing `.DS_Store` modifications (nothing new from prior work).

If untracked work exists that shouldn't be discarded, stop and ask the user.

- [ ] **Step 2: Create and switch to `next-migration` branch**

Run: `git checkout -b next-migration`
Expected: `Switched to a new branch 'next-migration'`

- [ ] **Step 3: Confirm branch**

Run: `git branch --show-current`
Expected: `next-migration`

---

## Task 2: Preserve legacy Gatsby source under `_legacy/`

**Files:**
- Move: `src/` → `_legacy/src/`
- Move: `plugins/` → `_legacy/plugins/`

- [ ] **Step 1: Create `_legacy/` directory**

Run: `mkdir -p _legacy`

- [ ] **Step 2: Move `src/` and `plugins/` into it**

Run: `git mv src _legacy/src && git mv plugins _legacy/plugins`
Expected: no output, exit 0.

`git mv` preserves history — `git log --follow _legacy/src/components/Header/index.js` will still show the file's history.

- [ ] **Step 3: Verify**

Run: `ls _legacy && ls _legacy/src | head -5`
Expected: `_legacy/` contains `plugins/` and `src/`; `_legacy/src/` contains familiar folders (`components`, `pages`, `templates`, etc.).

- [ ] **Step 4: Commit**

Run:
```
git add -A
git commit -m "chore: move Gatsby src and plugins under _legacy/ for migration reference"
```

---

## Task 3: Delete Gatsby root files

**Files:**
- Delete: `gatsby-browser.js`, `gatsby-config.js`, `gatsby-node.js`, `gatsby-ssr.js`
- Delete: `package.json`, `package-lock.json`, `yarn.lock`, `yarn-error.log`
- Delete: `node_modules/`, `public/`
- Delete: `content/photos/` (empty per spec — drop)

- [ ] **Step 1: Delete Gatsby config and lockfiles**

Run:
```
rm -f gatsby-browser.js gatsby-config.js gatsby-node.js gatsby-ssr.js
rm -f package.json package-lock.json yarn.lock yarn-error.log
```

- [ ] **Step 2: Delete build artefacts and dependencies**

Run: `rm -rf node_modules public`

- [ ] **Step 3: Delete empty photos folder**

Run: `rm -rf content/photos`

- [ ] **Step 4: Verify expected layout**

Run: `ls -A`
Expected files/dirs: `.git`, `.gitignore` (if any), `_legacy`, `content`, `docs`, `license`, `readme.md`. Plus `.DS_Store` is fine.

Should NOT see: `gatsby-*.js`, `package*.json`, `yarn*.lock*`, `node_modules`, `plugins`, `public`, `src`.

- [ ] **Step 5: Commit**

Run:
```
git add -A
git commit -m "chore: remove Gatsby root files in preparation for Next.js scaffold"
```

---

## Task 4: Scaffold Next.js app at repo root

**Files:**
- Create: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.mjs`, `next-env.d.ts`, `.gitignore`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/favicon.ico` (will be replaced)

- [ ] **Step 1: Run create-next-app non-interactively at repo root**

Run:
```
npx --yes create-next-app@latest . \
  --typescript \
  --eslint \
  --no-tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --use-npm \
  --no-turbopack
```

Expected: scaffolds files into the current directory. The scaffolder will complain about the directory not being empty — it should detect existing dirs (`content/`, `_legacy/`, `docs/`, `license`, `readme.md`) and proceed by adding new files. If it refuses, stop and report which conflict it raised.

- [ ] **Step 2: Verify Next.js files were created**

Run: `ls -A app && cat package.json | head -20`
Expected: `app/` contains at minimum `layout.tsx`, `page.tsx`, `globals.css`. `package.json` declares `next`, `react`, `react-dom`.

- [ ] **Step 3: Verify the dev server boots locally**

Run: `npm run dev` in one terminal; in another run `curl -sS http://localhost:3000 | head -20`.
Expected: response contains HTML from the default Next.js starter page (look for `<title>` and React-rendered markup).

Kill dev server (`Ctrl+C` in its terminal).

- [ ] **Step 4: Commit the scaffold**

Run:
```
git add -A
git commit -m "feat: scaffold Next.js (App Router, TypeScript) at repo root"
```

---

## Task 5: Replace homepage and globals with a placeholder

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

Goal: strip the default starter content down to a minimal "Migration in progress" placeholder so previews are clearly intentional and unstyled, not abandoned.

- [ ] **Step 1: Replace `app/page.tsx`**

Overwrite the file with:

```tsx
export default function Home() {
  return (
    <main>
      <h1>CSS Widgets — migration in progress</h1>
      <p>
        This is the Next.js scaffold for{" "}
        <a href="https://css-widgets.com">css-widgets.com</a>. Content and design
        are being ported phase by phase.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Replace `app/layout.tsx`**

Overwrite the file with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSS Widgets",
  description: "Front-end Technologies | CSS, HTML, Accessibility.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Replace `app/globals.css`**

Overwrite the file with:

```css
:root {
  color-scheme: light dark;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}

body {
  margin: 0;
  padding: 2rem;
  max-width: 40rem;
  margin-inline: auto;
}

a {
  color: inherit;
}
```

- [ ] **Step 4: Boot dev server and verify**

Run: `npm run dev`, then `curl -sS http://localhost:3000 | grep -o 'migration in progress'`
Expected: `migration in progress`

Kill the dev server.

- [ ] **Step 5: Commit**

Run:
```
git add app/page.tsx app/layout.tsx app/globals.css
git commit -m "feat: replace Next.js starter content with migration placeholder"
```

---

## Task 6: Configure static export and image settings

**Files:**
- Modify (replace): `next.config.ts` or `next.config.mjs` (whichever create-next-app produced)

create-next-app may emit either `next.config.ts` or `next.config.mjs` depending on version. The plan assumes `.ts` and notes the variant.

- [ ] **Step 1: Identify the config file**

Run: `ls next.config.*`
Expected: exactly one of `next.config.ts` or `next.config.mjs`. Note which it is.

- [ ] **Step 2: Replace its contents**

If the file is `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

If the file is `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

- [ ] **Step 3: Verify static export builds**

Run: `npm run build`
Expected: build succeeds. Output ends with `Exporting (X/X)`. An `out/` directory now exists containing `index.html`, `_next/`, etc.

- [ ] **Step 4: Verify the exported homepage renders**

Run: `grep -o 'migration in progress' out/index.html`
Expected: `migration in progress`

- [ ] **Step 5: Commit**

Run:
```
git add next.config.*
git commit -m "feat: configure Next.js for static export with trailing slashes"
```

---

## Task 7: Add Netlify build configuration

**Files:**
- Create: `netlify.toml`

- [ ] **Step 1: Create `netlify.toml`**

Write the file:

```toml
[build]
  command = "next build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 2: Verify with the same local build**

Run: `rm -rf out && npm run build && ls out/index.html`
Expected: `out/index.html` exists.

- [ ] **Step 3: Commit**

Run:
```
git add netlify.toml
git commit -m "feat: add Netlify build config (static export, Node 20)"
```

---

## Task 8: Move favicon and tidy gitignore

**Files:**
- Move: `content/favicon.svg` → `public/favicon.svg`
- Delete: `app/favicon.ico` (replaced by SVG)
- Modify: `.gitignore`

- [ ] **Step 1: Ensure `public/` exists, then move the favicon**

Run: `mkdir -p public && git mv content/favicon.svg public/favicon.svg`
Expected: no output.

- [ ] **Step 2: Delete the default ICO favicon**

Run: `git rm app/favicon.ico 2>/dev/null || rm -f app/favicon.ico`
Expected: silent (file removed if it existed).

- [ ] **Step 3: Reference the SVG favicon in the root layout**

Edit `app/layout.tsx`, replace the `metadata` export with:

```ts
export const metadata: Metadata = {
  title: "CSS Widgets",
  description: "Front-end Technologies | CSS, HTML, Accessibility.",
  icons: { icon: "/favicon.svg" },
};
```

- [ ] **Step 4: Append static-export artefacts to `.gitignore`**

Open `.gitignore`. Confirm it already ignores `node_modules`, `.next`. Add these lines at the bottom if not present:

```
# Static export output
/out/
```

- [ ] **Step 5: Build & verify favicon and gitignore**

Run: `rm -rf out && npm run build && ls public/favicon.svg out/favicon.svg && git status --short out`
Expected: both `public/favicon.svg` and `out/favicon.svg` exist; `git status --short out` returns no output (i.e. `out/` is ignored).

- [ ] **Step 6: Commit**

Run:
```
git add -A
git commit -m "feat: use SVG favicon, ignore static export output"
```

---

## Task 9: Sanity check — `.DS_Store` cleanup is out of scope

**Files:** none

Pre-existing `.DS_Store` modifications were on master before this branch existed. They are unrelated to this migration and out of scope for Phase 1.

- [ ] **Step 1: Confirm we did not stage any `.DS_Store` files in this branch's commits**

Run: `git log --oneline master..next-migration -- '*.DS_Store'`
Expected: empty output.

If output is non-empty, stop and report which commit included it; we should clean it up before pushing.

---

## Task 10: Push branch and verify Netlify preview

**Files:** none (CI/CD action)

- [ ] **Step 1: Push the branch**

Run: `git push -u origin next-migration`
Expected: branch published; Netlify (which watches the repo) starts a deploy preview automatically.

- [ ] **Step 2: Wait for Netlify deploy preview**

Open the Netlify dashboard for the site and watch the `next-migration` branch deploy. Or wait for the bot comment on the branch (if PR is open).

Expected: deploy succeeds (green), preview URL provided.

- [ ] **Step 3: Verify the preview URL serves the placeholder**

Run in browser (or `curl`): the Netlify preview URL.
Expected: page reads "CSS Widgets — migration in progress" with the favicon visible in the tab.

If the build failed on Netlify but succeeded locally, capture the Netlify build log and stop — likely culprits: Node version mismatch (check `netlify.toml`), missing env vars, base directory misconfigured in Netlify site settings.

- [ ] **Step 4: Note the preview URL for Phase 2**

Record the preview URL in this plan as a comment or in a scratch note — it's the validation surface for the next phase.

---

## Done criteria

All of the following true at end of Phase 1:

- `next-migration` branch exists with commits described above.
- `npm run dev` works locally on the branch and shows the placeholder.
- `npm run build` produces `out/index.html` containing "migration in progress".
- `netlify.toml` is at root and Netlify deploy preview is green.
- `master` is unchanged — still deploys the current Gatsby site.
- `_legacy/src/` and `_legacy/plugins/` contain the previous Gatsby source for reference in later phases.
- `content/` is intact except `content/photos/` (deleted, was empty).

---

## What this plan deliberately does NOT do

(For later phases — listed so the engineer doesn't get tempted.)

- Port any actual component (`Header`, `Nav`, `DarkToggle`, etc.) — Phase 4.
- Wire MDX or read any post — Phase 2.
- Configure `tsconfig.json` paths beyond what create-next-app set up — done as needed in later phases.
- Install any port-related dependency (`gray-matter`, `next-mdx-remote`, etc.) — added when first used.
- Set up dark mode, RSS, sitemap, manifest, GA, Disqus, OG images — later phases.
- Touch `master`.
