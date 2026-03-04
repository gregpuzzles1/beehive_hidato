/**
 * Hex geometry utilities using axial coordinates (q, r).
 *
 * In axial coordinates for pointy-top hexagons:
 * - q increases to the right
 * - r increases downward-right
 * - The third cube coordinate s = -q - r
 *
 * For a hex at (q, r), its 6 neighbors are:
 *   (+1, 0), (-1, 0), (0, +1), (0, -1), (+1, -1), (-1, +1)
 */

import type { HexCoord } from '../../../types/puzzle'

/** The six neighbor direction offsets for axial hex coordinates */
export const HEX_DIRECTIONS: readonly HexCoord[] = [
  { q: 1, r: 0 },
  { q: -1, r: 0 },
  { q: 0, r: 1 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
  { q: -1, r: 1 },
] as const

/** Get all 6 neighbor coordinates of a hex cell */
export function getNeighbors(coord: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map((dir) => ({
    q: coord.q + dir.q,
    r: coord.r + dir.r,
  }))
}

/** Check if two hex cells are adjacent (distance = 1) */
export function areAdjacent(a: HexCoord, b: HexCoord): boolean {
  const dq = a.q - b.q
  const dr = a.r - b.r
  const ds = (-a.q - a.r) - (-b.q - b.r) // s = -q - r
  return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds)) === 1
}

/** Calculate hex distance between two cells */
export function hexDistance(a: HexCoord, b: HexCoord): number {
  const dq = a.q - b.q
  const dr = a.r - b.r
  const ds = (-a.q - a.r) - (-b.q - b.r)
  return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds))
}

/** Generate a perfect hexagonal grid of given side length (radius) */
export function generatePerfectHexGrid(sideLength: number): HexCoord[] {
  const coords: HexCoord[] = []
  const n = sideLength - 1 // radius in cube coordinates

  for (let q = -n; q <= n; q++) {
    for (let r = Math.max(-n, -q - n); r <= Math.min(n, -q + n); r++) {
      coords.push({ q, r })
    }
  }

  return coords
}

/** Create a unique key string for a hex coordinate */
export function hexKey(coord: HexCoord): string {
  return `${coord.q},${coord.r}`
}

/** Parse a hex key back to coordinates */
export function parseHexKey(key: string): HexCoord {
  const [q, r] = key.split(',').map(Number)
  return { q, r }
}

/**
 * Convert axial hex coordinates to pixel position for rendering.
 * Uses pointy-top orientation.
 */
export function hexToPixel(coord: HexCoord, size: number): { x: number; y: number } {
  const x = size * (Math.sqrt(3) * coord.q + (Math.sqrt(3) / 2) * coord.r)
  const y = size * ((3 / 2) * coord.r)
  return { x, y }
}

/**
 * Calculate count of cells in a perfect hex grid of given side length.
 * Formula: 3n² - 3n + 1 where n = sideLength
 */
export function perfectHexCellCount(sideLength: number): number {
  return 3 * sideLength * sideLength - 3 * sideLength + 1
}
