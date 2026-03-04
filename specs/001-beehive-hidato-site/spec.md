# Feature Specification: Beehive Hidato Playing Website

**Feature Branch**: `001-beehive-hidato-site`  
**Created**: 2026-03-04  
**Status**: Draft  
**Input**: User description: "Build a modern Beehive Hidato website with five difficulty levels, random hive variants, gameplay controls, timer behavior, informational pages, contact form, and shared footer."

## Clarifications

### Session 2026-03-04

- Q: How should Contact form submission be delivered on static hosting? → A: Use a third-party static form endpoint for direct submission.
- Q: What should happen after an invalid adjacency placement flash? → A: Keep the invalid number in the cell until user changes/checks/resets.
- Q: How should hive shape variants be randomized? → A: Use uniform random selection across all variants.
- Q: During Pause, which grid numbers should be hidden? → A: Hide all numbers (anchors and user entries) until resume.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Play a complete puzzle by difficulty (Priority: P1)

As a player, I can choose a difficulty from Home and solve a Beehive Hidato puzzle with clear controls, validation, and completion feedback.

**Why this priority**: Core gameplay is the product's primary value.

**Independent Test**: Select any one difficulty, complete a puzzle using the on-page controls, and confirm completion feedback appears with performance stats.

**Acceptance Scenarios**:

1. **Given** I am on Home, **When** I select one of the five difficulty options, **Then** I am routed in the same tab to that difficulty page with a newly generated puzzle.
2. **Given** a generated puzzle is shown, **When** I tap a blank cell, **Then** the currently selected playable number is entered, and tapping the same cell again removes that number.
3. **Given** the playable number selector is visible, **When** I press left or right selector controls, **Then** it moves only through remaining playable numbers that are still unplaced.
4. **Given** I press Check, **When** all placed numbers are correct, **Then** I receive a success message confirming all numbers are placed correctly.
5. **Given** I complete the full puzzle, **When** completion is detected, **Then** a celebratory modal appears with confetti and summary metrics (check clicks, mistakes, total time).

---

### User Story 2 - Use puzzle assistance and session controls (Priority: P2)

As a player, I can validate progress, reset, reveal solution, get a new puzzle at the same level, and control timer visibility/pause behavior.

**Why this priority**: These controls are critical for replayability and player confidence.

**Independent Test**: Start one puzzle and verify Check, Reset, Solution, Next Puzzle, Timer Off, and Pause each behave as specified without leaving the page.

**Acceptance Scenarios**:

1. **Given** I made moves, **When** I press Reset, **Then** the puzzle returns to its initial generated state with only pre-populated cells shown.
2. **Given** I am in a difficulty page, **When** I press Next Puzzle, **Then** a different puzzle is generated at the same difficulty with random hive variant selection.
3. **Given** timer display is enabled, **When** I turn timer off, **Then** elapsed time continues but is hidden until timer display is re-enabled.
4. **Given** a puzzle is in progress, **When** I press Pause, **Then** timer progression stops and user-visible numbers are temporarily hidden until resume restores the same game state.
5. **Given** I press Solution, **When** the action completes, **Then** the grid displays the full correct number chain.

---

### User Story 3 - Navigate and learn site content (Priority: P3)

As a visitor, I can move between Home, gameplay pages, How to Play, and Contact pages in the same tab and understand both puzzle rules and site controls.

**Why this priority**: New players need guidance and clear navigation to engage successfully.

**Independent Test**: Visit all required pages, confirm top-link navigation and instructional content, and verify all routing stays in the same browser tab.

**Acceptance Scenarios**:

1. **Given** I am on a difficulty page, **When** I use top links, **Then** Home, How to Play, and Contact pages open in the same tab.
2. **Given** I am on How to Play, **When** the page loads, **Then** it includes puzzle tutorial content, the required Tips list, interface usage instructions, and top links to Home and Contact.
3. **Given** I am on Contact, **When** the page loads, **Then** it shows Name, Email Address, Subject, and Message fields plus top links to Home and How to Play.

---

### User Story 4 - Use visual preferences and polished presentation (Priority: P4)

As a player, I can use light/dark mode and enjoy a modern look while preserving readability and accessibility.

**Why this priority**: Visual quality and comfort increase retention but are secondary to core gameplay.

**Independent Test**: Toggle between light and dark mode (default light), verify contrast/readability, and confirm page footer consistency across all pages.

**Acceptance Scenarios**:

1. **Given** I open the site for the first time, **When** Home loads, **Then** light mode is active by default.
2. **Given** I toggle theme mode, **When** the toggle changes, **Then** all pages reflect the selected mode consistently.
3. **Given** any page is displayed, **When** I reach the footer, **Then** it shows dynamic copyright year, MIT License text, repository link, issue link, and 80px whitespace below the footer.

### Edge Cases

- If puzzle generation cannot satisfy unique-solution and anchor-percentage constraints on first attempt, the system retries generation until a valid puzzle is produced.
- If a player enters a number already placed elsewhere through keyboard input, that entry is shown as invalid (red) and does not silently overwrite valid state.
- If the selected playable number has no legal placement remaining due to user mistakes, Check must still identify incorrect placements and not deadlock controls.
- If Pause is activated during active hint/error animation, pause state takes precedence and gameplay indicators resume safely after unpause.
- If timer display is off during puzzle completion, completion modal still reports total elapsed time.
- If a user presses Next Puzzle immediately after completion modal appears, new puzzle state replaces prior game without carrying over board placements.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST provide these pages: Home, Gentle Flow, Thoughtful, Strategic, Architect, Queen’s Challenge, How to Play, Contact.
- **FR-002**: System MUST route all page navigation in the same browser tab.
- **FR-003**: Home page MUST provide selectable entries for the five named difficulty levels with emojis: 🟢 Gentle Flow, 🔵 Thoughtful, 🔴 Strategic, 🟣 Architect, 🐝 Queen’s Challenge.
- **FR-004**: Selecting a difficulty on Home MUST open the corresponding difficulty page and generate a new puzzle for that level.
- **FR-005**: Each difficulty page MUST provide top links to Home, How to Play, and Contact.
- **FR-006**: How to Play page MUST provide top links to Home and Contact.
- **FR-007**: Contact page MUST provide top links to Home and How to Play.
- **FR-008**: Every generated puzzle MUST have exactly one valid complete solution chain.
- **FR-009**: System MUST support randomized hive shape variants at each difficulty: Perfect hive, Hive with blocked cells, Damaged hive, Ring-shaped hive, Spiral hive.
- **FR-010**: For blocked-cell variant, blocked-cell patterns MUST include at least one of: eyes, smiley face, smile, or single center block.
- **FR-011**: Perfect hive side length MUST be level-based: Gentle Flow=3, Thoughtful=4, Strategic=5, Architect=6, Queen’s Challenge=6.
- **FR-012**: Difficulty progression MUST be measurable by level profile values where complexity rank strictly increases from Gentle Flow (1) to Queen’s Challenge (5), and puzzle generation MUST enforce the selected level’s rank constraints.
- **FR-013**: For each puzzle, 32%–48% of grid cells MUST be pre-populated as anchor numbers, including both start and end values.
- **FR-014**: Anchor cell styling MUST use honey/yellow background with black numbers.
- **FR-015**: Start/end cells MUST use a light greenish-blue background with clearly visible number text.
- **FR-016**: Non-prepopulated playable cells MUST render as white with black numbers once filled.
- **FR-017**: Tapping a blank playable cell MUST place the currently selected playable number.
- **FR-018**: Tapping a user-filled cell again MUST clear that cell.
- **FR-019**: Interface MUST show one current playable number selector below the grid in a prominent format.
- **FR-020**: Left/right controls around the selector MUST move only among still-unplaced playable numbers.
- **FR-021**: Selector advancement MUST define eligibility as "unplaced playable numbers only" and MUST skip numbers already present in the grid.
- **FR-022**: Interface MUST show directional indicator state for whether the next selector step is upward or downward in number value.
- **FR-023**: Keyboard number entry MUST be supported for selecting/placing numbers.
- **FR-024**: If keyboard-entered number has already been played, that number MUST display in red as invalid feedback.
- **FR-025**: A Check action MUST evaluate current placements and mark incorrect numbers red when errors exist.
- **FR-026**: If Check finds all placements correct for a fully solved grid, system MUST show a modal message: "All numbers have been placed correctly".
- **FR-027**: A Reset action MUST restore the current puzzle to initial generated state with no user-entered numbers.
- **FR-028**: If a newly placed number is not adjacent to required chain neighbors, that number and relevant neighboring target number(s) MUST flash red exactly three times immediately.
- **FR-044**: After an invalid adjacency placement and flash event, the entered number MUST remain in the cell until the user modifies it, runs Check, resets, or reveals solution.
- **FR-029**: A Solution action MUST fill the grid with the complete correct chain for the current puzzle.
- **FR-030**: A Next Puzzle action MUST generate a new puzzle at the same selected difficulty using uniform random variant selection across the full variant set.
- **FR-031**: A timer MUST start when a user enters a difficulty puzzle page.
- **FR-032**: Timer display MUST support off mode where elapsed time continues but is hidden.
- **FR-033**: Timer MUST support pause mode where time progression stops and puzzle numbers are temporarily hidden until resumed.
- **FR-046**: In pause mode, all grid numbers (including anchor/start/end and user-entered values) MUST be hidden until the game is resumed.
- **FR-034**: Difficulty pages MUST include a "Choose Your Challenge" control that returns to Home.
- **FR-035**: Upon successful puzzle completion, system MUST show modal with confetti and metrics: number of Check clicks, number of mistakes, total elapsed time.
- **FR-036**: How to Play page MUST include these exact tips: each puzzle has one solution; pure logic solves puzzles without guesswork; starting elsewhere can be better than starting at first number; working backwards can reveal clues.
- **FR-037**: How to Play page MUST include instructions for using this site’s puzzle controls and interface.
- **FR-038**: Contact page MUST include form fields: Name, Email Address, Subject, Message, with validation for required fields before submission attempt.
- **FR-043**: Contact form submission MUST post to a third-party static form endpoint compatible with GitHub Pages hosting.
- **FR-047**: Contact submission UX MUST provide explicit submitting, success, and failure feedback states, including a retry path when submission fails.
- **FR-039**: Every page MUST include a footer with: dynamic copyright year text (© [current year] Greg Christian), MIT License, repository link, and issue link.
- **FR-040**: Footer MUST include 80px of whitespace/padding below it on every page.
- **FR-041**: Site MUST provide light and dark mode toggle with first-visit default set to light mode.
- **FR-042**: Theme choice MUST persist for the visitor across page navigation within the site.

### Constitution Alignment *(mandatory)*

- **CA-001**: Feature MUST run as static client-side web functionality (no backend runtime
  or database dependency).
- **CA-002**: Feature MUST align with the project stack baseline defined by the constitution.
- **CA-003**: Feature MUST define responsive behavior for mobile, tablet, and desktop.
- **CA-004**: Feature MUST include accessibility expectations for keyboard and semantic UI.
- **CA-005**: Feature release path MUST remain GitHub Actions deployment from `main` to
  GitHub Pages only.

### Key Entities *(include if feature involves data)*

- **Puzzle**: A generated Hidato challenge instance with level, hive variant, unique solution chain, anchor distribution, and initial state snapshot.
- **Grid Cell**: A playable or blocked hex position with coordinates, state (blocked/anchor/start/end/user-filled/empty), display style category, and current value.
- **Game Session**: In-progress user interaction state for one puzzle, including placed values, current selector value, direction indicator, mistakes, check count, timer state, and completion status.
- **Difficulty Profile**: Ruleset for each difficulty level including minimum complexity target, perfect-hive side length, and generation constraints.
- **Theme Preference**: Current visual mode selection (light or dark) for presentation behavior.
- **Contact Submission**: User-entered contact fields (name, email, subject, message) and validation/submission status.

### Assumptions

- The selected third-party static form endpoint is available and configured with any required anti-spam options.
- Random puzzle generation may use repeated attempts internally to satisfy unique-solution and anchor constraints.
- Mistake count increments when a placement is determined incorrect by immediate adjacency validation or by Check validation.
- Accessibility conformance target is WCAG 2.1 AA-aligned behavior for changed and core user flows.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 100% of generated published puzzles provide exactly one valid full solution chain.
- **SC-002**: 100% of difficulty selections route to the correct page in the same tab and present a playable puzzle within 3 seconds under normal browser conditions.
- **SC-003**: At least 95% of tested sessions can complete the full core flow (place, check, reset, pause/resume, next puzzle, completion modal) without functional errors.
- **SC-004**: 100% of pages include required footer elements and dynamic year behavior at calendar rollover.
- **SC-005**: 100% of tested keyboard-only gameplay flows can navigate controls and complete check/reset/solution actions without pointer input.
- **SC-006**: At least 90% of first-time test users report that puzzle instructions and controls are clear enough to start a game without external guidance.
