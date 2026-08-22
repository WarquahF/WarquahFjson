# Warquah Faiz — Portfolio v3

A rebuild of the portfolio on Astro + Svelte + TypeScript. Static-first;
Svelte only hydrates the three components that genuinely need client JS
(loading sequence, command palette, project detail panel).

## Setup

```bash
npm install
npm run dev       # local dev server
npm run build     # static output to dist/
npm run preview   # preview the build
```

## Fonts

`src/styles/global.css` references three self-hosted variable fonts that
aren't included in this export (keep the repo dependency-light and license-
clean — download them yourself):

- `/public/fonts/fraunces-variable.woff2` — [Fraunces](https://fonts.google.com/specimen/Fraunces), variable, weights 300–700
- `/public/fonts/inter-variable.woff2` — [Inter](https://fonts.google.com/specimen/Inter), variable, weights 400–600
- `/public/fonts/plex-mono.woff2` — [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono), regular + medium

Google Webfonts Helper (gwfh.mranftl.com) is the fastest way to grab
self-hostable woff2 files for all three. Drop them in `public/fonts/` and
the `@font-face` rules in `global.css` will pick them up — no other changes
needed. Swap in system fallbacks in the meantime if you want to preview
without fonts first.

## Design notes

- **Palette:** near-black (`#0b0b0d`) background, off-white ink, muted gray
  secondary text, and a single restrained amber "signal" color
  (`#d9a65c`) used only for status dots, active states and the one
  primary button — a nod to phosphor terminal displays, used sparingly
  rather than as a cyberpunk motif.
- **Type:** Fraunces (serif, editorial/notebook voice) for headlines,
  Inter for body copy, IBM Plex Mono for labels, data and structure —
  three roles, not one all-mono "hacker" treatment.
- **Signature element:** the left-edge "document gutter" — a fixed rail
  with tick marks per section that brightens as you scroll, via a single
  `IntersectionObserver`. It's meant to make the whole page read like one
  continuous document rather than a stack of unrelated sections. Hidden
  under 780px in favor of the standard top nav.
- **Motion:** a single-pass reveal-on-scroll (`data-reveal` + IO), plus
  hover/focus micro-interactions and the palette/panel transitions.
  Nothing loops or floats. `prefers-reduced-motion` disables all of it.
- **Marquee removed:** the old scrolling name/role ticker is gone and was
  not replaced with any other ticker/ribbon effect, per the brief.

## Structure

```
src/
  components/          Astro components (static)
  components/svelte/    Svelte components (interactive only)
  layouts/              Base HTML shell + document gutter
  pages/                index.astro assembles the page
  data/                 Project + nav content as typed data
  styles/               Design tokens + base styles
```

## Content

Project details, focus areas, and contact links are pulled from your
existing site (github.com/WarquahF, warquah.dev@proton.me, @warquah35 on
X) — nothing invented. Edit `src/data/projects.ts` and `src/data/nav.ts`
to update content without touching markup.
