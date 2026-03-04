import { useState, useCallback, useRef, useEffect } from 'react'
import type { GridCell, Puzzle, GameSession } from '../../../types/puzzle'

interface GameSessionActions {
  /** Place a number in a cell */
  placeNumber: (cellId: string, value: number) => void
  /** Remove a number from a cell */
  removeNumber: (cellId: string) => void
  /** Reset puzzle to initial state */
  resetPuzzle: () => void
  /** Reveal the full solution */
  revealSolution: () => void
  /** Check current placements, returns list of incorrect cell IDs */
  checkPlacements: () => string[]
  /** Update timer elapsed time */
  updateTimer: (elapsedMs: number) => void
  /** Toggle timer visibility */
  toggleTimerVisible: () => void
  /** Toggle pause state */
  togglePause: () => void
  /** Set selector value */
  setSelectorValue: (value: number) => void
  /** Toggle selector direction */
  toggleSelectorDirection: () => void
  /** Mark as completed */
  markCompleted: () => void
  /** Get next unplaced playable value in current direction */
  advanceSelector: (direction: 'up' | 'down') => void
}

interface UseGameSessionReturn {
  session: GameSession
  cells: GridCell[]
  actions: GameSessionActions
}

function createInitialSession(puzzle: Puzzle): GameSession {
  const sessionId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`

  const anchorValues = new Set(
    puzzle.cells
      .filter((c) => c.state === 'anchor' || c.state === 'start' || c.state === 'end')
      .map((c) => c.solutionValue!)
  )

  const allValues = Array.from(
    { length: puzzle.totalPlayableCount },
    (_, i) => i + 1
  )
  const remaining = allValues.filter((v) => !anchorValues.has(v))

  return {
    sessionId,
    puzzleId: puzzle.id,
    status: 'active',
    currentPlayableValue: remaining[0] ?? 1,
    selectorDirection: 'up',
    remainingPlayableValues: remaining,
    mistakeCount: 0,
    checkCount: 0,
    timerElapsedMs: 0,
    timerVisible: true,
    timerPaused: false,
    pausedNumbersHidden: false,
  }
}

export function useGameSession(puzzle: Puzzle | null): UseGameSessionReturn | null {
  const puzzleRef = useRef<Puzzle | null>(null)
  const [session, setSession] = useState<GameSession | null>(null)
  const [cells, setCells] = useState<GridCell[]>([])
  const initialCellsRef = useRef<GridCell[]>([])

  useEffect(() => {
    if (!puzzle || puzzle === puzzleRef.current) return
    puzzleRef.current = puzzle
    const newSession = createInitialSession(puzzle)
    setSession(newSession)
    const initialCells = puzzle.cells.map((c) => ({ ...c }))
    setCells(initialCells)
    initialCellsRef.current = puzzle.cells.map((c) => ({ ...c }))
  }, [puzzle])

  const getRemaining = useCallback(
    (currentCells: GridCell[], allCount: number): number[] => {
      const placed = new Set(
        currentCells
          .filter((c) => c.currentValue !== null)
          .map((c) => c.currentValue!)
      )
      return Array.from({ length: allCount }, (_, i) => i + 1).filter(
        (v) => !placed.has(v)
      )
    },
    []
  )

  const placeNumber = useCallback(
    (cellId: string, value: number) => {
      if (!puzzle) return
      setCells((prev) => {
        const updated = prev.map((c) =>
          c.id === cellId && c.isEditable
            ? { ...c, currentValue: value, state: 'user-filled' as const }
            : c
        )
        const remaining = getRemaining(updated, puzzle.totalPlayableCount)
        setSession((s) =>
          s
            ? {
                ...s,
                remainingPlayableValues: remaining,
                currentPlayableValue:
                  remaining.length > 0
                    ? findNextValue(remaining, value, s.selectorDirection)
                    : value,
              }
            : s
        )
        return updated
      })
    },
    [puzzle, getRemaining]
  )

  const removeNumber = useCallback(
    (cellId: string) => {
      if (!puzzle) return
      setCells((prev) => {
        const cell = prev.find((c) => c.id === cellId)
        if (!cell || !cell.isEditable || cell.currentValue === null) return prev

        const removedValue = cell.currentValue
        const updated = prev.map((c) =>
          c.id === cellId
            ? { ...c, currentValue: null, state: 'empty' as const }
            : c
        )
        const remaining = getRemaining(updated, puzzle.totalPlayableCount)
        setSession((s) =>
          s
            ? {
                ...s,
                remainingPlayableValues: remaining,
                currentPlayableValue: removedValue,
              }
            : s
        )
        return updated
      })
    },
    [puzzle, getRemaining]
  )

  const resetPuzzle = useCallback(() => {
    if (!puzzle) return
    const fresh = initialCellsRef.current.map((c) => ({ ...c }))
    setCells(fresh)
    setSession((s) => (s ? { ...createInitialSession(puzzle), timerElapsedMs: 0 } : s))
  }, [puzzle])

  const revealSolution = useCallback(() => {
    if (!puzzle) return
    setCells((prev) =>
      prev.map((c) => ({
        ...c,
        currentValue: c.solutionValue,
        state: c.state === 'blocked' ? 'blocked' : c.state === 'empty' || c.state === 'user-filled' ? 'user-filled' : c.state,
      }))
    )
    setSession((s) =>
      s
        ? { ...s, remainingPlayableValues: [], status: 'completed' }
        : s
    )
  }, [puzzle])

  const checkPlacements = useCallback((): string[] => {
    const incorrect: string[] = []
    const currentCells = cells
    for (const cell of currentCells) {
      if (
        cell.state === 'user-filled' &&
        cell.currentValue !== null &&
        cell.currentValue !== cell.solutionValue
      ) {
        incorrect.push(cell.id)
      }
    }
    setSession((s) =>
      s
        ? {
            ...s,
            checkCount: s.checkCount + 1,
            mistakeCount: s.mistakeCount + incorrect.length,
          }
        : s
    )
    return incorrect
  }, [cells])

  const updateTimer = useCallback((elapsedMs: number) => {
    setSession((s) => (s ? { ...s, timerElapsedMs: elapsedMs } : s))
  }, [])

  const toggleTimerVisible = useCallback(() => {
    setSession((s) => (s ? { ...s, timerVisible: !s.timerVisible } : s))
  }, [])

  const togglePause = useCallback(() => {
    setSession((s) => {
      if (!s) return s
      if (s.timerPaused) {
        return {
          ...s,
          timerPaused: false,
          pausedNumbersHidden: false,
          status: 'active',
        }
      }
      return {
        ...s,
        timerPaused: true,
        pausedNumbersHidden: true,
        status: 'paused',
      }
    })
  }, [])

  const setSelectorValue = useCallback((value: number) => {
    setSession((s) => (s ? { ...s, currentPlayableValue: value } : s))
  }, [])

  const toggleSelectorDirection = useCallback(() => {
    setSession((s) =>
      s
        ? {
            ...s,
            selectorDirection: s.selectorDirection === 'up' ? 'down' : 'up',
          }
        : s
    )
  }, [])

  const markCompleted = useCallback(() => {
    setSession((s) => (s ? { ...s, status: 'completed' } : s))
  }, [])

  const advanceSelector = useCallback(
    (direction: 'up' | 'down') => {
      setSession((s) => {
        if (!s || s.remainingPlayableValues.length === 0) return s
        const sorted = [...s.remainingPlayableValues].sort((a, b) => a - b)
        const currentIdx = sorted.indexOf(s.currentPlayableValue)

        let nextIdx: number
        if (direction === 'up') {
          nextIdx = currentIdx < sorted.length - 1 ? currentIdx + 1 : 0
        } else {
          nextIdx = currentIdx > 0 ? currentIdx - 1 : sorted.length - 1
        }
        return {
          ...s,
          currentPlayableValue: sorted[nextIdx],
          selectorDirection: direction,
        }
      })
    },
    []
  )

  if (!session || !puzzle) return null

  return {
    session,
    cells,
    actions: {
      placeNumber,
      removeNumber,
      resetPuzzle,
      revealSolution,
      checkPlacements,
      updateTimer,
      toggleTimerVisible,
      togglePause,
      setSelectorValue,
      toggleSelectorDirection,
      markCompleted,
      advanceSelector,
    },
  }
}

function findNextValue(
  remaining: number[],
  current: number,
  direction: 'up' | 'down'
): number {
  const sorted = [...remaining].sort((a, b) => a - b)
  if (sorted.length === 0) return current

  if (direction === 'up') {
    const next = sorted.find((v) => v > current)
    return next ?? sorted[0]
  }
  const reversed = [...sorted].reverse()
  const next = reversed.find((v) => v < current)
  return next ?? reversed[0]
}
