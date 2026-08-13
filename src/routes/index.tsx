import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const navigate = useNavigate()
  useEffect(() => {
    const isCompleted = localStorage.getItem('todospace_onboarding_completed') === 'true'
    if (!isCompleted) {
      navigate({ to: '/onboarding' })
    } else {
      navigate({ to: '/dashboard', search: { view: 'dashboard' } })
    }
  }, [navigate])
  return null
}
