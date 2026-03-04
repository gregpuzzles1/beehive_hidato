import { useEffect, useState } from 'react'
import './CompletionModal.css'

interface CompletionModalProps {
  isOpen: boolean
  checkCount: number
  mistakeCount: number
  elapsedMs: number
  onNextPuzzle: () => void
  onClose: () => void
}

export function CompletionModal({
  isOpen,
  checkCount,
  mistakeCount,
  elapsedMs,
  onNextPuzzle,
  onClose,
}: CompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
    setShowConfetti(false)
  }, [isOpen])

  if (!isOpen) return null

  const totalSeconds = Math.floor(elapsedMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Puzzle completed"
    >
      <div
        className="modal-content completion-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {showConfetti && <ConfettiEffect />}
        <h2 className="completion-modal__title">🎉 Puzzle Complete!</h2>
        <div className="completion-modal__metrics">
          <div className="completion-modal__metric">
            <span className="completion-modal__metric-value">{checkCount}</span>
            <span className="completion-modal__metric-label">Check Clicks</span>
          </div>
          <div className="completion-modal__metric">
            <span className="completion-modal__metric-value">
              {mistakeCount}
            </span>
            <span className="completion-modal__metric-label">Mistakes</span>
          </div>
          <div className="completion-modal__metric">
            <span className="completion-modal__metric-value">
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
            </span>
            <span className="completion-modal__metric-label">Total Time</span>
          </div>
        </div>
        <div className="completion-modal__actions">
          <button
            className="completion-modal__btn completion-modal__btn--primary"
            onClick={onNextPuzzle}
            autoFocus
          >
            Next Puzzle
          </button>
          <button className="completion-modal__btn" onClick={onClose}>
            Review Board
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfettiEffect() {
  const particles = Array.from({ length: 50 }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 2
    const duration = 2 + Math.random() * 3
    const colors = ['#86F8FF', '#6EE8C2', '#79FFA2', '#F5C542', '#D2DDC5']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = 6 + Math.random() * 8

    return (
      <div
        key={i}
        className="confetti-particle"
        style={{
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          backgroundColor: color,
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
    )
  })

  return <div className="confetti-container">{particles}</div>
}
