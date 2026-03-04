import type { HexCoord } from '../../../../types/puzzle'
import { generatePerfectHexGrid } from '../hexGeometry'

/**
 * Perfect hive variant: a complete hexagonal grid with no blocked cells.
 */
export function generatePerfectVariant(sideLength: number): HexCoord[] {
  return generatePerfectHexGrid(sideLength)
}
