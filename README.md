# Autus Robotics Website

Static marketing site for **autusrobotics.com** — a Berlin robotics company that
builds shelf-scanning and restocking robot cells and perception software that
turns a shelf photo into a 3-D planogram digital twin. Plain HTML/CSS/JS, hosted
on GitHub Pages (no build step).

## Positioning

The site leads with the concrete, provable capability (supermarket shelf
scanning/restocking + photo→3-D planogram twins) rather than generic "AI
services". The homepage proof section shows a real pipeline output (a Bonduelle
can-tray photo → textured 3-D model → geometry).

## Pages

- **index.html** — Hero + value proposition, capability chips, "What we do",
  "How it works" (3 steps), proof section (photo→3-D image), by-the-numbers,
  technology/approach, CTA.
- **services.html** — Shelf scanning, robotic restocking/picking/palletising,
  photo→3-D planogram twins, fixed-fee pilots.
- **about.html** — Company story, approach, team (placeholders where names are
  not yet public).
- **contact.html** — Enquiry form (see below).
- **impressum.html** / **datenschutz.html** — German legal pages (§5 DDG
  Impressum, DSGVO privacy policy). **Templates with clearly-marked
  placeholders** (`.fillme` / `.legal-placeholder`) the owner must complete and
  have reviewed before launch.

## Structure

- `css/styles.css` — single stylesheet; design tokens + `@font-face` at the top.
- `js/config.js` — **single source of truth** for the enquiry-form provider/key.
- `js/contact.js` — enquiry-form handler (validation, honeypot, submit, fallback).
- `js/main.js` — nav, header scroll state, reveal-on-scroll (IntersectionObserver,
  respects `prefers-reduced-motion`; gated on `html.js` so no-JS shows content).
- `assets/fonts/` — self-hosted Plus Jakarta Sans (woff2, latin + latin-ext).
  **No third-party font CDN.**
- `assets/img/` — proof image (`shelf-to-3d.jpg`/`.webp`) and OG image.
- `assets/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`.

## Enquiry form

The form on `contact.html` posts to a pluggable endpoint configured in
[`js/config.js`](js/config.js) — Web3Forms by default, Formspree optional. It
validates input client-side, includes a honeypot spam field, and shows
success/error states. Until an access key is configured it gracefully falls back
to opening the visitor's email client with a pre-filled draft to
**info@autusrobotics.com**, so no enquiry is lost.

**Owner's one-minute step:** get a free access key at <https://web3forms.com>
(enter your email, no account) and paste it into `js/config.js`.

## Running locally

```bash
python3 -m http.server 8000    # then visit http://localhost:8000
```

## Testing

A dependency-free, network-free smoke test validates that every page parses and
has the core scaffolding, that all local references resolve, and that ids are
unique:

```bash
python3 scripts/check_site.py
```

This is the `commands.test` gate in `.no-mistakes.yaml`.
