# GenAI Exchange

A React + TypeScript application bootstrapped with Vite and styled with Tailwind CSS and shadcn/ui. It includes a landing experience (hero, features, CTA), navigation, and example admin pages (add artisan/product, analytics, orders) to model a marketplace-like flow.

## Tech Stack

- Vite (React, SWC)
- TypeScript
- Tailwind CSS (+ tailwindcss-animate, typography)
- shadcn/ui (Radix primitives)
- React Router
- TanStack Query

## Getting Started

Prerequisites:
- Node.js 18+ and npm

Install dependencies:
```sh
npm install
```

Start the dev server:
```sh
npm run dev
```

Build for production:
```sh
npm run build
```

Preview the production build locally:
```sh
npm run preview
```

Lint the codebase:
```sh
npm run lint
```

## Cross-platform note (Windows and Linux)

This repository now uses Windows-safe filenames for assets under `public/`. Windows does not allow characters like `:` in file names, which previously caused clone/checkout failures on Windows. The following assets were renamed to kebab-case:

- `public/Behind the Scenes: A Day in David's Leather Workshop.jpg` → `public/behind-the-scenes-a-day-in-davids-leather-workshop.jpg`
- `public/The Art of Slow Fashion: Weaving Stories into Fabric.jpg` → `public/the-art-of-slow-fashion-weaving-stories-into-fabric.jpg`
- `public/The Science Behind Perfect Glass: Temperature, Time, and Intuition.jpg` → `public/the-science-behind-perfect-glass-temperature-time-and-intuition.jpg`
- `public/Woodworking with Purpose: Creating Furniture that Tells Stories.jpg` → `public/woodworking-with-purpose-creating-furniture-that-tells-stories.jpg`
- `public/Jewelry as Identity: Crafting Personal Narratives in Silver.jpg` → `public/jewelry-as-identity-crafting-personal-narratives-in-silver.jpg`

If you maintain assets, please avoid characters not supported on Windows file systems (e.g., `: * ? " < > |`) and prefer lowercase letters, numbers, dashes, and underscores.

## Project Structure

Key paths:
- `src/pages` — routed pages (dashboard, catalog, product detail, admin, etc.)
- `src/components` — UI components: `landing/`, `navigation/`, and `ui/` (shadcn)
- `src/lib/utils.ts` — shared utilities
- `public/` — static assets

Entry points:
- `index.html`
- `src/main.tsx` (app bootstrap)
- `src/App.tsx` (root component)

## Styling

Tailwind is configured in `tailwind.config.ts` and `postcss.config.js`. Global styles live in `src/index.css` and `src/App.css`. shadcn/ui components are located under `src/components/ui`.

## Environment

No required environment variables for local development. For production hosting, serve the `dist/` directory as static assets.

## Deployment

Any static hosting (e.g., Vercel, Netlify, GitHub Pages, Nginx) can serve the Vite build output:
1. Run `npm run build` to generate `dist/`.
2. Upload or serve the `dist/` directory from your host.

## Scripts

Defined in `package.json`:
- `dev` — start Vite dev server
- `build` — production build
- `build:dev` — development-mode build
- `preview` — preview production build
- `lint` — run ESLint

## License

This project is provided as-is for educational/demo purposes.
