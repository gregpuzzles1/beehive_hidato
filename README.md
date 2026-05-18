# 🐝 Beehive Hidato

A modern React + TypeScript web app for playing **Beehive Hidato** puzzles with five difficulty levels, randomized hive variants, gameplay controls, and light/dark theme support.

## Live Site

- GitHub Pages: https://gregpuzzles1.github.io/beehive_hidato/

## Features

- Five difficulty levels:
  - 🟢 Gentle Flow
  - 🔵 Thoughtful
  - 🔴 Strategic
  - 🟣 Architect
  - 🐝 Queen's Challenge
- Randomized puzzle generation with beehive-style layouts
- Number selector and click/keyboard number entry
- Gameplay controls: **Check**, **Reset**, **Solution**, **Next Puzzle**
- Timer with **Timer Off** and **Pause/Resume** behavior
- Completion modal with check count, mistake count, and elapsed time
- How to Play page with rules and interface guide
- Contact form with client-side validation and async submit states
- Theme toggle (light/dark) with persisted preference

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Vitest + Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the app at the URL printed by Vite (typically `http://localhost:5173/beehive_hidato/`).

## Available Scripts

- `npm run dev` — start local dev server
- `npm run lint` — run ESLint
- `npm run build` — type-check and create production build
- `npm run preview` — preview production build locally
- `npm run test` — run unit/integration tests (Vitest)
- `npm run test:watch` — run Vitest in watch mode
- `npm run test:e2e` — run Playwright tests

## Build and Deploy

- CI workflow (`.github/workflows/ci.yml`) runs on pull requests to `main`:
  - `npm ci`
  - `npm run lint`
  - `npm run build`
  - `npm run test`
- Deploy workflow (`.github/workflows/deploy.yml`) runs on pushes to `main` and publishes `dist/` to GitHub Pages.

## Project Structure

```text
src/
  app/
  components/
  features/
  pages/
  styles/
  types/
```

## Contact Form Setup

The contact form endpoint is configured in:

- `src/features/contact/contactConfig.ts`

Replace `YOUR_FORM_ID` with your Formspree form ID before production use.

## License

MIT (see footer links in-app).
