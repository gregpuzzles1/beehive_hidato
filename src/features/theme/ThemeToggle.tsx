import { useTheme } from './ThemeProvider'
import './ThemeToggle.css'

/**
 * Global theme toggle button for switching between light and dark modes.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme.mode === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
