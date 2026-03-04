import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { HomePage } from '../pages/HomePage'
import { DifficultyPage } from '../pages/DifficultyPage'
import { HowToPlayPage } from '../pages/HowToPlayPage'
import { ContactPage } from '../pages/ContactPage'
import { NotFoundPage } from '../pages/NotFoundPage'

const DIFFICULTY_SLUGS = [
  'gentle-flow',
  'thoughtful',
  'strategic',
  'architect',
  'queens-challenge',
] as const

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        {DIFFICULTY_SLUGS.map((slug) => (
          <Route
            key={slug}
            path={slug}
            element={<DifficultyPage slug={slug} />}
          />
        ))}
        <Route path="how-to-play" element={<HowToPlayPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
