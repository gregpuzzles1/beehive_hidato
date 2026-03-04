import type { HexCoord } from '../../../../types/puzzle'
import { generatePerfectHexGrid, hexDistance } from '../hexGeometry'

/**
 * Ring hive variant: creates a ring shape by removing
 * the center cells, leaving only the outer ring(s).
 */
export function generateRingVariant(sideLength: number): HexCoord[] {
  const allCells = generatePerfectHexGrid(sideLength)
  const n = sideLength - 1

  // For small grids, remove just the center
  // For larger grids, remove inner cells within radius floor(n/2)-1
  const innerRadius = Math.max(0, Math.floor(n / 2) - 1)

  return allCells.filter((c) => {
    const dist = hexDistance(c, { q: 0, r: 0 })
    return dist > innerRadius
  })
}
