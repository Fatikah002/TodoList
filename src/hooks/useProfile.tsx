import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

const DEFAULT_AVATAR = '/avatar.png'

type Profile = {
  name: string
  email: string
  avatar: string
  password: string
}

type ProfileContextType = {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

const defaultProfile: Profile = {
  name: '',
  email: '',
  avatar: DEFAULT_AVATAR,
  password: '',
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile)

  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setProfile((prev) => ({ ...prev, ...parsed }))
      } catch {
        localStorage.removeItem('profile')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile))
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
