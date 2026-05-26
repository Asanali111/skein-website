# wevex-website

Marketing + distribution site for [Wevex](https://github.com/Asanali111/wevex) — the
local-first context bus for every coding LLM.

## Develop

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Build

```bash
npm run build
```

`npm run build` must finish clean before any commit lands. Vercel auto-detects the
default Next.js output — no `output: "export"` override needed.

## Deploy

Vercel handles this with zero config:

```bash
npx vercel deploy        # preview
npx vercel deploy --prod # production
```

The site has no env vars, no runtime API routes, no analytics, no third-party
scripts. All claims are defensible — numbers come from the Wevex bench (see
`/bench` in the live site) and the dogfood doc in the Wevex repo.

## Stack

- **Next.js 16** (App Router, default output)
- **React 19** + TypeScript
- **TailwindCSS 3** with the warm-gray palette (see `tailwind.config.ts`)
- **Fonts via `next/font/google`**: Fraunces (variable, `opsz`+`SOFT` axes),
  IBM Plex Sans, IBM Plex Mono.

## Structure

```
wevex-website/
  app/
    layout.tsx                  # fonts, metadata, FOUC-safe theme init
    globals.css                 # palette CSS vars, typography helpers
    page.tsx                    # homepage
    sitemap.ts                  # /sitemap.xml
    robots.ts                   # /robots.txt
    integrations/
      page.tsx                  # gallery
      [id]/page.tsx             # dynamic per-client page
    security/page.tsx
    bench/page.tsx
    changelog/page.tsx
  components/
    Hero.tsx, WhatItDoes.tsx, ClientsGallery.tsx,
    Dogfood.tsx, Footer.tsx, TopNav.tsx,
    InstallBox.tsx, Cta.tsx, Badges.tsx,
    Card.tsx, SectionStrip.tsx, Terminal.tsx,
    ThemeToggle.tsx
  lib/
    clients.ts                  # one source of truth for all 7 integrations
```

## Design system

- **Warm gray** scale, two modes (`dark` + `light`). Both first-class.
- **Plum `#6d28d9`** = primary CTA, install-box left border, focus rings.
- **Sage `#65a30d`** = status dots, version badges, terminal-mock success markers.
- Accents are sparks against gray — never used for backgrounds or large areas.

## Theme

Default is dark. The toggle in the top-right persists in
`localStorage['wevex-theme']`. An inline `<script>` in `<head>` applies the class
before React hydrates to avoid a flash.

## Conventions

- **Atomic commits.** No `git add -A`. Stage specific files.
- **No `Co-Authored-By: Claude`.** Sole author: `Asanali111 <asanaliomar93@gmail.com>`.
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `style:`.
- **Security sweep** before every push — bearer tokens, `Authorization: Bearer …`,
  full hex tokens must never appear in source. Install instructions use
  `$WEVEX_TOKEN` placeholders.
