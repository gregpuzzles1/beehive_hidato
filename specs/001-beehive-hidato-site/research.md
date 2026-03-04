# Phase 0 Research: Beehive Hidato Playing Website

## Decision 1: Frontend build/runtime approach
- Decision: Use React + TypeScript with Vite for a static SPA build.
- Rationale: Matches constitution baseline, provides fast local iteration, and outputs static assets compatible with GitHub Pages.
- Alternatives considered:
  - Next.js static export: rejected due to additional framework complexity for current scope.
  - Vanilla TS: rejected because route/page state management complexity is higher for this feature set.

## Decision 2: Routing and page architecture
- Decision: Use client-side routing with React Router and route-based pages for Home, five difficulty pages, How to Play, and Contact.
- Rationale: Required same-tab navigation across multiple pages while preserving SPA behavior.
- Alternatives considered:
  - Hash-based single-screen state only: rejected because explicit page routes improve clarity and testability.
  - Multi-page static HTML: rejected due to duplicated logic and harder shared state handling.

## Decision 3: Puzzle generation strategy
- Decision: Generate puzzles client-side using a deterministic seeded generator + solver/validator loop to enforce unique-solution and anchor-percentage constraints.
- Rationale: Meets static-only requirement while preserving replayability and controlled randomness.
- Alternatives considered:
  - Pre-generated puzzle packs: rejected because random generation per difficulty is required.
  - Server-generated puzzles: rejected by constitution (no backend runtime).

## Decision 4: Hive variant randomization
- Decision: Uniform random variant selection across the full variant set per new puzzle at a difficulty.
- Rationale: Clarified requirement, easy to verify statistically, avoids implicit bias.
- Alternatives considered:
  - Weighted distribution by difficulty: rejected per clarification.
  - Rotation before repeat: rejected; not requested and adds session-state complexity.

## Decision 5: Input and validation behavior
- Decision: Tap-to-place/tap-to-remove cell interactions with keyboard support; invalid adjacency placement flashes red three times and remains placed until user action.
- Rationale: Directly matches clarified interaction behavior and supports user correction workflows.
- Alternatives considered:
  - Auto-reject invalid placement: rejected per clarification.
  - Auto-remove after flash: rejected per clarification.

## Decision 6: Timer and pause semantics
- Decision: Timer starts on difficulty page entry; timer-off hides display while elapsed time continues; pause freezes elapsed time and hides all grid numbers until resumed.
- Rationale: Aligns with user requirement and clarification; supports challenge mode and privacy when paused.
- Alternatives considered:
  - Keep anchors visible during pause: rejected per clarification.
  - Disable input only during pause: rejected as it conflicts with “numbers disappear” behavior.

## Decision 7: Contact submission integration
- Decision: Submit Contact form to a third-party static form endpoint compatible with GitHub Pages.
- Rationale: Provides real message delivery without backend infrastructure.
- Alternatives considered:
  - `mailto:` flow: rejected to avoid dependency on local mail client.
  - UI-only form with no submission: rejected due to contact intent requirement.

## Decision 8: Accessibility and responsive strategy
- Decision: Adopt WCAG 2.1 AA-aligned interaction patterns (keyboard navigation, focus visibility, semantic landmarks/labels) and mobile/tablet/desktop responsive breakpoints.
- Rationale: Constitution mandates accessibility and responsiveness as baseline quality gates.
- Alternatives considered:
  - Desktop-first only: rejected by requirements.
  - Visual-only accessibility checks: rejected; interaction semantics are required.

## Decision 9: Visual system and color guidance
- Decision: Use Hidato CSS palette as base design tokens and derive accessible light/dark theme pairs from it.
- Rationale: Satisfies user direction while preserving contrast requirements across anchors/start-end/interactive states.
- Alternatives considered:
  - Arbitrary new palette: rejected because a color guideline was provided.
  - Raw palette usage without contrast tuning: rejected due to accessibility requirements.

## Decision 10: Testing scope for planning
- Decision: Define layered tests: puzzle/unit logic tests, interaction/integration tests for controls, and E2E smoke tests for navigation/responsive/accessibility-critical flows.
- Rationale: Meets constitution quality gates with minimal overhead.
- Alternatives considered:
  - E2E-only strategy: rejected due to weak logic-level fault isolation.
  - Unit-only strategy: rejected because route and accessibility flows need integrated verification.
