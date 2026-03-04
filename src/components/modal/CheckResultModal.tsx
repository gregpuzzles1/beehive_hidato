import './CheckResultModal.css'

interface CheckResultModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckResultModal({ isOpen, onClose }: CheckResultModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Check result"
    >
      <div
        className="modal-content check-result-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="check-result-modal__title">✅ Success!</h2>
        <p className="check-result-modal__message">
          All numbers have been placed correctly
        </p>
        <button
          className="check-result-modal__btn"
          onClick={onClose}
          autoFocus
        >
          Continue
        </button>
      </div>
    </div>
  )
}
