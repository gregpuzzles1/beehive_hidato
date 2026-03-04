import { useMemo } from 'react'
import type { GridCell } from '../../../types/puzzle'

/**
 * Hook for pause/resume number masking.
 * When paused, hides all numbers (anchors + user-entered) from display.
 * Returns cells with currentValue masked when paused.
 */
export function usePauseMask(
  cells: GridCell[],
  isPaused: boolean
): GridCell[] {
  return useMemo(() => {
    if (!isPaused) return cells
    return cells.map((cell) => ({
      ...cell,
      // Mask all values when paused
      currentValue: null,
      // Keep the state so cells still render with correct styling
    }))
  }, [cells, isPaused])
}
