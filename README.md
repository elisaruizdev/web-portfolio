# Elisa Ruiz — Portfolio

Personal portfolio of **Elisa Ruiz**, Front-End Developer based in Madrid with 4+ years of experience building banking and fintech applications with Angular, Vue and TypeScript.

The site showcases my professional experience, personal projects, technical strengths and a small blog, and offers my CV for download in two formats (designed and ATS-friendly).

## Features

- **Interactive landing page** with animated typography, 3D shapes rendered with Three.js and scroll-driven sections.
- **Experience & projects** — career timeline, daily tech stack and personal projects with screenshots shown inside a browser frame.
- **Blog** — Markdown-based posts with their own routes (`/blog`, `/blog/:slug`).
- **Downloadable CV** — a designed PDF plus an ATS-optimised PDF generated automatically at build time.
- **SEO ready** — per-page meta tags, Open Graph, JSON-LD structured data, and auto-generated `sitemap.xml` and `robots.txt`.
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
| `npm run build` | Generates the ATS CV, type-checks, builds the site and creates the SEO files. |
| `npm run cv:ats` | Generates only the ATS-friendly CV PDF. |
| `npm run preview` | Serves the production build locally. |

## Project structure

```
├── public/              # Static assets: CVs, logos, project screenshots, favicon
├── scripts/
│   ├── generate-cv-ats.mjs    # Builds the ATS-friendly CV PDF
│   └── generate-seo-files.mjs # Writes sitemap.xml and robots.txt into dist/
└── src/
    ├── components/      # Reusable UI, 3D and animation components
    │   └── sections/    # Landing page sections (Hero, Experience, Projects, Contact…)
    ├── data/            # Site content: profile, experience, projects and blog posts
    ├── pages/           # Home, Blog and Blog post pages
    ├── seo/             # SEO configuration and JSON-LD helpers
    └── utils/           # Shared helpers
```

All site content lives in [`src/data/site.ts`](src/data/site.ts) and [`src/data/blog.ts`](src/data/blog.ts), so it can be updated without touching the components.

## Deployment

The site is deployed on **Netlify** using the configuration in [`netlify.toml`](netlify.toml):

- Build command: `npm run build`
- Publish directory: `dist`

Client-side routing is handled through `public/_redirects` (Netlify) and `vercel.json` (Vercel).

## Contact

- **LinkedIn:** [linkedin.com/in/elisaruizortega](https://www.linkedin.com/in/elisaruizortega)
- **GitHub:** [github.com/elisaruizdev](https://github.com/elisaruizdev)
- **Email:** [elisaruizortegadev@gmail.com](mailto:elisaruizortegadev@gmail.com)

---

© Elisa Ruiz. All rights reserved.
