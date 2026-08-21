import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const navigate = useNavigate()
  useEffect(() => {
    const isCompleted = localStorage.getItem('todospace_onboarding_completed') === 'true'
    const isLoggedIn = localStorage.getItem('todospace_logged_in') === 'true'
    if (!isCompleted) {
      navigate({ to: '/onboarding' })
    } else if (!isLoggedIn) {
      navigate({ to: '/login' })
    } else {
      navigate({ to: '/dashboard', search: { view: 'dashboard' } })
    }
  }, [navigate])
  return null
}
