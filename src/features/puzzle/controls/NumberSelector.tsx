import './NumberSelector.css'

interface NumberSelectorProps {
  currentValue: number
  direction: 'up' | 'down'
  remainingCount: number
  onLeft: () => void
  onRight: () => void
  onDirectionToggle: () => void
  disabled?: boolean
}

export function NumberSelector({
  currentValue,
  direction,
  remainingCount,
  onLeft,
  onRight,
  onDirectionToggle,
  disabled = false,
}: NumberSelectorProps) {
  return (
    <div className="number-selector" role="group" aria-label="Number selector">
      <button
        className="number-selector__btn number-selector__btn--left"
        onClick={onLeft}
        disabled={disabled || remainingCount === 0}
        aria-label="Previous number"
      >
        ◀
      </button>
      <div className="number-selector__display">
        <span className="number-selector__value" aria-live="polite">
          {remainingCount > 0 ? currentValue : '—'}
        </span>
        <button
          className="number-selector__direction"
          onClick={onDirectionToggle}
          disabled={disabled}
          aria-label={`Direction: ${direction === 'up' ? 'ascending' : 'descending'}. Click to toggle.`}
          title={direction === 'up' ? '↑ Ascending' : '↓ Descending'}
        >
          {direction === 'up' ? '▲' : '▼'}
        </button>
      </div>
      <button
        className="number-selector__btn number-selector__btn--right"
        onClick={onRight}
        disabled={disabled || remainingCount === 0}
        aria-label="Next number"
      >
        ▶
      </button>
      <span className="number-selector__count" aria-live="polite">
        {remainingCount} remaining
      </span>
    </div>
  )
}
