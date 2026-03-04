/** Difficulty level identifiers */
export type DifficultyId =
  | 'gentle-flow'
  | 'thoughtful'
  | 'strategic'
  | 'architect'
  | 'queens-challenge'

/** Hive shape variants */
export type HiveVariant = 'perfect' | 'blocked' | 'damaged' | 'ring' | 'spiral'

/** Cell states in the grid */
export type CellState =
  | 'blocked'
  | 'empty'
  | 'anchor'
  | 'start'
  | 'end'
  | 'user-filled'

/** Visual style roles for cells */
export type CellStyleRole =
  | 'anchor-honey'
  | 'start-end-accent'
  | 'playable-default'
  | 'blocked'

/** Axial hex coordinates */
export interface HexCoord {
  q: number
  r: number
}

/** A single cell in the grid */
export interface GridCell {
  id: string
  q: number
  r: number
  state: CellState
  solutionValue: number | null
  currentValue: number | null
  isEditable: boolean
  styleRole: CellStyleRole
}

/** Difficulty profile defining generation parameters */
export interface DifficultyProfile {
  id: DifficultyId
  label: string
  emoji: string
  slug: string
  perfectHiveSideLength: number
  complexityRank: number
  minAnchorRatio: number
  maxAnchorRatio: number
}

/** A generated puzzle instance */
export interface Puzzle {
  id: string
  difficultyId: DifficultyId
  variant: HiveVariant
  totalPlayableCount: number
  anchorCount: number
  anchorRatio: number
  startValue: number
  endValue: number
  solutionChain: Array<{ cellId: string; value: number }>
  cells: GridCell[]
}

/** Game session state */
export interface GameSession {
  sessionId: string
  puzzleId: string
  status: 'active' | 'paused' | 'completed'
  currentPlayableValue: number
  selectorDirection: 'up' | 'down'
  remainingPlayableValues: number[]
  mistakeCount: number
  checkCount: number
  timerElapsedMs: number
  timerVisible: boolean
  timerPaused: boolean
  pausedNumbersHidden: boolean
}

/** Theme preference */
export interface ThemePreference {
  mode: 'light' | 'dark'
  source: 'default' | 'user'
}

/** Contact form submission */
export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
  submissionState: 'idle' | 'submitting' | 'success' | 'failure'
}
