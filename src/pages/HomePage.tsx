import { Link } from 'react-router-dom'
import { TopNav } from '../components/navigation/TopNav'
import '../components/navigation/TopNav.css'
import './HomePage.css'

const DIFFICULTIES = [
  { slug: 'gentle-flow', label: 'Gentle Flow', emoji: '🟢' },
  { slug: 'thoughtful', label: 'Thoughtful', emoji: '🔵' },
  { slug: 'strategic', label: 'Strategic', emoji: '🔴' },
  { slug: 'architect', label: 'Architect', emoji: '🟣' },
  { slug: 'queens-challenge', label: "Queen's Challenge", emoji: '🐝' },
] as const

export function HomePage() {
  return (
    <div className="home-page">
      <TopNav context="home" />
      <header className="home-page__header">
        <h1 className="home-page__title">🐝 Beehive Hidato</h1>
        <p className="home-page__subtitle">
          Choose your challenge and solve hexagonal number puzzles!
        </p>
      </header>
      <nav
        className="home-page__difficulties"
        aria-label="Difficulty selection"
      >
        {DIFFICULTIES.map(({ slug, label, emoji }) => (
          <Link
            key={slug}
            to={`/${slug}`}
            className="difficulty-card"
            aria-label={`Play ${label} difficulty`}
          >
            <span className="difficulty-card__emoji" aria-hidden="true">
              {emoji}
            </span>
            <span className="difficulty-card__label">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
