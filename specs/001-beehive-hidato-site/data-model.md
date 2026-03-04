# Data Model: Beehive Hidato Playing Website

## Entity: DifficultyProfile
- Description: Defines puzzle-generation and presentation parameters per named difficulty.
- Fields:
  - `id` (enum): `gentle-flow | thoughtful | strategic | architect | queens-challenge`
  - `label` (string): display name with emoji
  - `perfectHiveSideLength` (integer): `3 | 4 | 5 | 6`
  - `complexityRank` (integer): ascending level complexity
  - `minAnchorRatio` (number): `0.32`
  - `maxAnchorRatio` (number): `0.48`
- Validation rules:
  - Side length matches spec mapping for each difficulty.
  - Complexity rank must strictly increase by level order.

## Entity: Puzzle
- Description: One generated puzzle instance for a chosen difficulty.
- Fields:
  - `id` (string)
  - `difficultyId` (DifficultyProfile.id)
  - `variant` (enum): `perfect | blocked | damaged | ring | spiral`
  - `seed` (string/number)
  - `totalPlayableCount` (integer)
  - `anchorCount` (integer)
  - `anchorRatio` (number)
  - `startValue` (integer, usually 1)
  - `endValue` (integer, equals `totalPlayableCount`)
  - `solutionChain` (ordered list of CellRef/value pairs)
  - `cells` (GridCell[])
- Validation rules:
  - Exactly one valid full solution chain.
  - Anchor ratio is within [0.32, 0.48].
  - Start and end are included in anchors.
  - Variant selected via uniform random over all variants.

## Entity: GridCell
- Description: A hex position within the current puzzle board.
- Fields:
  - `id` (string)
  - `q` (integer): axial coordinate
  - `r` (integer): axial coordinate
  - `state` (enum): `blocked | empty | anchor | start | end | user-filled`
  - `solutionValue` (integer | null)
  - `currentValue` (integer | null)
  - `isEditable` (boolean)
  - `styleRole` (enum): `anchor-honey | start-end-accent | playable-default | blocked`
- Validation rules:
  - `blocked` cells have no value.
  - `anchor/start/end` are non-editable and pre-populated.
  - `user-filled` values must be unique among currently placed numbers.

## Entity: GameSession
- Description: Runtime state for one active puzzle playthrough.
- Fields:
  - `sessionId` (string)
  - `puzzleId` (Puzzle.id)
  - `status` (enum): `active | paused | completed`
  - `currentPlayableValue` (integer)
  - `selectorDirection` (enum): `up | down`
  - `remainingPlayableValues` (integer[])
  - `mistakeCount` (integer)
  - `checkCount` (integer)
  - `timerElapsedMs` (integer)
  - `timerVisible` (boolean)
  - `timerPaused` (boolean)
  - `pausedNumbersHidden` (boolean)
- Validation rules:
  - If `timerPaused=true`, `status` must be `paused`.
  - If `status=completed`, all playable values are placed and valid.
  - Invalid adjacency event triggers flash state but value remains until user action.

## Entity: ThemePreference
- Description: User’s selected visual mode.
- Fields:
  - `mode` (enum): `light | dark`
  - `source` (enum): `default | user`
- Validation rules:
  - Default mode is `light` for first visit.

## Entity: ContactSubmission
- Description: Contact form payload submitted to external static form provider.
- Fields:
  - `name` (string)
  - `email` (string)
  - `subject` (string)
  - `message` (string)
  - `submittedAt` (datetime, optional client timestamp)
  - `submissionState` (enum): `idle | submitting | success | failure`
- Validation rules:
  - All fields required.
  - Email must be valid format.

## Relationships
- `DifficultyProfile 1..* Puzzle`
- `Puzzle 1..* GridCell`
- `Puzzle 1..* GameSession` (one active at a time in UI)
- `GameSession 1..1 ThemePreference` (applies to presentation)
- `ContactSubmission` is independent of puzzle entities.

## State Transitions

### GameSession.status
- `active -> paused`: user selects Pause.
- `paused -> active`: user resumes.
- `active -> completed`: full valid chain is placed.
- `completed -> active`: user selects Next Puzzle (new puzzle/session).

### ContactSubmission.submissionState
- `idle -> submitting`: user submits valid form.
- `submitting -> success`: provider returns successful response.
- `submitting -> failure`: provider/network error.
