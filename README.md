# Autus Robotics Website

Website for **autusrobotics.com** — software services focused on Agentic AI, AI-based automation, and AI-driven robotics and automation software.

## Theme

- **Colors:** Greenish-blue (teal) accent and greyish-black background
- **Style:** Minimal, elegant, responsive (phone, tablet, desktop)

## Pages

- **Home** — Hero, services overview, clients (e.g. Andersen), happy customer testimonials, CTA
- **Services** — Agentic AI, AI automation, AI-driven robotics & automation software
- **About** — Company intro and approach
- **Contact** — Form that opens mail to **info@autusrobotics.com**

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

All contact form submissions open the user’s email client with a draft to **info@autusrobotics.com**. For server-side form handling (e.g. Formspree, Netlify Forms), replace the form in `contact.html` and point the action to your endpoint.
