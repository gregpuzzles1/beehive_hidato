import { Outlet } from 'react-router-dom'
import { Footer } from '../../components/footer/Footer'
import { ThemeToggle } from '../../features/theme/ThemeToggle'

export function AppLayout() {
  return (
    <div className="app-layout">
      <ThemeToggle />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
