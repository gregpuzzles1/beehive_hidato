import { HashRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { ThemeProvider } from '../features/theme/ThemeProvider'

export function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </HashRouter>
  )
}
