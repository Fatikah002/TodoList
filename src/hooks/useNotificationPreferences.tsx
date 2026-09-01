import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { NotificationPreferences } from '@/lib/types'
import { STORAGE_KEYS } from '@/lib/constants'

const DEFAULT_PREFERENCES: NotificationPreferences = {
  taskDeadlineApproaching: true,
  taskOverdue: true,
  achievementUnlocked: true,
}

type NotificationPreferencesContextType = {
  preferences: NotificationPreferences
  updatePreference: (key: keyof NotificationPreferences, value: boolean) => void
}

const NotificationPreferencesContext =
  createContext<NotificationPreferencesContextType | null>(null)

export function NotificationPreferencesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFS)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences((prev) => ({ ...prev, ...parsed }))
      } catch {
        localStorage.removeItem(STORAGE_KEYS.NOTIFICATION_PREFS)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, JSON.stringify(preferences))
    } catch {
      // ignore storage errors
    }
  }, [preferences])

  function updatePreference(key: keyof NotificationPreferences, value: boolean) {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <NotificationPreferencesContext.Provider
      value={{ preferences, updatePreference }}
    >
      {children}
    </NotificationPreferencesContext.Provider>
  )
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext)
  if (!context) {
    throw new Error(
      'useNotificationPreferences must be used within a NotificationPreferencesProvider',
    )
  }
  return context
}
