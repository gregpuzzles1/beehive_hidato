import { useState, useCallback } from 'react'

/**
 * Hook for the Check puzzle action.
 * Evaluates current placements and highlights incorrect cells.
 */
export function useCheckPuzzle() {
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set())
  const [checkResult, setCheckResult] = useState<'none' | 'errors' | 'success'>(
    'none'
  )

  const performCheck = useCallback(
    (checkFn: () => string[], allFilled: boolean) => {
      const incorrect = checkFn()
      setIncorrectCells(new Set(incorrect))

      if (incorrect.length === 0 && allFilled) {
        setCheckResult('success')
      } else if (incorrect.length > 0) {
        setCheckResult('errors')
      } else {
        setCheckResult('none')
      }

      return incorrect
    },
    []
  )

  const clearCheck = useCallback(() => {
    setIncorrectCells(new Set())
    setCheckResult('none')
  }, [])

  return { incorrectCells, checkResult, performCheck, clearCheck }
}
