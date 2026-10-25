# Elisa Ruiz — Portfolio

Personal portfolio of **Elisa Ruiz**, Front-End Developer based in Madrid with 4+ years of experience building banking and fintech applications with Angular, Vue and TypeScript.

The site showcases my professional experience, personal projects, technical strengths and a small blog, and offers my CV for download in two formats (designed and ATS-friendly).

## Features

- **Interactive landing page** with animated typography, 3D shapes rendered with Three.js and scroll-driven sections.
- **Experience & projects** — career timeline, daily tech stack and personal projects with screenshots shown inside a browser frame.
- **Blog** — Markdown-based posts with their own routes (`/blog`, `/blog/:slug`).
- **Downloadable CV** — a designed PDF plus an ATS-optimised PDF generated automatically at build time.
- **SEO ready** — every route is prerendered to static HTML at build time, with per-page meta tags, Open Graph image, JSON-LD structured data (Person, ProfessionalService, BlogPosting), and auto-generated `sitemap.xml` and `robots.txt`.
- **Responsive and accessible** layout, from mobile to large desktop screens.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, React Router 7 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation & 3D | Framer Motion, Three.js, React Three Fiber |
| Content | React Markdown |
| Tooling | Vite 6, PDFKit (CV generation) |
| Deployment | Netlify (Vercel config also included) |

## Getting started

**Requirements:** Node.js 20 or later.

```bash
# Install dependencies
npm install

# Start the development server at http://localhost:5180
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

### Environment variables

Copy `.env.example` to `.env` and set the public URL of the site. It is used for canonical URLs, Open Graph tags and the sitemap.

```bash
VITE_SITE_URL=https://your-domain.com
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port 5180. |
| `npm run build` | Generates the ATS CV, type-checks, builds the site, prerenders every route to HTML and creates the SEO files. |
| `npm run cv:ats` | Generates only the ATS-friendly CV PDF. |
| `npm run preview` | Serves the production build locally. |

## Project structure

```
├── public/              # Static assets: CVs, logos, project screenshots, favicon
├── scripts/
│   ├── generate-cv-ats.mjs    # Builds the ATS-friendly CV PDF
│   ├── prerender.mjs          # Renders each route (src/entry-server.tsx) to static HTML in dist/
│   └── generate-seo-files.mjs # Writes sitemap.xml and robots.txt into dist/
└── src/
    ├── components/      # Reusable UI, 3D and animation components
    │   └── sections/    # Landing page sections (Hero, Experience, Projects, Contact…)
    ├── data/            # Site content: profile, experience, projects and blog posts
    ├── pages/           # Home (hero + audience choice) with its Services and Experience views, Blog, Blog post and 404
    ├── seo/             # SEO configuration and JSON-LD helpers
    └── utils/           # Shared helpers
```

All site content lives in [`src/data/site.ts`](src/data/site.ts) and [`src/data/blog.ts`](src/data/blog.ts), so it can be updated without touching the components.

## Deployment

The site is deployed on **Netlify** using the configuration in [`netlify.toml`](netlify.toml):

- Build command: `npm run build`
- Publish directory: `dist`

Each route is served from its prerendered file (`index.html`, `blog.html`, `blog/<slug>.html`…); unknown URLs get `404.html` with a real 404 status. On Vercel, `vercel.json` enables `cleanUrls` so `/blog` maps to `blog.html`. The old `/servicios` and `/experiencia` views now live on the home page and redirect there with a 301 (`netlify.toml` and `vercel.json`). New routes must be added to `routes` in [`src/entry-server.tsx`](src/entry-server.tsx).

The contact form (`recruiter`) uses **Netlify Forms**. It is declared as a hidden static form in [`index.html`](index.html) so Netlify can detect it at deploy time; their fields must match [`src/components/ContactForm.tsx`](src/components/ContactForm.tsx). Form detection and email notifications are enabled in the Netlify dashboard (Forms).

## Contact

- **LinkedIn:** [linkedin.com/in/elisaruizortega](https://www.linkedin.com/in/elisaruizortega)
- **GitHub:** [github.com/elisaruizdev](https://github.com/elisaruizdev)
- **Email:** [elisaruizortegadev@gmail.com](mailto:elisaruizortegadev@gmail.com)

---

© Elisa Ruiz. All rights reserved.
