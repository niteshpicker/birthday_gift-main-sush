# Interactive 3D Birthday Gift Card

A mobile-first, interactive 3D birthday gift web application built with React, TypeScript, Tailwind CSS, Framer Motion, and Three.js (`@react-three/fiber`). Designed to feel smooth inside mobile browsers and social in-app browsers such as Instagram DM.

Live deployment: **[https://hpbd-phuong-ngoc.vercel.app](https://hpbd-phuong-ngoc.vercel.app)**

---

## Features

- **Page 0 — 3D Birthday Cake Cover (`src/components/Page0Cover.tsx`)**: Interactive 3D cake (`BirthdayCake3D.tsx`) with drag-to-spin gesture and gift unwrapping button that unlocks background audio cleanly on mobile.
- **Page 1 — Envelope Letter (`src/components/Page1Letter.tsx`)**: Interactive envelope animation with expandable full-letter view and touch-optimized momentum scrolling.
- **Page 2 — Chapter Story (`src/components/Page2Diary.tsx`)**: Multi-chapter keepsake cards paired with custom photos.
- **Page 3 — 3D Wishing Star Jar (`src/components/Page3Wishes.tsx`)**: Centered 3D glass wishing jar filled with colorful puffy origami stars; press-and-hold/shake and release to launch a glowing star along an inverted parabolic arc that reveals a randomized birthday wish.
- **Page 4 — Photobooth (`src/components/Page4Photobooth.tsx`)**: Printable photo strip with animated sticker overlays and slide-out animation.
- **Page 5 — Hold-to-Blow Candles (`src/components/Page5Candles.tsx`)**: Press-and-hold interaction to blow out 3D candles with flame fade and re-light option.
- **Page 6 — Finale (`src/components/Page6Finale.tsx`)**: Celebration screen with confetti and replay navigation.
- **Audio & Mobile Polish (`src/components/AudioToggle.tsx`)**: Background MP3 track with automatic pause/resume on tab/app visibility changes, safe-area inset bottom navigation, and Open Graph link preview (`public/og-cover.png`) configured dynamically in `vite.config.ts`.

---

## Tech Stack

- **UI & Animation:** React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, `canvas-confetti`
- **3D Rendering:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Build & Tooling:** Vite 5
- **Containerization:** Multi-stage Docker (`node:22-alpine` builder + `nginx:1.27-alpine` static server)
- **CI/CD & Hosting:** GitHub Actions + Vercel (`vite` static SPA)

---

## Project Structure

```text
.
├── .github/workflows/
│   ├── ci.yml                # Typecheck, Vite build, asset verification, audit & Docker smoke test
│   └── deploy-vercel.yml     # Automated Vercel preview & production deployments
├── docker/
│   └── nginx.conf            # SPA routing, gzip, cache headers & /healthz endpoint
├── public/
│   ├── audio/                # Background music track
│   ├── images/               # Story and photobooth images
│   ├── stickers/             # Animated GIF stickers
│   └── og-cover.png          # 1200x630 Open Graph preview image
├── src/
│   ├── components/           # Page components, 3D cake, BottomNav, AudioToggle
│   ├── data/
│   │   └── mockData.ts       # Centralized text, wishes, image paths, audio URL
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── Dockerfile
├── docker-compose.yml
├── index.html                # Meta tags, Google Fonts & OG placeholders
├── package.json
├── vercel.json               # Vercel Vite build config, SPA rewrites & cache headers
└── vite.config.ts            # Resolves absolute OG image/URL per deployment environment
```

---

## Local Development

Prerequisites: **Node.js >= 20** (tested with Node 22 / 26) and **npm**.

```bash
# 1. Install dependencies
npm ci

# 2. Start local dev server
npm run dev

# 3. Run TypeScript project check
npm run typecheck

# 4. Build production bundle into dist/
npm run build

# 5. Preview built bundle locally
npm run preview
```

---

## Customizing Content

- **All page text, wishes, names, dates, and asset paths:** edit `src/data/mockData.ts`.
- **Browser tab title and Open Graph link preview metadata (Instagram / social DM):** edit `index.html`.
- **Audio, photos, stickers, and OG cover image:** replace assets inside `public/` while keeping filenames consistent with `src/data/mockData.ts` and `index.html`.

---

## Docker Usage

Run the production build inside Nginx using Docker Compose:

```bash
# Build and start container in background (default port 8080)
docker compose up -d --build

# Check container health
curl -i http://localhost:8080/healthz
```

Or build and run with Docker directly:

```bash
# Build image (optionally set VITE_SITE_URL for canonical Open Graph URLs)
docker build \
  --build-arg VITE_SITE_URL=https://hpbd-phuong-ngoc.vercel.app \
  -t birthday-gift .

# Run container on port 8080
docker run -d --name birthday-gift -p 8080:80 birthday-gift
```

---

## CI/CD & Vercel Deployment

### GitHub Actions Workflows

1. **CI (`.github/workflows/ci.yml`)** — runs on every push and pull request targeting `main`:
   - Installs dependencies with `npm ci`
   - Runs `npm run typecheck` (`tsc -b`) and `npm run build`
   - Verifies `dist/` assets and resolved Open Graph tags
   - Runs `npm audit --omit=dev --audit-level=high`
   - Builds the Docker image and runs live HTTP smoke tests against Nginx (`/healthz`, `/`, `/og-cover.png`, `/audio/...`, `/images/...`, `/stickers/...`, and SPA fallback routing)
2. **Vercel CD (`.github/workflows/deploy-vercel.yml`)** — deploys previews on PRs and production builds on pushes to `main` (or via manual `workflow_dispatch`):
   - Uses pinned Vercel CLI (`vercel@65.16.0`) with `vercel pull`, `vercel build`, and `vercel deploy --prebuilt`

#### Required GitHub Repository Secrets (for `deploy-vercel.yml`)

Add these three secrets under **GitHub Repo -> Settings -> Secrets and variables -> Actions**:

| Secret Name | Source |
| --- | --- |
| `VERCEL_TOKEN` | Vercel Account Settings -> Tokens |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

### Manual Vercel CLI Deployment

If `.vercel/project.json` is linked locally:

```bash
npm run build
vercel deploy --prod --yes
```

`vercel.json` explicitly locks `framework: "vite"`, `buildCommand: "npm run build"`, `outputDirectory: "dist"`, SPA rewrites, and cache headers, while `.vercelignore` excludes Docker, CI, and raw reference files so Vercel deployments stay fast and unaffected by container configuration.
