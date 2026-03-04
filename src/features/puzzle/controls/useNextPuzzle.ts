import { useCallback } from 'react'
import type { DifficultyId, Puzzle } from '../../../types/puzzle'
import { generatePuzzle } from '../generator/generatePuzzle'

/**
 * Hook for next-puzzle action at the same difficulty level.
 * Generates a new puzzle using uniform random variant selection.
 */
export function useNextPuzzle(
  slug: DifficultyId,
  setPuzzle: (puzzle: Puzzle) => void,
  onNext?: () => void
) {
  const nextPuzzle = useCallback(() => {
    const p = generatePuzzle(slug)
    setPuzzle(p)
    onNext?.()
  }, [slug, setPuzzle, onNext])

  return { nextPuzzle }
}
