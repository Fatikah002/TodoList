import { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation } from '@tanstack/react-router'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { BadgeIcon } from '@/components/account/BadgeIcon'
import { triggerFireworks } from '@/components/ui/confetti'
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  getUnlockedAchievementIds,
  saveUnlockedAchievementId,
} from '@/lib/achievements'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Achievement, AchievementFilter } from '@/lib/achievements'

const toastThemeByColor = {
  green: {
    card: 'from-emerald-50 via-white to-emerald-50',
    border: 'border-emerald-300/90',
    accent: 'text-emerald-600',
    accentStrong: 'text-emerald-700',
    pillBg: 'bg-emerald-100 text-emerald-700',
    glow: 'bg-emerald-200/35',
  },
  orange: {
    card: 'from-orange-50 via-white to-rose-50',
    border: 'border-orange-300/90',
    accent: 'text-orange-500',
    accentStrong: 'text-orange-600',
    pillBg: 'bg-orange-100 text-orange-600',
    glow: 'bg-orange-200/35',
  },
  purple: {
    card: 'from-violet-50 via-white to-purple-50',
    border: 'border-violet-300/90',
    accent: 'text-violet-500',
    accentStrong: 'text-violet-600',
    pillBg: 'bg-violet-100 text-violet-600',
    glow: 'bg-violet-200/35',
  },
  gold: {
    card: 'from-amber-50 via-white to-yellow-50',
    border: 'border-amber-300/90',
    accent: 'text-amber-500',
    accentStrong: 'text-amber-600',
    pillBg: 'bg-amber-100 text-amber-700',
    glow: 'bg-amber-200/35',
  },
  blue: {
    card: 'from-sky-50 via-white to-blue-50',
    border: 'border-sky-300/90',
    accent: 'text-sky-500',
    accentStrong: 'text-sky-600',
    pillBg: 'bg-sky-100 text-sky-700',
    glow: 'bg-sky-200/35',
  },
  indigo: {
    card: 'from-indigo-50 via-white to-violet-50',
    border: 'border-indigo-300/90',
    accent: 'text-indigo-500',
    accentStrong: 'text-indigo-600',
    pillBg: 'bg-indigo-100 text-indigo-700',
    glow: 'bg-indigo-200/35',
  },
  teal: {
    card: 'from-cyan-50 via-white to-teal-50',
    border: 'border-cyan-300/90',
    accent: 'text-cyan-500',
    accentStrong: 'text-cyan-600',
    pillBg: 'bg-cyan-100 text-cyan-700',
    glow: 'bg-cyan-200/35',
  },
  amber: {
    card: 'from-amber-50 via-white to-orange-50',
    border: 'border-yellow-300/90',
    accent: 'text-yellow-500',
    accentStrong: 'text-yellow-600',
    pillBg: 'bg-yellow-100 text-yellow-700',
    glow: 'bg-yellow-200/35',
  },
} satisfies Record<
  Achievement['accentColor'],
  {
    card: string
    border: string
    accent: string
    accentStrong: string
    pillBg: string
    glow: string
  }
>

export function useAchievements() {
  const { todos } = useTodos()
  const location = useLocation()
  const emailRef = useRef<string>(
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL) ?? ''
      : '',
  )
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() =>
    getUnlockedAchievementIds(emailRef.current),
  )
  const [filter, setFilter] = useState<AchievementFilter>('All')

  const isInitialMount = useRef(true)
  const skipCheckRef = useRef(false)

  // Re-load achievements when email changes (login/logout)
  useEffect(() => {
    function handleEmailChange() {
      const currentEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL) ?? ''
      if (currentEmail !== emailRef.current) {
        emailRef.current = currentEmail
        skipCheckRef.current = true
        setUnlockedIds(getUnlockedAchievementIds(currentEmail))
      }
    }

    window.addEventListener('storage', handleEmailChange)
    window.addEventListener('email-changed', handleEmailChange)
    return () => {
      window.removeEventListener('storage', handleEmailChange)
      window.removeEventListener('email-changed', handleEmailChange)
    }
  }, [])

  const email = emailRef.current

  // Check achievements against current todos
  useEffect(() => {
    if (skipCheckRef.current) {
      skipCheckRef.current = false
      return
    }

    if (location.pathname === '/login') {
      return
    }

    let newlyUnlocked: Achievement | null = null
    let updatedIds = [...unlockedIds]

    for (const achievement of ACHIEVEMENTS) {
      if (updatedIds.includes(achievement.id)) continue

      const progress = getAchievementProgress(achievement, todos)
      if (progress >= achievement.target) {
        updatedIds = saveUnlockedAchievementId(achievement.id, email)
        if (!isInitialMount.current) {
          newlyUnlocked = achievement
        }
      }
    }

    if (updatedIds.length !== unlockedIds.length) {
      setUnlockedIds(updatedIds)
    }

    if (newlyUnlocked) {
      triggerFireworks()
      const theme = toastThemeByColor[newlyUnlocked.accentColor]

      toast.custom(
        () => (
          <div className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border ${theme.border} bg-gradient-to-r ${theme.card} px-4 py-3 shadow-[0_18px_34px_-20px_rgba(0,0,0,0.18)] backdrop-blur-sm`}>
            <div className={`pointer-events-none absolute left-0 top-0 h-full w-1 ${theme.glow}`} />

            <div className="relative flex shrink-0 items-center justify-center">
              <BadgeIcon
                iconType={newlyUnlocked.iconType}
                accentColor={newlyUnlocked.accentColor}
                isUnlocked
                size="md"
              />
              <span className={`absolute -left-1 top-0 text-[10px] ${theme.accent}`}>✦</span>
              <span className={`absolute -right-1 bottom-0 text-[10px] ${theme.accent}`}>✦</span>
            </div>

            <div className="min-w-0 flex-1 pr-8">
              <p className={`text-[11px] font-extrabold uppercase tracking-[0.18em] ${theme.accent}`}>
                Achievement Unlocked!
              </p>
              <h4 className="mt-1 truncate text-[15px] font-bold text-green-ink">
                {newlyUnlocked.title}
              </h4>
              <p className="mt-1 truncate text-xs text-green-ink-soft">
                {newlyUnlocked.description}
              </p>
            </div>

            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${theme.pillBg}`}>
              +{newlyUnlocked.rewardXp} XP
            </span>

            <button
              type="button"
              aria-label="Dismiss achievement toast"
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-green-ink-soft transition hover:bg-black/5 hover:text-green-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
        { duration: 4000 },
      )
    }

    isInitialMount.current = false
  }, [todos, unlockedIds])

  const achievementsWithStatus = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => {
      const isUnlocked = unlockedIds.includes(achievement.id)
      const progress = getAchievementProgress(achievement, todos)
      return {
        ...achievement,
        isUnlocked,
        progress,
      }
    })
  }, [todos, unlockedIds])

  const filteredAchievements = useMemo(() => {
    return achievementsWithStatus.filter((item) => {
      if (filter === 'Completed') return item.isUnlocked
      if (filter === 'Locked') return !item.isUnlocked
      if (filter === 'In Progress')
        return !item.isUnlocked && item.progress > 0
      return true
    })
  }, [achievementsWithStatus, filter])

  const unlockedCount = useMemo(() => achievementsWithStatus.filter((a) => a.isUnlocked).length, [achievementsWithStatus])
  const totalCount = ACHIEVEMENTS.length
  const overallPercentage = Math.round((unlockedCount / totalCount) * 100)

  return {
    achievements: filteredAchievements,
    allAchievements: achievementsWithStatus,
    unlockedIds,
    unlockedCount,
    totalCount,
    overallPercentage,
    filter,
    setFilter,
  }
}
