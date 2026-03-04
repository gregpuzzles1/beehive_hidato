import { useCallback } from 'react'

/**
 * Hook for reveal-solution action.
 * Wraps the game session's revealSolution action with additional cleanup callbacks.
 */
export function useRevealSolution(
  revealAction: (() => void) | undefined,
  onReveal?: () => void
) {
  const revealSolution = useCallback(() => {
    if (!revealAction) return
    revealAction()
    onReveal?.()
  }, [revealAction, onReveal])

  return { revealSolution }
}
