import { useCallback } from 'react'

/**
 * Hook for reset-to-initial-state action.
 * Wraps the game session's resetPuzzle action with additional cleanup callbacks.
 */
export function useResetPuzzle(
  resetAction: (() => void) | undefined,
  onReset?: () => void
) {
  const resetPuzzle = useCallback(() => {
    if (!resetAction) return
    resetAction()
    onReset?.()
  }, [resetAction, onReset])

  return { resetPuzzle }
}
