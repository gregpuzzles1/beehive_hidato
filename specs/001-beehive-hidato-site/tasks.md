# Tasks: Beehive Hidato Playing Website

**Input**: Design documents from `/specs/001-beehive-hidato-site/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/site-contract.md

**Tests**: Test-first/TDD tasks are not mandated for this feature, but explicit functional verification tasks are included to satisfy constitution quality gates.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- All descriptions include concrete file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize static React + TypeScript project and deployment baseline.

- [x] T001 Initialize project metadata/scripts for static React + TypeScript app in package.json
- [x] T002 Configure TypeScript and Vite for static SPA output in tsconfig.json and vite.config.ts
- [x] T003 [P] Create app bootstrap and root mount in src/main.tsx and src/app/App.tsx
- [x] T004 [P] Add base route shell and not-found handling in src/app/router.tsx
- [x] T005 [P] Configure GitHub Pages deployment workflow from `main` in .github/workflows/deploy.yml
- [x] T006 [P] Configure CI checks for pull requests to `main` in .github/workflows/ci.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core app foundations required before any user story implementation.

**⚠️ CRITICAL**: No user story work starts until this phase is complete.

- [x] T007 Implement shared app layout scaffold in src/app/layout/AppLayout.tsx
- [x] T008 [P] Implement top navigation component contract in src/components/navigation/TopNav.tsx
- [x] T009 [P] Implement global footer with dynamic year/repo/issue links in src/components/footer/Footer.tsx
- [x] T010 Wire all required routes (Home, 5 levels, How to Play, Contact) in src/app/router.tsx
- [x] T011 [P] Define core puzzle types/entities in src/types/puzzle.ts
- [x] T012 [P] Implement hex coordinate utilities in src/features/puzzle/generator/hexGeometry.ts
- [x] T013 Implement game-session state container and selectors in src/features/puzzle/state/useGameSession.ts
- [x] T014 [P] Define theme tokens from Hidato CSS guidance in src/styles/tokens.css
- [x] T015 [P] Define responsive and theme layer styles in src/styles/themes.css
- [x] T016 Define static contact endpoint configuration in src/features/contact/contactConfig.ts

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Play a complete puzzle by difficulty (Priority: P1) 🎯 MVP

**Goal**: Player can enter a difficulty, receive a valid generated puzzle, play numbers, validate chain correctness, and get success feedback.

**Independent Test**: Open one difficulty from Home, solve puzzle with selector/cell input, use Check, and confirm success modal behavior.

### Implementation for User Story 1

- [x] T017 [P] [US1] Implement difficulty profile definitions in src/features/puzzle/generator/difficultyProfiles.ts
- [x] T018 [P] [US1] Implement perfect hive variant generator in src/features/puzzle/generator/variants/perfect.ts
- [x] T019 [P] [US1] Implement blocked hive variant generator in src/features/puzzle/generator/variants/blocked.ts
- [x] T020 [P] [US1] Implement damaged hive variant generator in src/features/puzzle/generator/variants/damaged.ts
- [x] T021 [P] [US1] Implement ring hive variant generator in src/features/puzzle/generator/variants/ring.ts
- [x] T022 [P] [US1] Implement spiral hive variant generator in src/features/puzzle/generator/variants/spiral.ts
- [x] T023 [P] [US1] Implement unique-solution validator and solver loop in src/features/puzzle/validation/uniqueSolutionValidator.ts
- [x] T024 [US1] Implement puzzle generation orchestrator (uniform variant randomization, anchor ratio, start/end anchors) in src/features/puzzle/generator/generatePuzzle.ts
- [x] T025 [P] [US1] Implement hex cell component with role-based visuals in src/components/grid/HexCell.tsx
- [x] T026 [P] [US1] Implement Beehive grid renderer for variant layouts in src/components/grid/BeehiveGrid.tsx
- [x] T027 [US1] Implement number selector with directional controls in src/features/puzzle/controls/NumberSelector.tsx
- [x] T028 [US1] Implement tap and keyboard placement behavior with duplicate-number feedback in src/features/puzzle/controls/useCellInput.ts
- [x] T029 [US1] Implement invalid adjacency flash feedback (3 flashes, value retained) in src/features/puzzle/validation/useAdjacencyFeedback.ts
- [x] T030 [US1] Implement Check action and incorrect-placement highlighting in src/features/puzzle/controls/useCheckPuzzle.ts
- [x] T031 [US1] Implement success-check modal with exact copy in src/components/modal/CheckResultModal.tsx
- [x] T032 [US1] Build gameplay page integration for puzzle generation and interaction in src/pages/DifficultyPage.tsx
- [x] T033 [US1] Build Home page with five difficulty entries and same-tab navigation in src/pages/HomePage.tsx

**Checkpoint**: User Story 1 is independently playable and complete.

---

## Phase 4: User Story 2 - Use puzzle assistance and session controls (Priority: P2)

**Goal**: Player can reset/reveal/advance puzzle, control timer visibility, and pause/resume with full-number masking.

**Independent Test**: On one difficulty page, verify Reset, Solution, Next Puzzle, Timer Off, Pause/Resume, and completion metrics behavior.

### Implementation for User Story 2

- [x] T034 [P] [US2] Implement reset-to-initial-state action in src/features/puzzle/controls/useResetPuzzle.ts
- [x] T035 [P] [US2] Implement reveal-solution action in src/features/puzzle/controls/useRevealSolution.ts
- [x] T036 [US2] Implement next-puzzle action at same difficulty in src/features/puzzle/controls/useNextPuzzle.ts
- [x] T037 [P] [US2] Implement timer engine (start, elapsed tracking, hidden-display mode) in src/features/puzzle/timer/usePuzzleTimer.ts
- [x] T038 [US2] Implement pause/resume number masking (hide all numbers while paused) in src/features/puzzle/timer/usePauseMask.ts
- [x] T039 [US2] Implement control bar UI (Check/Reset/Solution/Next Puzzle/Pause/Timer Off/Choose Your Challenge) in src/features/puzzle/controls/PuzzleControlBar.tsx
- [x] T040 [US2] Implement completion modal with confetti and metrics (check count, mistakes, total time) in src/components/modal/CompletionModal.tsx
- [x] T041 [US2] Integrate User Story 2 controls into gameplay route in src/pages/DifficultyPage.tsx

**Checkpoint**: User Story 2 controls are independently functional.

---

## Phase 5: User Story 3 - Navigate and learn site content (Priority: P3)

**Goal**: Users can navigate all pages in the same tab, learn gameplay via How to Play, and submit Contact form details.

**Independent Test**: Navigate Home ↔ gameplay ↔ How to Play ↔ Contact, verify required content and successful/failed contact submission states.

### Implementation for User Story 3

- [x] T042 [P] [US3] Implement How to Play page with required tutorial and exact tips content in src/pages/HowToPlayPage.tsx
- [x] T043 [P] [US3] Implement Contact page fields and validation UX in src/pages/ContactPage.tsx
- [x] T044 [US3] Implement third-party static contact submission service with submitting/success/failure state handling in src/features/contact/contactService.ts
- [x] T045 [US3] Wire page-specific top-link sets for gameplay/How to Play/Contact routes in src/components/navigation/TopNav.tsx
- [x] T046 [US3] Finalize same-tab routing behavior and route links in src/app/router.tsx

**Checkpoint**: User Story 3 is independently functional and navigable.

---

## Phase 6: User Story 4 - Use visual preferences and polished presentation (Priority: P4)

**Goal**: Users can switch light/dark mode, keep preference across navigation, and experience consistent modern styling and footer behavior.

**Independent Test**: Toggle theme and navigate through all pages to confirm persistence, readability, and required footer details.

### Implementation for User Story 4

- [x] T047 [P] [US4] Implement theme provider with default light mode and persisted preference in src/features/theme/ThemeProvider.tsx
- [x] T048 [US4] Implement global theme toggle control in src/features/theme/ThemeToggle.tsx
- [x] T049 [US4] Apply Hidato CSS palette tokens and accessible theme mappings in src/styles/tokens.css and src/styles/themes.css
- [x] T050 [US4] Apply required anchor/start-end/playable cell visual rules in src/components/grid/HexCell.tsx
- [x] T051 [US4] Ensure required footer content and 80px bottom spacing across all routes in src/components/footer/Footer.tsx

**Checkpoint**: User Story 4 is independently functional and visually consistent.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality work that spans multiple stories.

- [x] T056 [US1] Run functional verification for core gameplay flow and record results in specs/001-beehive-hidato-site/quickstart.md
- [x] T057 [US2] Run functional verification for reset/solution/next/timer/pause controls and record results in specs/001-beehive-hidato-site/quickstart.md
- [x] T058 [US3] Run functional verification for same-tab navigation and contact submission lifecycle states in specs/001-beehive-hidato-site/quickstart.md
- [x] T059 [US4] Run functional verification for theme toggle/persistence and footer requirements in specs/001-beehive-hidato-site/quickstart.md
- [x] T052 [P] Add accessibility labels, landmarks, and focus-state refinements in src/components/navigation/TopNav.tsx, src/features/puzzle/controls/PuzzleControlBar.tsx, src/pages/ContactPage.tsx
- [x] T053 [P] Add mobile/tablet responsive layout refinements for core pages in src/pages/HomePage.tsx, src/pages/DifficultyPage.tsx, src/pages/HowToPlayPage.tsx, src/pages/ContactPage.tsx
- [x] T054 [P] Validate GitHub Pages deployment and branch guard assumptions in .github/workflows/deploy.yml and .github/workflows/ci.yml
- [x] T055 Align quickstart verification steps with implemented behavior in specs/001-beehive-hidato-site/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Setup; blocks all user stories.
- **Phases 3-6 (User Stories)**: Depend on Foundational completion.
- **Phase 7 (Polish)**: Depends on completion of targeted user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no dependency on other stories.
- **US2 (P2)**: Starts after Phase 2; depends functionally on US1 gameplay surfaces.
- **US3 (P3)**: Starts after Phase 2; mostly independent from US1/US2 gameplay logic.
- **US4 (P4)**: Starts after Phase 2; can proceed in parallel with US2/US3 and then merge UI refinements.

### Recommended Completion Order

1. Setup → Foundational
2. US1 (MVP)
3. US2 and US3 (parallel where possible)
4. US4
5. Polish

---

## Parallel Execution Examples

### User Story 1

Run in parallel after T017:
- T018, T019, T020, T021, T022 (variant generators)
- T025, T026 (grid UI components)

### User Story 2

Run in parallel:
- T034 and T035
- T037 in parallel with T036

### User Story 3

Run in parallel:
- T042 and T043
- T044 can begin once T043 form model is present

### User Story 4

Run in parallel:
- T047 and T049
- T050 and T051 after shared theme tokens are defined

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate independent gameplay loop for one difficulty.
4. Demo/deploy MVP slice if desired.

### Incremental Delivery

1. Deliver US1 (core gameplay).
2. Add US2 (assistive controls and timer system).
3. Add US3 (instructional + contact pages).
4. Add US4 (theme and visual polish requirements).
5. Finish cross-cutting polish tasks.

### Parallel Team Strategy

After Phase 2:
- Developer A: US1/US2 gameplay stack
- Developer B: US3 content/contact flows
- Developer C: US4 theming/footer/accessibility refinements
