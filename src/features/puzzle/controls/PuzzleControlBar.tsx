import { Link } from 'react-router-dom'
import './PuzzleControlBar.css'

interface PuzzleControlBarProps {
  onCheck: () => void
  onReset: () => void
  onSolution: () => void
  onNextPuzzle: () => void
  isPaused: boolean
  isCompleted: boolean
}

export function PuzzleControlBar({
  onCheck,
  onReset,
  onSolution,
  onNextPuzzle,
  isPaused,
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
