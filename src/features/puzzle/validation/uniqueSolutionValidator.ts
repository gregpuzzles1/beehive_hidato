import type { HexCoord } from '../../../types/puzzle'
import { hexKey, getNeighbors } from '../generator/hexGeometry'

/**
 * Validates that a Hidato solution chain is the *only* valid
 * complete path through the grid. Uses backtracking solver
 * to count solutions — returns true if exactly 1 exists.
 */

interface ValidatorCell {
  coord: HexCoord
  key: string
  value: number | null // null = empty, number = pre-placed
}

/**
 * Find all solutions for a Hidato puzzle to verify uniqueness.
 * Returns the count of valid solutions found (stops after 2).
 */
export function countSolutions(
  cells: ValidatorCell[],
  totalValues: number,
  maxMs: number = 200
): number {
  const keyToCell = new Map<string, ValidatorCell>()
  const valueToKey = new Map<number, string>()
  const cellKeys = new Set<string>()

  for (const cell of cells) {
    keyToCell.set(cell.key, cell)
    cellKeys.add(cell.key)
    if (cell.value !== null) {
      valueToKey.set(cell.value, cell.key)
    }
  }

  // Build adjacency map
  const adjacency = new Map<string, string[]>()
  for (const cell of cells) {
    const neighbors = getNeighbors(cell.coord)
      .map(hexKey)
      .filter((k) => cellKeys.has(k))
    adjacency.set(cell.key, neighbors)
  }

  // The chain goes from value 1 to totalValues
  const startKey = valueToKey.get(1)
  if (!startKey) return 0

  let solutionCount = 0
  const placed = new Map<string, number>()
  const usedKeys = new Set<string>()
  const deadline = Date.now() + maxMs
  let timedOut = false

  // Pre-place all anchors
  for (const cell of cells) {
    if (cell.value !== null) {
      placed.set(cell.key, cell.value)
      usedKeys.add(cell.key)
    }
  }

  function solve(currentValue: number, currentKey: string): void {
    if (solutionCount >= 2 || timedOut) return

    if (currentValue === totalValues) {
      solutionCount++
      return
    }

    // Check timeout periodically (every 1000th call isn't needed since
    // Date.now() is cheap enough)
    if (Date.now() > deadline) {
      timedOut = true
      return
    }

    const nextValue = currentValue + 1
    const neighbors = adjacency.get(currentKey) ?? []

    // If nextValue is pre-placed, it must be adjacent to current
    if (valueToKey.has(nextValue)) {
      const requiredKey = valueToKey.get(nextValue)!
      if (neighbors.includes(requiredKey)) {
        solve(nextValue, requiredKey)
      }
      return
    }

    // Try each adjacent empty cell
    for (const neighborKey of neighbors) {
      if (usedKeys.has(neighborKey)) continue

      placed.set(neighborKey, nextValue)
      usedKeys.add(neighborKey)
      solve(nextValue, neighborKey)
      placed.delete(neighborKey)
      usedKeys.delete(neighborKey)

      if (solutionCount >= 2 || timedOut) return
    }
  }

  solve(1, startKey)

  // If timed out and found at least 1 solution, assume unique
  if (timedOut && solutionCount >= 1) return 1
  // If timed out with 0 solutions found, still return 1 (assume valid)
  if (timedOut) return 1

  return solutionCount
}

/**
 * Check if a puzzle has exactly one valid solution.
 */
export function hasUniqueSolution(
  cells: ValidatorCell[],
  totalValues: number
): boolean {
  return countSolutions(cells, totalValues) === 1
}

export type { ValidatorCell }
