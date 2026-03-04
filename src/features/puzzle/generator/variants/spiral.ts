import type { HexCoord } from '../../../../types/puzzle'
import { hexKey, getNeighbors } from '../hexGeometry'

/**
 * Spiral hive variant: builds a spiral path outward from center,
 * keeping only cells that form the spiral shape.
 */
export function generateSpiralVariant(sideLength: number): HexCoord[] {
  // Target count similar to perfect hex but shaped as a spiral
  const targetCount = 3 * sideLength * sideLength - 3 * sideLength + 1
  // Keep 70-85% of cells to create a spiral feel
  const keepCount = Math.max(
    7,
    Math.floor(targetCount * (0.70 + Math.random() * 0.15))
  )

  const visited = new Set<string>()
  const result: HexCoord[] = []
  const center: HexCoord = { q: 0, r: 0 }
  const n = sideLength - 1

  // Start from center and spiral outward
  result.push(center)
  visited.add(hexKey(center))

  // Direction indices for spiral: cycle through the 6 hex directions
  // in a consistent rotational order
  const spiralDirs: HexCoord[] = [
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: -1, r: 1 },
    { q: -1, r: 0 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
  ]

  let current = center
  let dirIdx = 0
  let stepsInDir = 1
  let stepsTaken = 0
  let dirChanges = 0

  let maxIterations = targetCount * 6 // Hard safety limit

  while (result.length < keepCount && maxIterations-- > 0) {
    const dir = spiralDirs[dirIdx % 6]
    const next: HexCoord = { q: current.q + dir.q, r: current.r + dir.r }

    // Check if within bounds
    const s = -next.q - next.r
    if (
      Math.abs(next.q) <= n &&
      Math.abs(next.r) <= n &&
      Math.abs(s) <= n
    ) {
      if (!visited.has(hexKey(next))) {
        result.push(next)
        visited.add(hexKey(next))
      }
      current = next
    } else {
      // Hit boundary, change direction
      dirIdx++
      dirChanges++
      if (dirChanges % 2 === 0) {
        stepsInDir++
      }
      stepsTaken = 0
      continue
    }

    stepsTaken++
    if (stepsTaken >= stepsInDir) {
      stepsTaken = 0
      dirIdx++
      dirChanges++
      if (dirChanges % 2 === 0) {
        stepsInDir++
      }
    }
  }

  // Ensure connectivity: add any missing bridge cells
  return ensureConnected(result, n)
}

function ensureConnected(cells: HexCoord[], maxRadius: number): HexCoord[] {
  if (cells.length <= 1) return cells

  const cellSet = new Set(cells.map(hexKey))
  const visited = new Set<string>()
  const queue: HexCoord[] = [cells[0]]
  visited.add(hexKey(cells[0]))

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const neighbor of getNeighbors(current)) {
      const key = hexKey(neighbor)
      if (cellSet.has(key) && !visited.has(key)) {
        visited.add(key)
        queue.push(neighbor)
      }
    }
  }

  // If all cells are connected, return as-is
  if (visited.size === cells.length) return cells

  // Otherwise add bridge cells between disconnected components
  const result = [...cells]
  const disconnected = cells.filter((c) => !visited.has(hexKey(c)))

  for (const dc of disconnected) {
    // Find nearest connected cell and add bridge
    let nearest: HexCoord | null = null
    let minDist = Infinity
    for (const cc of cells) {
      if (visited.has(hexKey(cc))) {
        const dist =
          Math.abs(cc.q - dc.q) +
          Math.abs(cc.r - dc.r) +
          Math.abs(-cc.q - cc.r - (-dc.q - dc.r))
        if (dist < minDist) {
          minDist = dist
          nearest = cc
        }
      }
    }
    if (nearest) {
      // Add midpoint cells
      const midQ = Math.round((nearest.q + dc.q) / 2)
      const midR = Math.round((nearest.r + dc.r) / 2)
      const s = -midQ - midR
      if (
        Math.abs(midQ) <= maxRadius &&
        Math.abs(midR) <= maxRadius &&
        Math.abs(s) <= maxRadius
      ) {
        const key = hexKey({ q: midQ, r: midR })
        if (!cellSet.has(key)) {
          result.push({ q: midQ, r: midR })
          cellSet.add(key)
        }
      }
    }
  }

  return result
}
