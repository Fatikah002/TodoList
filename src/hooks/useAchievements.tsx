import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useTodos } from '@/hooks/useTodos'
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  getUnlockedAchievementIds,
  saveUnlockedAchievementId,
} from '@/lib/achievements'
import { triggerFireworks } from '@/components/ui/confetti'

export function useAchievements() {
  const { todos } = useTodos()
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() =>
    getUnlockedAchievementIds(),
  )
  const [filter, setFilter] = useState<AchievementFilter>('All')
  const [activeModalAchievement, setActiveModalAchievement] =
    useState<Achievement | null>(null)
  const [isCelebration, setIsCelebration] = useState<boolean>(false)

  const isInitialMount = useRef(true)

  // Check achievements against current todos
  useEffect(() => {
    let newlyUnlocked: Achievement | null = null
    let updatedIds = [...unlockedIds]

    for (const achievement of ACHIEVEMENTS) {
      if (updatedIds.includes(achievement.id)) continue

      const progress = getAchievementProgress(achievement, todos)
      if (progress >= achievement.target) {
        updatedIds = saveUnlockedAchievementId(achievement.id)
        if (!isInitialMount.current) {
          newlyUnlocked = achievement
        }
      }
    }

    if (updatedIds.length !== unlockedIds.length) {
      setUnlockedIds(updatedIds)
    }

    if (newlyUnlocked) {
      setActiveModalAchievement(newlyUnlocked)
      setIsCelebration(true)

      // Trigger Magic UI Fireworks confetti animation
      triggerFireworks()

      toast.custom(
        () => (
          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-white p-4 shadow-lg">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <span className="text-xl">🏆</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                Achievement Unlocked!
              </p>
              <h4 className="text-sm font-bold text-gray-900">
                {newlyUnlocked.title}
              </h4>
              <p className="text-xs text-gray-500">{newlyUnlocked.description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
              +{newlyUnlocked.rewardXp} XP
            </span>
          </div>
        ),
        { duration: 4000 },
      )
    }

    isInitialMount.current = false
  }, [todos, unlockedIds])

  const achievementsWithStatus = ACHIEVEMENTS.map((achievement) => {
    const isUnlocked = unlockedIds.includes(achievement.id)
    const progress = getAchievementProgress(achievement, todos)
    return {
      ...achievement,
      isUnlocked,
      progress,
    }
  })

  const filteredAchievements = achievementsWithStatus.filter((item) => {
    if (filter === 'Completed') return item.isUnlocked
    if (filter === 'Locked') return !item.isUnlocked
    if (filter === 'In Progress')
      return !item.isUnlocked && item.progress > 0
    return true
  })

  const unlockedCount = achievementsWithStatus.filter((a) => a.isUnlocked).length
  const totalCount = ACHIEVEMENTS.length
  const overallPercentage = Math.round((unlockedCount / totalCount) * 100)

  function openDetail(achievement: Achievement) {
    setActiveModalAchievement(achievement)
    setIsCelebration(false)
  }

  function closeModal() {
    setActiveModalAchievement(null)
    setIsCelebration(false)
  }

  return {
    achievements: filteredAchievements,
    allAchievements: achievementsWithStatus,
    unlockedIds,
    unlockedCount,
    totalCount,
    overallPercentage,
    filter,
    setFilter,
    activeModalAchievement,
    isCelebration,
    openDetail,
    closeModal,
  }
}
