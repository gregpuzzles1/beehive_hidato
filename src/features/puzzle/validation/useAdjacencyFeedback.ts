import { useState, useCallback, useRef } from 'react'
import type { GridCell } from '../../../types/puzzle'
import { areAdjacent } from '../generator/hexGeometry'

/**
 * Manages the adjacency validation feedback:
 * When a placed number is not adjacent to its chain neighbors,
 * flash the placed cell and the target neighbor cells red 3 times.
 * The placed value remains in the cell.
 */
export function useAdjacencyFeedback(cells: GridCell[]) {
  const [flashingCells, setFlashingCells] = useState<Set<string>>(new Set())
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkAdjacency = useCallback(
    (cellId: string, placedValue: number): boolean => {
      const cell = cells.find((c) => c.id === cellId)
      if (!cell) return true

      const cellCoord = { q: cell.q, r: cell.r }
      const invalidNeighborIds: string[] = []

      // Check if placedValue-1 is adjacent (if it's placed somewhere)
      if (placedValue > 1) {
        const prevCell = cells.find((c) => c.currentValue === placedValue - 1)
        if (prevCell) {
          const prevCoord = { q: prevCell.q, r: prevCell.r }
          if (!areAdjacent(cellCoord, prevCoord)) {
            invalidNeighborIds.push(prevCell.id)
          }
        }
      }

      // Check if placedValue+1 is adjacent (if it's placed somewhere)
      const maxValue = cells.filter((c) => c.state !== 'blocked').length
      if (placedValue < maxValue) {
        const nextCell = cells.find((c) => c.currentValue === placedValue + 1)
        if (nextCell) {
          const nextCoord = { q: nextCell.q, r: nextCell.r }
          if (!areAdjacent(cellCoord, nextCoord)) {
            invalidNeighborIds.push(nextCell.id)
          }
        }
      }

      if (invalidNeighborIds.length > 0) {
        // Flash the placed cell and the invalid neighbors
        const toFlash = new Set([cellId, ...invalidNeighborIds])
        setFlashingCells(toFlash)

        // Clear after 3 flashes (0.3s * 3 = 0.9s)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          setFlashingCells(new Set())
        }, 900)

        return false
      }

      return true
    },
    [cells]
  )

  const clearFlashing = useCallback(() => {
    setFlashingCells(new Set())
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  return { flashingCells, checkAdjacency, clearFlashing }
}
