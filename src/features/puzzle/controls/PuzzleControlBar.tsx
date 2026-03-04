import { Link } from 'react-router-dom'
import './PuzzleControlBar.css'

interface PuzzleControlBarProps {
  onCheck: () => void
  onReset: () => void
  onSolution: () => void
  onNextPuzzle: () => void
  onTogglePause: () => void
  onToggleTimer: () => void
  isPaused: boolean
  timerVisible: boolean
  isCompleted: boolean
}

export function PuzzleControlBar({
  onCheck,
  onReset,
  onSolution,
  onNextPuzzle,
  onTogglePause,
  onToggleTimer,
  isPaused,
  timerVisible,
  isCompleted,
}: PuzzleControlBarProps) {
  return (
    <div
      className="puzzle-control-bar"
      role="toolbar"
      aria-label="Puzzle controls"
    >
      <div className="puzzle-control-bar__group">
        <button
          className="puzzle-control-bar__btn puzzle-control-bar__btn--primary"
          onClick={onCheck}
          disabled={isPaused || isCompleted}
          aria-label="Check placements"
        >
          ✓ Check
        </button>
        <button
          className="puzzle-control-bar__btn"
          onClick={onReset}
          disabled={isPaused}
          aria-label="Reset puzzle"
        >
          ↺ Reset
        </button>
        <button
          className="puzzle-control-bar__btn"
          onClick={onSolution}
          disabled={isPaused}
          aria-label="Reveal solution"
        >
          💡 Solution
        </button>
        <button
          className="puzzle-control-bar__btn"
          onClick={onNextPuzzle}
          aria-label="Generate next puzzle"
        >
          ⟳ Next Puzzle
        </button>
      </div>

      <div className="puzzle-control-bar__group">
        <button
          className="puzzle-control-bar__btn puzzle-control-bar__btn--small"
          onClick={onTogglePause}
          disabled={isCompleted}
          aria-label={isPaused ? 'Resume game' : 'Pause game'}
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          className="puzzle-control-bar__btn puzzle-control-bar__btn--small"
          onClick={onToggleTimer}
          aria-label={timerVisible ? 'Hide timer' : 'Show timer'}
        >
          {timerVisible ? '⏱ Timer Off' : '⏱ Timer On'}
        </button>
        <Link
          to="/"
          className="puzzle-control-bar__btn puzzle-control-bar__btn--link"
        >
          🏠 Choose Your Challenge
        </Link>
      </div>
    </div>
  )
}
