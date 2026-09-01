import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { STORAGE_KEYS } from '@/lib/constants'

const DEFAULT_AVATAR = '/avatar.png'

type Profile = {
  name: string
  email: string
  avatar: string
}

type ProfileContextType = {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

const defaultProfile: Profile = {
  name: '',
  email: '',
  avatar: DEFAULT_AVATAR,
}

const ProfileContext = createContext<ProfileContextType | null>(null)

function isValidProfile(data: unknown): data is Profile {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'email' in data &&
    'avatar' in data &&
    typeof (data as Profile).name === 'string' &&
    typeof (data as Profile).email === 'string' &&
    typeof (data as Profile).avatar === 'string'
  )
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (isValidProfile(parsed)) {
          setProfile(parsed)
        } else {
          localStorage.removeItem(STORAGE_KEYS.PROFILE)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.PROFILE)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
    } catch {
      // ignore storage errors
    }
  }, [profile])

  function updateProfile(updates: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export { DEFAULT_AVATAR }
export type { Profile }
