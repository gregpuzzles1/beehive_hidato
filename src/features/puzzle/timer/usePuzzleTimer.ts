import { useEffect, useRef, useState } from 'react'

interface PuzzleTimerState {
  elapsedMs: number
  isRunning: boolean
  isVisible: boolean
}

/**
 * Timer hook that tracks elapsed puzzle time.
 * - Starts when puzzle becomes active
 * - Pauses when game is paused
 * - Continues (hidden) when timer display is off
 */
export function usePuzzleTimer(
  isActive: boolean,
  isPaused: boolean,
  isVisible: boolean
): PuzzleTimerState {
  const [elapsedMs, setElapsedMs] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastTickRef = useRef<number>(Date.now())

  useEffect(() => {
    if (isActive && !isPaused) {
      lastTickRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const delta = now - lastTickRef.current
        lastTickRef.current = now
        setElapsedMs((prev) => prev + delta)
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused])

  return {
    elapsedMs,
    isRunning: isActive && !isPaused,
    isVisible,
  }
}
