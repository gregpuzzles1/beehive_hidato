import type { DifficultyProfile, DifficultyId } from '../../../types/puzzle'

export const DIFFICULTY_PROFILES: Record<DifficultyId, DifficultyProfile> = {
  'gentle-flow': {
    id: 'gentle-flow',
    label: 'Gentle Flow',
    emoji: '🟢',
    slug: 'gentle-flow',
    perfectHiveSideLength: 3,
    complexityRank: 1,
    minAnchorRatio: 0.32,
    maxAnchorRatio: 0.48,
  },
  thoughtful: {
    id: 'thoughtful',
    label: 'Thoughtful',
    emoji: '🔵',
    slug: 'thoughtful',
    perfectHiveSideLength: 4,
    complexityRank: 2,
    minAnchorRatio: 0.32,
    maxAnchorRatio: 0.48,
  },
  strategic: {
    id: 'strategic',
    label: 'Strategic',
    emoji: '🔴',
    slug: 'strategic',
    perfectHiveSideLength: 5,
    complexityRank: 3,
    minAnchorRatio: 0.32,
    maxAnchorRatio: 0.48,
  },
  architect: {
    id: 'architect',
    label: 'Architect',
    emoji: '🟣',
    slug: 'architect',
    perfectHiveSideLength: 6,
    complexityRank: 4,
    minAnchorRatio: 0.32,
    maxAnchorRatio: 0.48,
  },
  'queens-challenge': {
    id: 'queens-challenge',
    label: "Queen's Challenge",
    emoji: '🐝',
    slug: 'queens-challenge',
    perfectHiveSideLength: 6,
    complexityRank: 5,
    minAnchorRatio: 0.32,
    maxAnchorRatio: 0.48,
  },
} as const

export const DIFFICULTY_ORDER: DifficultyId[] = [
  'gentle-flow',
  'thoughtful',
  'strategic',
  'architect',
  'queens-challenge',
]
