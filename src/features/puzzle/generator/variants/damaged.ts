import type { HexCoord } from '../../../../types/puzzle'
import { generatePerfectHexGrid, hexDistance } from '../hexGeometry'

/**
 * Damaged hive variant: removes a random cluster of edge cells
 * to create an irregular boundary, simulating damage.
 */
export function generateDamagedVariant(sideLength: number): HexCoord[] {
  const allCells = generatePerfectHexGrid(sideLength)
  const n = sideLength - 1

  // Find edge cells (cells on the perimeter)
  const edgeCells = allCells.filter((c) => {
    const dist = hexDistance(c, { q: 0, r: 0 })
    return dist === n
  })

  // Remove 20-35% of edge cells randomly as "damage"
  const removeCount = Math.max(
    1,
    Math.floor(edgeCells.length * (0.2 + Math.random() * 0.15))
  )

  // Pick a starting edge cell and remove a cluster
  const startIdx = Math.floor(Math.random() * edgeCells.length)
  const toRemove = new Set<string>()

  // Use BFS from a random edge cell to get a contiguous cluster
  const queue = [edgeCells[startIdx]]
  const edgeSet = new Set(edgeCells.map((c) => `${c.q},${c.r}`))

  while (toRemove.size < removeCount && queue.length > 0) {
    const current = queue.shift()!
    const key = `${current.q},${current.r}`
    if (toRemove.has(key)) continue
    toRemove.add(key)

    // Add neighboring edge cells
    const neighbors = edgeCells.filter(
      (e) =>
        !toRemove.has(`${e.q},${e.r}`) &&
        edgeSet.has(`${e.q},${e.r}`) &&
        hexDistance(current, e) === 1
    )
    // Shuffle neighbors for randomness
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]]
    }
    queue.push(...neighbors)
  }

  return allCells.filter((c) => !toRemove.has(`${c.q},${c.r}`))
}
