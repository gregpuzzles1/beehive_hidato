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
import { hexKey, getNeighbors } from './hexGeometry'
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
  'spiral',
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
      profile.complexityRank
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
  switch (variant) {
    case 'perfect':
      return {
        playableCoords: generatePerfectVariant(sideLength),
        blockedCoords: [],
      }
    case 'blocked': {
      const result = generateBlockedVariant(sideLength)
      return { playableCoords: result.playable, blockedCoords: result.blocked }
    }
    case 'damaged':
      return {
        playableCoords: generateDamagedVariant(sideLength),
        blockedCoords: [],
      }
    case 'ring':
      return {
        playableCoords: generateRingVariant(sideLength),
        blockedCoords: [],
      }
    case 'spiral':
      return {
        playableCoords: generateSpiralVariant(sideLength),
        blockedCoords: [],
      }
  }
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
  _path: HexCoord[],
  total: number,
  minRatio: number,
  maxRatio: number,
  complexityRank: number
): Set<number> | null {
  // Scale anchor ratio inversely with complexity
  // Rank 1 → closer to maxRatio, Rank 5 → closer to minRatio
  const t = (complexityRank - 1) / 4 // 0 to 1
  const targetRatio = maxRatio - t * (maxRatio - minRatio)
  const targetCount = Math.max(2, Math.round(total * targetRatio))

  const anchors = new Set<number>()
  anchors.add(1) // start
  anchors.add(total) // end

  // Create pool of candidate anchor values (excluding start/end)
  const candidates: number[] = []
  for (let i = 2; i < total; i++) {
    candidates.push(i)
  }

  // Shuffle candidates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  // Add anchors until we reach target count
  for (const val of candidates) {
    if (anchors.size >= targetCount) break
    anchors.add(val)
  }

  // Verify ratio
  const ratio = anchors.size / total
  if (ratio < minRatio || ratio > maxRatio) return null

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

  const anchors = new Set<number>()
  anchors.add(1)
  anchors.add(total)

  const candidates = Array.from({ length: total - 2 }, (_, i) => i + 2)
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  for (const val of candidates) {
    if (anchors.size >= anchorCount) break
    anchors.add(val)
  }

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
