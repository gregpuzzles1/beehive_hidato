import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { ThemePreference } from '../../types/puzzle'

interface ThemeContextValue {
  theme: ThemePreference
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'beehive-hidato-theme'

function loadTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark') {
      return { mode: 'dark', source: 'user' }
    }
    if (stored === 'light') {
      return { mode: 'light', source: 'user' }
    }
  } catch {
    // localStorage unavailable
  }
  return { mode: 'light', source: 'default' }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>(loadTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.mode)
    try {
      localStorage.setItem(STORAGE_KEY, theme.mode)
    } catch {
      // localStorage unavailable
    }
  }, [theme.mode])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => ({
      mode: prev.mode === 'light' ? 'dark' : 'light',
      source: 'user',
    }))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
