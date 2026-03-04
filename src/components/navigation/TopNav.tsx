import { Link } from 'react-router-dom'
import type { DifficultyId } from '../../types/puzzle'

interface TopNavProps {
  context: 'home' | 'gameplay' | 'how-to-play' | 'contact'
  currentDifficulty?: DifficultyId
}

export function TopNav({ context }: TopNavProps) {
  return (
    <nav className="top-nav" role="navigation" aria-label="Page navigation">
      <div className="top-nav__links">
        {context !== 'home' && (
          <Link to="/" className="top-nav__link">
            Home
          </Link>
        )}
        {context !== 'how-to-play' && (
          <Link to="/how-to-play" className="top-nav__link">
            How to Play
          </Link>
        )}
        {context !== 'contact' && (
          <Link to="/contact" className="top-nav__link">
            Contact
          </Link>
        )}
      </div>
    </nav>
  )
}
