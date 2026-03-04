import { useCallback } from 'react'
import type { GridCell, GameSession } from '../../../types/puzzle'

interface UseCellInputProps {
  session: GameSession
  cells: GridCell[]
  placeNumber: (cellId: string, value: number) => void
  removeNumber: (cellId: string) => void
  setSelectorValue: (value: number) => void
  onInvalidDuplicate?: (value: number) => void
}

export function useCellInput({
  session,
  cells,
  placeNumber,
  removeNumber,
  setSelectorValue,
  onInvalidDuplicate,
}: UseCellInputProps) {
  const handleCellClick = useCallback(
    (cellId: string) => {
      if (session.status !== 'active') return

      const cell = cells.find((c) => c.id === cellId)
      if (!cell || !cell.isEditable) return

      // If cell has a value, remove it (tap to remove)
      if (cell.currentValue !== null) {
        removeNumber(cellId)
        return
      }

      // Place the currently selected value
      const value = session.currentPlayableValue
      if (session.remainingPlayableValues.includes(value)) {
        placeNumber(cellId, value)
      }
    },
    [session, cells, placeNumber, removeNumber]
  )

  const handleKeyboardInput = useCallback(
    (cellId: string, numericValue: number) => {
      if (session.status !== 'active') return

      const cell = cells.find((c) => c.id === cellId)
      if (!cell || !cell.isEditable) return

      // Check if number is already placed elsewhere
      const alreadyPlaced = cells.some(
        (c) => c.id !== cellId && c.currentValue === numericValue
      )

      if (alreadyPlaced) {
        onInvalidDuplicate?.(numericValue)
        return
      }

      // Check if the value is in the valid range
      if (
        numericValue < 1 ||
        numericValue > cells.filter((c) => c.state !== 'blocked').length
      ) {
        return
      }

      placeNumber(cellId, numericValue)
      setSelectorValue(numericValue)
    },
    [session, cells, placeNumber, setSelectorValue, onInvalidDuplicate]
  )

  return { handleCellClick, handleKeyboardInput }
}
