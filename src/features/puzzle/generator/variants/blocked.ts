import type { HexCoord } from '../../../../types/puzzle'
import { generatePerfectHexGrid, hexKey } from '../hexGeometry'

/**
 * Blocked hive variant patterns.
 * Removes specific cells to create recognizable patterns:
 * - eyes: two symmetric blocked cells
 * - smiley: eyes + curved mouth
 * - smile: curved mouth only
 * - center: single center block
 */

type BlockedPattern = 'eyes' | 'smiley' | 'smile' | 'center'

const PATTERNS: Record<BlockedPattern, (sideLength: number) => HexCoord[]> = {
  eyes: (sideLength) => {
    const n = sideLength - 1
    const offset = Math.max(1, Math.floor(n / 2))
    return [
      { q: -offset, r: 0 },
      { q: offset, r: 0 },
    ]
  },

  smiley: (sideLength) => {
    const n = sideLength - 1
    const eyeOffset = Math.max(1, Math.floor(n / 2))
    const mouthRow = Math.max(1, Math.floor(n * 0.6))
    const blocked: HexCoord[] = [
      // Eyes
      { q: -eyeOffset, r: 0 },
      { q: eyeOffset, r: 0 },
      // Mouth curve
      { q: -1, r: mouthRow },
      { q: 0, r: mouthRow },
      { q: 1, r: mouthRow },
    ]
    return blocked
  },

  smile: (sideLength) => {
    const n = sideLength - 1
    const mouthRow = Math.max(1, Math.floor(n * 0.6))
    return [
      { q: -1, r: mouthRow },
      { q: 0, r: mouthRow },
      { q: 1, r: mouthRow },
    ]
  },

  center: () => {
    return [{ q: 0, r: 0 }]
  },
}

const PATTERN_NAMES: BlockedPattern[] = ['eyes', 'smiley', 'smile', 'center']

export function generateBlockedVariant(sideLength: number): {
  playable: HexCoord[]
  blocked: HexCoord[]
  pattern: string
} {
  const allCells = generatePerfectHexGrid(sideLength)
  const pattern = PATTERN_NAMES[Math.floor(Math.random() * PATTERN_NAMES.length)]
  const blockedCoords = PATTERNS[pattern](sideLength)
  const blockedKeys = new Set(blockedCoords.map(hexKey))

  // Only block cells that actually exist in the grid
  const actualBlocked = blockedCoords.filter((c) =>
    allCells.some((a) => a.q === c.q && a.r === c.r)
  )
  const playable = allCells.filter((c) => !blockedKeys.has(hexKey(c)))

  return { playable, blocked: actualBlocked, pattern }
}
