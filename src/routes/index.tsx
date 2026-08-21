import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { STORAGE_KEYS } from '@/lib/constants'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const navigate = useNavigate()
  useEffect(() => {
    const isCompleted = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true'
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true'
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
