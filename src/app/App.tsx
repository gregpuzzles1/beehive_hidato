import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { ThemeProvider } from '../features/theme/ThemeProvider'

export function App() {
  return (
    <BrowserRouter basename="/beehive_hidato">
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </BrowserRouter>
  )
}
