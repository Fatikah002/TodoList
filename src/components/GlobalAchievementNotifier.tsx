import { useAchievements } from '@/hooks/useAchievements'

export function GlobalAchievementNotifier() {
  useAchievements()
  return null
}
