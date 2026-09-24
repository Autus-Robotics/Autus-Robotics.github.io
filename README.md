# Autus Robotics Website

Website for **autusrobotics.com** — software services focused on Agentic AI, AI-based automation, and AI-driven robotics and automation software.

## Theme

- **Colors:** Greenish-blue (teal) accent and greyish-black background
- **Style:** Minimal, elegant, responsive (phone, tablet, desktop)

## Pages

- **Home** — Hero, services overview, clients (e.g. Andersen), happy customer testimonials, CTA
- **Services** — Agentic AI, AI automation, AI-driven robotics & automation software
- **About** — Company intro and approach
- **Contact** — Enquiry form that emails **info@autusrobotics.com** (with a mailto fallback)

## Running locally

Open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

Or with Python:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Testimonials

The “Happy customers” section on the home page uses static placeholder quotes. To show real feedback:

1. Edit the `.testimonial-card` blocks in `index.html` (inside `#testimonials-grid`).
2. Replace quote, author, and role with real customer testimonials (with their permission).

## Contact

The enquiry form on `contact.html` posts messages to a pluggable email endpoint (Web3Forms by default, Formspree optional) and validates input client-side. Until an access key is configured it gracefully falls back to opening the visitor’s email client with a pre-filled draft to **info@autusrobotics.com**, so no enquiry is lost.

To make enquiries arrive by email, follow the one-minute setup at the top of [`js/config.js`](js/config.js) — that file is the single source of truth for the provider, access key, and destination inbox.
