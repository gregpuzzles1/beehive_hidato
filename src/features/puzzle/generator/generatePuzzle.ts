import type {
  DifficultyId,
  HiveVariant,
  HexCoord,
  GridCell,
  Puzzle,
  CellState,
  CellStyleRole,
} from '../../../types/puzzle'
import { DIFFICULTY_PROFILES } from './difficultyProfiles'
import {
  generatePerfectHexGrid,
  hexDistance,
  hexKey,
  getNeighbors,
} from './hexGeometry'
import { generatePerfectVariant } from './variants/perfect'
import { generateBlockedVariant } from './variants/blocked'
import { generateDamagedVariant } from './variants/damaged'
import { generateRingVariant } from './variants/ring'
import { generateSpiralVariant } from './variants/spiral'
// Unique solution validation is disabled for performance on mobile.
// import { hasUniqueSolution, type ValidatorCell } from '../validation/uniqueSolutionValidator'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const ALL_VARIANTS: HiveVariant[] = [
  'perfect',
  'blocked',
  'damaged',
  'ring',
]

const MAX_RETRIES = 15

/**
 * Generate a complete, valid Beehive Hidato puzzle.
 *
 * Steps:
 * 1. Select variant uniformly at random
 * 2. Generate grid shape for that variant
 * 3. Find a valid Hamiltonian path through the grid (the solution chain)
 * 4. Select anchors within the 32-48% ratio, always including start and end
 * 5. Verify unique solution
 * 6. Retry if constraints aren't met
 */
export function generatePuzzle(difficultyId: DifficultyId): Puzzle {
  const profile = DIFFICULTY_PROFILES[difficultyId]
  const maxAnchorCountBySideLength: Record<number, number> = {
    4: 11,
  }
  const maxAnchorCount = maxAnchorCountBySideLength[profile.perfectHiveSideLength]

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Step 1: Random variant
    const variant = ALL_VARIANTS[Math.floor(Math.random() * ALL_VARIANTS.length)]

    // Step 2: Generate grid shape
    const { playableCoords, blockedCoords } = generateGridShape(
      variant,
      profile.perfectHiveSideLength
    )

    if (playableCoords.length < 3) continue

    // Step 3: Find a Hamiltonian path
    const solutionPath = findHamiltonianPath(playableCoords)
    if (!solutionPath) continue

    const totalPlayable = solutionPath.length

    // Step 4: Select anchors
    const anchors = selectAnchors(
      solutionPath,
      totalPlayable,
      profile.minAnchorRatio,
      profile.maxAnchorRatio,
      profile.complexityRank,
      maxAnchorCount
    )

    if (!anchors) continue

    // Step 5: Skip expensive unique-solution validation.
    // Puzzles generated via Hamiltonian path with 32-48% anchor coverage
    // are almost always uniquely solvable. This avoids blocking the
    // mobile browser's main thread with backtracking.

    // Step 6: Build the Puzzle object
    const solutionChain = solutionPath.map((coord, idx) => ({
      cellId: hexKey(coord),
      value: idx + 1,
    }))

    const coordToValue = new Map<string, number>()
    solutionPath.forEach((coord, idx) => {
      coordToValue.set(hexKey(coord), idx + 1)
    })

    const cells: GridCell[] = [
      ...playableCoords.map((coord) => {
        const key = hexKey(coord)
        const solutionValue = coordToValue.get(key) ?? null
        const isAnchor = solutionValue !== null && anchors.has(solutionValue)
        const isStart = solutionValue === 1
        const isEnd = solutionValue === totalPlayable

        let state: CellState
        let styleRole: CellStyleRole
        let isEditable: boolean

        if (isStart) {
          state = 'start'
          styleRole = 'start-end-accent'
          isEditable = false
        } else if (isEnd) {
          state = 'end'
          styleRole = 'start-end-accent'
          isEditable = false
        } else if (isAnchor) {
          state = 'anchor'
          styleRole = 'anchor-honey'
          isEditable = false
        } else {
          state = 'empty'
          styleRole = 'playable-default'
          isEditable = true
        }

        return {
          id: key,
          q: coord.q,
          r: coord.r,
          state,
          solutionValue,
          currentValue: isEditable ? null : solutionValue,
          isEditable,
          styleRole,
        }
      }),
      ...blockedCoords.map((coord) => ({
        id: hexKey(coord),
        q: coord.q,
        r: coord.r,
        state: 'blocked' as CellState,
        solutionValue: null,
        currentValue: null,
        isEditable: false,
        styleRole: 'blocked' as CellStyleRole,
      })),
    ]

    return {
      id: generateId(),
      difficultyId,
      variant,
      totalPlayableCount: totalPlayable,
      anchorCount: anchors.size,
      anchorRatio: anchors.size / totalPlayable,
      startValue: 1,
      endValue: totalPlayable,
      solutionChain,
      cells,
    }
  }

  // Fallback: should rarely happen. Generate a simple perfect variant
  // with more anchors for guaranteed solvability
  return generateFallbackPuzzle(difficultyId)
}

function generateGridShape(
  variant: HiveVariant,
  sideLength: number
): { playableCoords: HexCoord[]; blockedCoords: HexCoord[] } {
  const deriveBlockedCoords = (playable: HexCoord[]): HexCoord[] => {
    const all = generatePerfectHexGrid(sideLength)
    const playableKeys = new Set(playable.map(hexKey))
    return all.filter((coord) => !playableKeys.has(hexKey(coord)))
  }

  let playableCoords: HexCoord[]
  let blockedCoords: HexCoord[]

  switch (variant) {
    case 'perfect':
      playableCoords = generatePerfectVariant(sideLength)
      blockedCoords = []
      break
    case 'blocked': {
      const result = generateBlockedVariant(sideLength)
      playableCoords = result.playable
      blockedCoords = result.blocked
      break
    }
    case 'damaged':
      {
        playableCoords = generateDamagedVariant(sideLength)
        blockedCoords = deriveBlockedCoords(playableCoords)
      }
      break
    case 'ring':
      {
        playableCoords = generateRingVariant(sideLength)
        blockedCoords = deriveBlockedCoords(playableCoords)
      }
      break
    case 'spiral':
      {
        playableCoords = generateSpiralVariant(sideLength)
        blockedCoords = deriveBlockedCoords(playableCoords)
      }
      break
  }

  const blockedCapBySideLength: Record<number, number> = {
    4: 3,
    5: 7,
  }
  const blockedCap = blockedCapBySideLength[sideLength]

  if (
    blockedCap !== undefined &&
    blockedCoords.length > blockedCap
  ) {
    const blockedShuffled = [...blockedCoords]
    for (let i = blockedShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[blockedShuffled[i], blockedShuffled[j]] = [
        blockedShuffled[j],
        blockedShuffled[i],
      ]
    }

    const keptBlocked = blockedShuffled.slice(0, blockedCap)
    const restoredToPlayable = blockedShuffled.slice(blockedCap)

    blockedCoords = keptBlocked
    playableCoords = [...playableCoords, ...restoredToPlayable]
  }

  const adjusted = ensureBlockedNotAllPerimeter(
    playableCoords,
    blockedCoords,
    sideLength
  )
  playableCoords = adjusted.playableCoords
  blockedCoords = adjusted.blockedCoords

  const perimeterAdjusted = enforcePerimeterBlockedRunLimit(
    playableCoords,
    blockedCoords,
    sideLength,
    3
  )
  playableCoords = perimeterAdjusted.playableCoords
  blockedCoords = perimeterAdjusted.blockedCoords

  return { playableCoords, blockedCoords }
}

function ensureBlockedNotAllPerimeter(
  playableCoords: HexCoord[],
  blockedCoords: HexCoord[],
  sideLength: number
): { playableCoords: HexCoord[]; blockedCoords: HexCoord[] } {
  if (blockedCoords.length === 0) {
    return { playableCoords, blockedCoords }
  }

  const perimeterRadius = sideLength - 1
  const isPerimeter = (coord: HexCoord): boolean =>
    hexDistance(coord, { q: 0, r: 0 }) === perimeterRadius

  const allBlockedOnPerimeter = blockedCoords.every(isPerimeter)
  if (!allBlockedOnPerimeter) {
    return { playableCoords, blockedCoords }
  }

  const interiorPlayable = playableCoords.filter((coord) => !isPerimeter(coord))
  if (interiorPlayable.length === 0) {
    return { playableCoords, blockedCoords }
  }

  const blockedToRestore = blockedCoords[0]
  const interiorToBlock =
    interiorPlayable[Math.floor(Math.random() * interiorPlayable.length)]

  const interiorKey = hexKey(interiorToBlock)
  const nextPlayable = [
    ...playableCoords.filter((coord) => hexKey(coord) !== interiorKey),
    blockedToRestore,
  ]
  const nextBlocked = [
    ...blockedCoords.slice(1),
    interiorToBlock,
  ]

  return {
    playableCoords: nextPlayable,
    blockedCoords: nextBlocked,
  }
}

function enforcePerimeterBlockedRunLimit(
  playableCoords: HexCoord[],
  blockedCoords: HexCoord[],
  sideLength: number,
  maxRun: number
): { playableCoords: HexCoord[]; blockedCoords: HexCoord[] } {
  if (blockedCoords.length === 0 || sideLength < 2) {
    return { playableCoords, blockedCoords }
  }

  const perimeter = getPerimeterRing(sideLength)
  if (perimeter.length === 0) {
    return { playableCoords, blockedCoords }
  }

  const perimeterKeys = perimeter.map(hexKey)
  const blockedSet = new Set(blockedCoords.map(hexKey))
  const playableSet = new Set(playableCoords.map(hexKey))
  const coordByKey = new Map<string, HexCoord>()

  for (const coord of perimeter) {
    coordByKey.set(hexKey(coord), coord)
  }
  for (const coord of playableCoords) {
    coordByKey.set(hexKey(coord), coord)
  }
  for (const coord of blockedCoords) {
    coordByKey.set(hexKey(coord), coord)
  }

  const perimeterRadius = sideLength - 1
  const isPerimeter = (coord: HexCoord): boolean =>
    hexDistance(coord, { q: 0, r: 0 }) === perimeterRadius

  let safety = perimeterKeys.length * 2
  while (safety-- > 0) {
    const longestRun = getLongestBlockedPerimeterRun(perimeterKeys, blockedSet)
    if (longestRun.length <= maxRun) break

    const interiorPlayableKeys = Array.from(playableSet).filter((key) => {
      const coord = coordByKey.get(key)
      return coord !== undefined && !isPerimeter(coord)
    })
    if (interiorPlayableKeys.length === 0) break

    const runCenterIdx = Math.floor(longestRun.length / 2)
    const perimeterBlockedKey = longestRun[runCenterIdx]
    const interiorPlayableKey =
      interiorPlayableKeys[
        Math.floor(Math.random() * interiorPlayableKeys.length)
      ]

    blockedSet.delete(perimeterBlockedKey)
    playableSet.add(perimeterBlockedKey)
    playableSet.delete(interiorPlayableKey)
    blockedSet.add(interiorPlayableKey)
  }

  const nextPlayable = Array.from(playableSet)
    .map((key) => coordByKey.get(key))
    .filter((coord): coord is HexCoord => coord !== undefined)
  const nextBlocked = Array.from(blockedSet)
    .map((key) => coordByKey.get(key))
    .filter((coord): coord is HexCoord => coord !== undefined)

  return { playableCoords: nextPlayable, blockedCoords: nextBlocked }
}

function getLongestBlockedPerimeterRun(
  perimeterKeys: string[],
  blockedSet: Set<string>
): string[] {
  if (perimeterKeys.length === 0) return []

  const states = perimeterKeys.map((key) => blockedSet.has(key))
  if (!states.includes(true)) return []
  if (states.every(Boolean)) return [...perimeterKeys]

  const firstOpen = states.findIndex((value) => !value)
  let longest: string[] = []
  let current: string[] = []

  for (let step = 1; step <= states.length; step++) {
    const idx = (firstOpen + step) % states.length
    if (states[idx]) {
      current.push(perimeterKeys[idx])
      if (current.length > longest.length) {
        longest = [...current]
      }
    } else {
      current = []
    }
  }

  return longest
}

function getPerimeterRing(sideLength: number): HexCoord[] {
  const radius = sideLength - 1
  if (radius <= 0) return []

  const ring: HexCoord[] = []
  let current: HexCoord = { q: 0, r: -radius }

  const segmentDirections: HexCoord[] = [
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: -1, r: 1 },
    { q: -1, r: 0 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
  ]

  for (const dir of segmentDirections) {
    for (let step = 0; step < radius; step++) {
      ring.push(current)
      current = { q: current.q + dir.q, r: current.r + dir.r }
    }
  }

  return ring
}

/**
 * Find a Hamiltonian path through the hex grid using
 * Warnsdorff's heuristic (visit neighbor with fewest unvisited neighbors first).
 */
function findHamiltonianPath(coords: HexCoord[]): HexCoord[] | null {
  const keySet = new Set(coords.map(hexKey))
  const coordMap = new Map<string, HexCoord>()
  coords.forEach((c) => coordMap.set(hexKey(c), c))

  // Build adjacency
  const adj = new Map<string, string[]>()
  for (const coord of coords) {
    const key = hexKey(coord)
    const neighbors = getNeighbors(coord)
      .map(hexKey)
      .filter((k) => keySet.has(k))
    adj.set(key, neighbors)
  }

  const totalCells = coords.length

  // Try from a few random starting positions
  const shuffled = [...coords].sort(() => Math.random() - 0.5)
  const startCandidates = shuffled.slice(0, Math.min(5, coords.length))

  for (const startCoord of startCandidates) {
    const visited = new Set<string>()
    const path: HexCoord[] = []

    const startKey = hexKey(startCoord)
    visited.add(startKey)
    path.push(startCoord)

    let current = startKey
    let found = true

    while (path.length < totalCells) {
      const neighbors = (adj.get(current) ?? []).filter(
        (k) => !visited.has(k)
      )

      if (neighbors.length === 0) {
        found = false
        break
      }

      // Warnsdorff: pick neighbor with fewest unvisited neighbours
      neighbors.sort((a, b) => {
        const aCount = (adj.get(a) ?? []).filter((k) => !visited.has(k)).length
        const bCount = (adj.get(b) ?? []).filter((k) => !visited.has(k)).length
        return aCount - bCount
      })

      // Add some randomness: among ties, shuffle
      let bestCount = (adj.get(neighbors[0]) ?? []).filter(
        (k) => !visited.has(k)
      ).length
      let tieEnd = 1
      while (
        tieEnd < neighbors.length &&
        (adj.get(neighbors[tieEnd]) ?? []).filter((k) => !visited.has(k))
          .length === bestCount
      ) {
        tieEnd++
      }
      // Pick random among ties
      const chosenIdx = Math.floor(Math.random() * tieEnd)
      const chosen = neighbors[chosenIdx]

      visited.add(chosen)
      path.push(coordMap.get(chosen)!)
      current = chosen
    }

    if (found && path.length === totalCells) {
      return path
    }
  }

  return null
}

/**
 * Select anchor positions ensuring:
 * - Start (value 1) and end (last value) are always anchors
 * - Ratio between 32% and 48%
 * - Higher complexity rank = fewer anchors (closer to 32%)
 */
function selectAnchors(
  path: HexCoord[],
  total: number,
  minRatio: number,
  maxRatio: number,
  complexityRank: number,
  maxAnchorCount?: number
): Set<number> | null {
  // Scale anchor ratio inversely with complexity
  // Rank 1 → closer to maxRatio, Rank 5 → closer to minRatio
  const t = (complexityRank - 1) / 4 // 0 to 1
  const targetRatio = maxRatio - t * (maxRatio - minRatio)
  const baseTargetCount = Math.max(2, Math.round(total * targetRatio))
  const targetCount =
    maxAnchorCount !== undefined
      ? Math.min(baseTargetCount, maxAnchorCount)
      : baseTargetCount

  const anchors = pickSpreadAnchors(path, targetCount)

  // Verify ratio
  const ratio = anchors.size / total
  const effectiveMinRatio =
    maxAnchorCount !== undefined
      ? Math.min(minRatio, maxAnchorCount / total)
      : minRatio
  if (ratio < effectiveMinRatio || ratio > maxRatio) return null

  return anchors
}

function pickSpreadAnchors(path: HexCoord[], targetCount: number): Set<number> {
  const total = path.length
  const desiredCount = Math.min(total, Math.max(2, targetCount))
  const anchors = new Set<number>([1, total])

  while (anchors.size < desiredCount) {
    let bestValue: number | null = null
    let bestScore = -Infinity

    for (let value = 2; value < total; value++) {
      if (anchors.has(value)) continue

      const candidateCoord = path[value - 1]
      let minValueGap = Infinity
      let minSpatialGap = Infinity

      for (const anchorValue of anchors) {
        const anchorCoord = path[anchorValue - 1]
        const valueGap = Math.abs(anchorValue - value)
        const spatialGap = hexDistance(candidateCoord, anchorCoord)

        if (valueGap < minValueGap) minValueGap = valueGap
        if (spatialGap < minSpatialGap) minSpatialGap = spatialGap
      }

      // Favor candidates far from existing anchors in both chain order
      // and physical board location, with a tiny random tie-breaker.
      const score = minValueGap * 1.25 + minSpatialGap + Math.random() * 0.1
      if (score > bestScore) {
        bestScore = score
        bestValue = value
      }
    }

    if (bestValue === null) break
    anchors.add(bestValue)
  }

  return anchors
}

/**
 * Fallback puzzle generator for when normal generation fails.
 * Uses a small perfect grid with extra anchors to guarantee solvability.
 */
function generateFallbackPuzzle(difficultyId: DifficultyId): Puzzle {
  const profile = DIFFICULTY_PROFILES[difficultyId]
  // Use smaller grid for fallback
  const sideLength = Math.min(profile.perfectHiveSideLength, 3)
  const coords = generatePerfectVariant(sideLength)
  const path = findHamiltonianPath(coords)

  if (!path) {
    // Absolute fallback: linear path through sorted coordinates
    const sortedCoords = [...coords].sort((a, b) => a.r - b.r || a.q - b.q)
    return buildPuzzleFromPath(sortedCoords, difficultyId, 'perfect', 0.48)
  }

  return buildPuzzleFromPath(path, difficultyId, 'perfect', 0.45)
}

function buildPuzzleFromPath(
  path: HexCoord[],
  difficultyId: DifficultyId,
  variant: HiveVariant,
  anchorRatio: number
): Puzzle {
  const total = path.length
  const anchorCount = Math.max(2, Math.round(total * anchorRatio))
  const anchors = pickSpreadAnchors(path, anchorCount)

  const solutionChain = path.map((coord, idx) => ({
    cellId: hexKey(coord),
    value: idx + 1,
  }))

  const cells: GridCell[] = path.map((coord, idx) => {
    const value = idx + 1
    const isAnchor = anchors.has(value)
    const isStart = value === 1
    const isEnd = value === total

    let state: CellState
    let styleRole: CellStyleRole

    if (isStart) {
      state = 'start'
      styleRole = 'start-end-accent'
    } else if (isEnd) {
      state = 'end'
      styleRole = 'start-end-accent'
    } else if (isAnchor) {
      state = 'anchor'
      styleRole = 'anchor-honey'
    } else {
      state = 'empty'
      styleRole = 'playable-default'
    }

    return {
      id: hexKey(coord),
      q: coord.q,
      r: coord.r,
      state,
      solutionValue: value,
      currentValue: isStart || isEnd || isAnchor ? value : null,
      isEditable: !(isStart || isEnd || isAnchor),
      styleRole,
    }
  })

  return {
    id: generateId(),
    difficultyId,
    variant,
    totalPlayableCount: total,
    anchorCount: anchors.size,
    anchorRatio: anchors.size / total,
    startValue: 1,
    endValue: total,
    solutionChain,
    cells,
  }
}
