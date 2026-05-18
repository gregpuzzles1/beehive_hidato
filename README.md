# 🐝 Beehive Hidato

A modern hexagonal number-puzzle website built with React + TypeScript + Vite. Solve Hidato puzzles on a honeycomb grid across five difficulty levels — all in the browser, no server required.

**Live site**: [gregpuzzles1.github.io/beehive_hidato](https://gregpuzzles1.github.io/beehive_hidato/)

---

## What is Beehive Hidato?

Hidato is a logic puzzle where you fill a grid with consecutive numbers so that each number is adjacent to the next. In Beehive Hidato the grid is a honeycomb of hexagonal cells, giving each cell up to six neighbours. Every puzzle has **exactly one solution** and can be solved by pure logic — no guesswork needed.

---

## Features

- **Five difficulty levels** — 🟢 Gentle Flow · 🔵 Thoughtful · 🔴 Strategic · 🟣 Architect · 🐝 Queen's Challenge
- **Randomised hive variants** — Perfect hive, Blocked cells, Damaged hive, Ring hive, Spiral hive
- **Number selector** — tap left/right arrows (or type on keyboard) to cycle through unplaced numbers; a direction indicator shows whether the next eligible number is higher or lower
- **Immediate adjacency feedback** — invalid placements flash red three times; the value is kept so you can correct it later
- **Check / Reset / Solution / Next Puzzle** controls
- **Timer** with pause and hide-display modes
- **Completion modal** with confetti, check-click count, mistake count, and elapsed time
- **Light / dark mode** toggle (defaults to light; preference is saved in `localStorage`)
- **How to Play** and **Contact** pages
- Responsive layout for mobile, tablet, and desktop

---

## Getting Started

### Prerequisites

- Node.js 20 LTS (or newer active LTS)
- npm 10+

### Install & run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default: `http://localhost:5173/beehive_hidato/`).

### Build for production

```bash
npm run build
```

Output is written to `dist/`.

### Run tests

```bash
npm run test
```

### Lint

```bash
npm run lint
```

---

## Deployment

Merging a pull request to `main` triggers the GitHub Actions workflow (`deploy.yml`) which builds the site and publishes it to **GitHub Pages** automatically. CI (`ci.yml`) runs lint + build + test on every PR to `main`.

---

## Project Structure

```
src/
  app/          # App shell, router, theme provider
  components/   # Shared UI components (hex cell, modal, footer, …)
  features/     # Puzzle engine — generator, validator, solver
  pages/        # Route-level page components
  styles/       # Global CSS / CSS variables
  types/        # TypeScript type definitions
```

---

## License

MIT © Greg Christian
