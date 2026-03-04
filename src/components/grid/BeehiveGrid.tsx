import { useMemo } from 'react'
import type { GridCell } from '../../types/puzzle'
import { hexToPixel } from '../../features/puzzle/generator/hexGeometry'
import { HexCell } from './HexCell'
import './HexCell.css'
import './BeehiveGrid.css'

interface BeehiveGridProps {
  cells: GridCell[]
  hexSize: number
  highlightedCells?: Set<string>
  flashingCells?: Set<string>
  isPaused?: boolean
  onCellClick?: (cellId: string) => void
}

export function BeehiveGrid({
  cells,
  hexSize,
  highlightedCells = new Set(),
  flashingCells = new Set(),
  isPaused = false,
  onCellClick,
}: BeehiveGridProps) {
  const { positions, viewBox } = useMemo(() => {
    const positions = cells.map((cell) => ({
      cell,
      ...hexToPixel({ q: cell.q, r: cell.r }, hexSize),
    }))

    // Calculate bounding box
    const padding = hexSize * 1.5
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity

    for (const pos of positions) {
      minX = Math.min(minX, pos.x - hexSize)
      maxX = Math.max(maxX, pos.x + hexSize)
      minY = Math.min(minY, pos.y - hexSize)
      maxY = Math.max(maxY, pos.y + hexSize)
    }

    const vbX = minX - padding
    const vbY = minY - padding
    const vbW = maxX - minX + 2 * padding
    const vbH = maxY - minY + 2 * padding

    return {
      positions,
      viewBox: `${vbX} ${vbY} ${vbW} ${vbH}`,
    }
  }, [cells, hexSize])

  return (
    <div className="beehive-grid" role="grid" aria-label="Puzzle grid">
      <svg
        viewBox={viewBox}
        className="beehive-grid__svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {positions.map(({ cell, x, y }) => (
          <HexCell
            key={cell.id}
            cell={cell}
            hexSize={hexSize}
            pixelX={x}
            pixelY={y}
            isHighlighted={highlightedCells.has(cell.id)}
            isFlashing={flashingCells.has(cell.id)}
            isPaused={isPaused}
            onClick={() => onCellClick?.(cell.id)}
          />
        ))}
      </svg>
    </div>
  )
}
