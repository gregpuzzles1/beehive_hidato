# Site Contract: Beehive Hidato Static Web App

## 1) Route Contract

| Route | Purpose | Required UI Elements |
|---|---|---|
| `/` | Home | Difficulty selections (5), theme toggle, footer |
| `/gentle-flow` | Difficulty gameplay | Top links (Home/How to Play/Contact), timer controls, puzzle grid, controls (Check/Reset/Solution/Next Puzzle/Choose Your Challenge), footer |
| `/thoughtful` | Difficulty gameplay | Same as gameplay contract |
| `/strategic` | Difficulty gameplay | Same as gameplay contract |
| `/architect` | Difficulty gameplay | Same as gameplay contract |
| `/queens-challenge` | Difficulty gameplay | Same as gameplay contract |
| `/how-to-play` | Instructions | Tutorial, required Tips content, interface guidance, top links (Home/Contact), footer |
| `/contact` | Contact form | Name/Email/Subject/Message fields, top links (Home/How to Play), footer |

Rules:
- Navigation must remain same-tab.
- Footer appears on every route and includes dynamic year, MIT License text, repository link, issue link, and 80px bottom spacing.

## 2) Gameplay Interaction Contract

### Cell placement
- `tap empty cell` -> place current playable number.
- `tap user-filled cell` -> remove its value.
- Keyboard entry supported.

### Invalid adjacency
- On invalid adjacency placement:
  - entered number + related neighbor target numbers flash red exactly 3 times,
  - placed value remains in cell until user modifies/checks/resets/solution.

### Selector behavior
- Selector shows one current playable number.
- Left/right selectors move through remaining playable values only.
- Direction indicator reflects up/down traversal mode.

### Check behavior
- If incorrect placements exist -> incorrect numbers shown red.
- If full solution is correct -> modal text: `All numbers have been placed correctly`.

### Puzzle controls
- `Reset` -> restore generated initial puzzle state.
- `Solution` -> fill full solution chain.
- `Next Puzzle` -> generate new puzzle at current difficulty using uniform random variant selection.
- `Choose Your Challenge` -> navigate back to Home.

## 3) Timer Contract
- Timer starts on difficulty page entry.
- Timer-off hides timer display but elapsed time continues.
- Pause:
  - stops elapsed-time progression,
  - hides all grid numbers (anchors + user-entered) until resume,
  - resumes from prior game state.

## 4) Puzzle Generation Contract
- Generated puzzle must have exactly one valid solution chain.
- Anchor ratio must be 32%–48% inclusive, including start and end values.
- Supported variants: perfect, blocked, damaged, ring, spiral.
- Blocked variant includes supported pattern shapes (eyes, smiley, smile, or center block).
- Perfect hive side length by difficulty:
  - Gentle Flow: 3
  - Thoughtful: 4
  - Strategic: 5
  - Architect: 6
  - Queen’s Challenge: 6

## 5) Styling Contract
- Theme modes: light (default), dark.
- Hidato CSS color plan is used as baseline palette guidance.
- Accessibility-oriented contrast adjustments are allowed to meet WCAG 2.1 AA-aligned behavior.
- Cell style roles:
  - anchors: honey/yellow with black text,
  - start/end: light greenish-blue background with clear text,
  - playable cells: white with black text when filled.

## 6) Contact Contract
- Fields required: Name, Email Address, Subject, Message.
- Validation required before submit attempt.
- Submission target: third-party static form endpoint compatible with GitHub Pages.
- UI must provide submit progress and success/failure feedback states.
