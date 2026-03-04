import { useState, useEffect, useCallback, useMemo } from 'react'
import type { DifficultyId, Puzzle } from '../types/puzzle'
import { TopNav } from '../components/navigation/TopNav'
import { BeehiveGrid } from '../components/grid/BeehiveGrid'
import { NumberSelector } from '../features/puzzle/controls/NumberSelector'
import { PuzzleControlBar } from '../features/puzzle/controls/PuzzleControlBar'
import { CheckResultModal } from '../components/modal/CheckResultModal'
import { CompletionModal } from '../components/modal/CompletionModal'
import { useGameSession } from '../features/puzzle/state/useGameSession'
import { useCellInput } from '../features/puzzle/controls/useCellInput'
import { useAdjacencyFeedback } from '../features/puzzle/validation/useAdjacencyFeedback'
import { useCheckPuzzle } from '../features/puzzle/controls/useCheckPuzzle'
import { usePuzzleTimer } from '../features/puzzle/timer/usePuzzleTimer'
import { generatePuzzle } from '../features/puzzle/generator/generatePuzzle'
import '../components/navigation/TopNav.css'
import '../features/puzzle/controls/NumberSelector.css'
import './DifficultyPage.css'

interface DifficultyPageProps {
  slug: DifficultyId
}

const DIFFICULTY_LABELS: Record<DifficultyId, string> = {
  'gentle-flow': '🟢 Gentle Flow',
  'thoughtful': '🔵 Thoughtful',
  'strategic': '🔴 Strategic',
  'architect': '🟣 Architect',
  'queens-challenge': "🐝 Queen's Challenge",
}

export function DifficultyPage({ slug }: DifficultyPageProps) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [puzzleError, setPuzzleError] = useState<string | null>(null)
  const [duplicateFlash, setDuplicateFlash] = useState<number | null>(null)
  const [showCheckModal, setShowCheckModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  // Generate initial puzzle - deferred so "Generating..." renders first
  useEffect(() => {
    let cancelled = false
    setPuzzle(null)
    setPuzzleError(null)

    // Use requestAnimationFrame + setTimeout to yield to the browser
    // so the loading state paints before heavy computation starts
    const rafId = requestAnimationFrame(() => {
      setTimeout(() => {
        if (cancelled) return
        try {
          const p = generatePuzzle(slug)
          if (!cancelled) {
            setPuzzle(p)
          }
        } catch (err) {
          console.error('Puzzle generation failed:', err)
          if (!cancelled) {
            setPuzzleError(err instanceof Error ? err.message : 'Failed to generate puzzle')
          }
        }
      }, 0)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [slug])

  const gameState = useGameSession(puzzle)
  const { flashingCells, checkAdjacency, clearFlashing } =
    useAdjacencyFeedback(gameState?.cells ?? [])
  const { incorrectCells, checkResult, performCheck, clearCheck } =
    useCheckPuzzle()

  const isActive = gameState?.session.status === 'active'
  const isPaused = gameState?.session.status === 'paused'

  // Timer
  const timerState = usePuzzleTimer(
    isActive || false,
    isPaused || false,
    gameState?.session.timerVisible ?? true
  )

  // Update timer in session
  useEffect(() => {
    if (gameState && timerState) {
      gameState.actions.updateTimer(timerState.elapsedMs)
    }
  }, [timerState?.elapsedMs])

  const { handleCellClick: baseCellClick } = useCellInput({
    session: gameState?.session ?? {
      sessionId: '',
      puzzleId: '',
      status: 'active',
      currentPlayableValue: 1,
      selectorDirection: 'up',
      remainingPlayableValues: [],
      mistakeCount: 0,
      checkCount: 0,
      timerElapsedMs: 0,
      timerVisible: true,
      timerPaused: false,
      pausedNumbersHidden: false,
    },
    cells: gameState?.cells ?? [],
    placeNumber: gameState?.actions.placeNumber ?? (() => {}),
    removeNumber: gameState?.actions.removeNumber ?? (() => {}),
    setSelectorValue: gameState?.actions.setSelectorValue ?? (() => {}),
    onInvalidDuplicate: (val) => {
      setDuplicateFlash(val)
      setTimeout(() => setDuplicateFlash(null), 1500)
    },
  })

  const handleCellClick = useCallback(
    (cellId: string) => {
      if (!gameState || isPaused) return
      clearCheck()
      clearFlashing()
      baseCellClick(cellId)

      // Check adjacency after placement
      const cell = gameState.cells.find((c) => c.id === cellId)
      if (cell && cell.isEditable && cell.currentValue === null) {
        // Value was just placed, check adjacency
        setTimeout(() => {
          const currentVal = gameState.session.currentPlayableValue
          checkAdjacency(cellId, currentVal)
        }, 50)
      }
    },
    [gameState, isPaused, baseCellClick, clearCheck, clearFlashing, checkAdjacency]
  )

  // Check action
  const handleCheck = useCallback(() => {
    if (!gameState) return
    const allPlayable = gameState.cells.filter((c) => c.state !== 'blocked')
    const allFilled = allPlayable.every((c) => c.currentValue !== null)
    const result = performCheck(gameState.actions.checkPlacements, allFilled)

    if (result.length === 0 && allFilled) {
      setShowCheckModal(true)
    }
  }, [gameState, performCheck])

  // Detect completion
  useEffect(() => {
    if (!gameState) return
    const allPlayable = gameState.cells.filter((c) => c.state !== 'blocked')
    const allFilled = allPlayable.every((c) => c.currentValue !== null)
    const allCorrect = allPlayable.every(
      (c) => c.currentValue === c.solutionValue
    )

    if (allFilled && allCorrect && gameState.session.status === 'active') {
      gameState.actions.markCompleted()
      setShowCompletionModal(true)
    }
  }, [gameState?.cells])

  // Reset
  const handleReset = useCallback(() => {
    if (!gameState) return
    gameState.actions.resetPuzzle()
    clearCheck()
    clearFlashing()
  }, [gameState, clearCheck, clearFlashing])

  // Solution
  const handleSolution = useCallback(() => {
    if (!gameState) return
    gameState.actions.revealSolution()
    clearCheck()
    clearFlashing()
  }, [gameState, clearCheck, clearFlashing])

  // Next puzzle
  const handleNextPuzzle = useCallback(() => {
    try {
      const p = generatePuzzle(slug)
      setPuzzle(p)
      setPuzzleError(null)
    } catch (err) {
      console.error('Puzzle generation failed:', err)
      setPuzzleError(err instanceof Error ? err.message : 'Failed to generate puzzle')
    }
    clearCheck()
    clearFlashing()
    setShowCompletionModal(false)
    setShowCheckModal(false)
  }, [slug, clearCheck, clearFlashing])

  // Pause
  const handleTogglePause = useCallback(() => {
    if (!gameState) return
    gameState.actions.togglePause()
  }, [gameState])

  // Timer visibility
  const handleToggleTimer = useCallback(() => {
    if (!gameState) return
    gameState.actions.toggleTimerVisible()
  }, [gameState])

  // Combined highlighted cells (errors from check + flashing from adjacency)
  const highlightedCells = useMemo(() => {
    const combined = new Set(incorrectCells)
    return combined
  }, [incorrectCells])

  if (puzzleError) {
    return (
      <div className="difficulty-page">
        <TopNav context="gameplay" currentDifficulty={slug} />
        <div className="difficulty-page__content">
          <p>Error generating puzzle: {puzzleError}</p>
          <button onClick={() => {
            try {
              const p = generatePuzzle(slug)
              setPuzzle(p)
              setPuzzleError(null)
            } catch (err) {
              console.error('Puzzle generation failed:', err)
              setPuzzleError(err instanceof Error ? err.message : 'Failed to generate puzzle')
            }
          }}>Try Again</button>
        </div>
      </div>
    )
  }

  if (!puzzle || !gameState) {
    return (
      <div className="difficulty-page">
        <TopNav context="gameplay" currentDifficulty={slug} />
        <div className="difficulty-page__content">
          <p>Generating puzzle...</p>
        </div>
      </div>
    )
  }

  const hexSize = slug === 'gentle-flow' ? 40 : slug === 'thoughtful' ? 32 : 26

  return (
    <div className="difficulty-page">
      <TopNav context="gameplay" currentDifficulty={slug} />
      <header className="difficulty-page__header">
        <h1>{DIFFICULTY_LABELS[slug]}</h1>
        <div className="difficulty-page__header-controls">
          {timerState && gameState.session.timerVisible && (
            <div className="difficulty-page__timer" aria-live="polite">
              {formatTime(timerState.elapsedMs)}
            </div>
          )}
          <button
            className="difficulty-page__header-btn"
            onClick={handleTogglePause}
            disabled={gameState.session.status === 'completed'}
            aria-label={isPaused ? 'Resume game' : 'Pause game'}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            className="difficulty-page__header-btn"
            onClick={handleToggleTimer}
            aria-label={gameState.session.timerVisible ? 'Hide timer' : 'Show timer'}
          >
            {gameState.session.timerVisible ? '⏱ Timer Off' : '⏱ Timer On'}
          </button>
        </div>
      </header>

      <div className="difficulty-page__content">
        {isPaused ? (
          <div className="difficulty-page__paused" aria-live="polite">
            <p className="difficulty-page__paused-text">⏸ Game Paused</p>
            <p>All numbers are hidden. Resume to continue.</p>
          </div>
        ) : null}

        <div className="difficulty-page__grid-area">
          <BeehiveGrid
            cells={gameState.cells}
            hexSize={hexSize}
            highlightedCells={highlightedCells}
            flashingCells={flashingCells}
            isPaused={isPaused || false}
            onCellClick={handleCellClick}
          />
        </div>

        {!isPaused && (
          <NumberSelector
            currentValue={gameState.session.currentPlayableValue}
            direction={gameState.session.selectorDirection}
            remainingCount={gameState.session.remainingPlayableValues.length}
            onLeft={() => gameState.actions.advanceSelector('down')}
            onRight={() => gameState.actions.advanceSelector('up')}
            onDirectionToggle={gameState.actions.toggleSelectorDirection}
            disabled={gameState.session.status === 'completed'}
          />
        )}

        {duplicateFlash !== null && (
          <div
            className="difficulty-page__duplicate-warning"
            role="alert"
            aria-live="assertive"
          >
            Number {duplicateFlash} is already placed!
          </div>
        )}

        <PuzzleControlBar
          onCheck={handleCheck}
          onReset={handleReset}
          onSolution={handleSolution}
          onNextPuzzle={handleNextPuzzle}
          isPaused={isPaused || false}
          isCompleted={gameState.session.status === 'completed'}
        />
      </div>

      <CheckResultModal
        isOpen={showCheckModal && checkResult === 'success'}
        onClose={() => setShowCheckModal(false)}
      />

      <CompletionModal
        isOpen={showCompletionModal}
        checkCount={gameState.session.checkCount}
        mistakeCount={gameState.session.mistakeCount}
        elapsedMs={gameState.session.timerElapsedMs}
        onNextPuzzle={handleNextPuzzle}
        onClose={() => setShowCompletionModal(false)}
      />
    </div>
  )
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
