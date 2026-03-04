# Quickstart: Beehive Hidato Playing Website

## Prerequisites
- Node.js 20 LTS (or current active LTS)
- npm 10+
- Git

## 1) Install dependencies
```bash
npm install
```

## 2) Run locally
```bash
npm run dev
```
- Open the local URL printed by Vite (default: `http://localhost:5173/beehive_hidato/`).
- Verify Home page loads in light mode by default.
- Verify five difficulty cards are displayed with correct labels and emojis.

## 3) Build static output
```bash
npm run build
```
- Confirm output is generated in `dist/`.
- Confirm `dist/index.html` exists and references bundled CSS/JS assets.

## 4) Run tests
```bash
npm run test
```
- Run unit/integration tests for generator, controls, and page navigation behavior.

## 5) Functional Verification: US1 Core Gameplay (T056)
1. From Home, click a difficulty card (e.g., "Gentle Flow").
2. Verify puzzle grid renders with hex cells, anchors (honey-colored), and start/end (teal-colored).
3. Use the number selector (left/right arrows) to choose a number.
4. Tap an empty cell to place the number; tap a filled user cell to remove it.
5. Place an invalid adjacency value — verify involved cells flash red 3 times, value is retained.
6. Click "Check" — verify incorrect placements are highlighted red.
7. Fill all cells correctly — verify success modal appears with text "All numbers have been placed correctly".
8. Verify completion modal shows check count, mistake count, and elapsed time.

## 6) Functional Verification: US2 Controls (T057)
1. On a difficulty page, click "Reset" — verify all user entries are cleared, anchors remain.
2. Click "Solution" — verify all cells fill with the correct solution chain.
3. Click "Next Puzzle" — verify a new puzzle is generated at the same difficulty.
4. Click "Timer Off" — verify timer display is hidden, but game continues.
5. Click "Pause" — verify all numbers (anchors + user-entered) are hidden and "Game Paused" overlay shows.
6. Click "Resume" — verify numbers reappear and game continues from prior state.
7. Click "Choose Your Challenge" — verify navigation back to Home page in same tab.

## 7) Functional Verification: US3 Navigation & Content (T058)
1. Navigate Home → difficulty page → Home → How to Play → Contact → Home (all same-tab).
2. On How to Play page, verify:
   - "What is Beehive Hidato?" tutorial section is present.
   - Tips section contains exactly 4 tips:
     - "Each puzzle has one solution."
     - "Pure logic solves puzzles without guesswork."
     - "Starting elsewhere can be better than starting at first number."
     - "Working backwards can reveal clues."
   - Interface guidance section covers all controls.
3. On Contact page, verify:
   - Fields present: Name, Email Address, Subject, Message (all required).
   - Submit with empty fields — verify inline validation errors.
   - Submit with invalid email — verify email validation error.
   - Submit with valid data — verify "Sending..." state, then success/failure response.

## 8) Functional Verification: US4 Theme & Footer (T059)
1. Click moon/sun icon (top-right) to toggle dark mode.
2. Verify all pages render correctly in dark mode (background, text, borders).
3. Navigate between pages — verify theme preference persists (uses localStorage).
4. Refresh the page — verify theme preference is restored.
5. On every page, verify footer contains:
   - Dynamic year (e.g., "© 2026 Greg Christian")
   - "MIT License" text
   - Repository link
   - Issue link
   - 80px bottom spacing

## 9) Accessibility and responsive verification
- Keyboard-only pass on Home, one difficulty page, How to Play, and Contact.
- Confirm focus indicators are visible on all interactive elements.
- Confirm semantic labels for controls, navigation, and form fields.
- Verify layout at representative widths:
  - Mobile: ~375px
  - Tablet: ~768px
  - Desktop: >=1280px

## 10) Deployment workflow
- Merge approved PR to `main`.
- GitHub Actions workflow (`deploy.yml`) builds and deploys static site to GitHub Pages.
- CI workflow (`ci.yml`) runs lint + build + test on PRs to `main`.
- No production deployment occurs from non-`main` branches.
