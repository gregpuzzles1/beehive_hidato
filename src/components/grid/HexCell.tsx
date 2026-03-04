import type { GridCell } from '../../types/puzzle'
import './HexCell.css'

interface HexCellProps {
  cell: GridCell
  hexSize: number
  pixelX: number
  pixelY: number
  isHighlighted?: boolean
  isFlashing?: boolean
  isPaused?: boolean
  onClick?: () => void
}

export function HexCell({
  cell,
  hexSize,
  pixelX,
  pixelY,
  isHighlighted = false,
  isFlashing = false,
  isPaused = false,
  onClick,
}: HexCellProps) {
  const points = getHexPoints(hexSize)
  const displayValue = isPaused ? '' : (cell.currentValue ?? '')

  const classNames = [
    'hex-cell',
    `hex-cell--${cell.styleRole}`,
    cell.state === 'empty' && !cell.currentValue ? 'hex-cell--empty' : '',
    cell.state === 'user-filled' ? 'hex-cell--filled' : '',
    isHighlighted ? 'hex-cell--error' : '',
    isFlashing ? 'hex-cell--flashing' : '',
    cell.isEditable ? 'hex-cell--editable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = () => {
    if (cell.state !== 'blocked' && onClick) {
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick()
    }
  }

  if (cell.state === 'blocked') {
    return (
      <g
        transform={`translate(${pixelX}, ${pixelY})`}
        className="hex-cell hex-cell--blocked"
        aria-hidden="true"
      >
        <polygon points={points} />
      </g>
    )
  }

  return (
    <g
      transform={`translate(${pixelX}, ${pixelY})`}
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={cell.isEditable ? 0 : -1}
      aria-label={getCellLabel(cell, isPaused)}
    >
      <polygon points={points} />
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="central"
        className="hex-cell__text"
        fontSize={hexSize * 0.85}
      >
        {displayValue}
      </text>
    </g>
  )
}

function getHexPoints(size: number): string {
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    // Pointy-top orientation: angle starts at 30°
    const angle = (Math.PI / 180) * (60 * i - 30)
    const x = size * Math.cos(angle)
    const y = size * Math.sin(angle)
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return points.join(' ')
}

function getCellLabel(cell: GridCell, isPaused: boolean): string {
  if (isPaused) return 'Cell hidden during pause'
  if (cell.state === 'start') return `Start: ${cell.currentValue}`
  if (cell.state === 'end') return `End: ${cell.currentValue}`
  if (cell.state === 'anchor') return `Anchor: ${cell.currentValue}`
  if (cell.currentValue) return `Cell: ${cell.currentValue}`
  return 'Empty cell'
}
