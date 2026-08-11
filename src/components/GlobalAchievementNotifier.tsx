import { useAchievements } from '@/hooks/useAchievements'
import { CelebrationModal } from './account/CelebrationModal'

export function GlobalAchievementNotifier() {
  const { activeModalAchievement, isCelebration, closeModal } =
    useAchievements()
  return (
    <CelebrationModal
      achievement={activeModalAchievement}
      isCelebration={isCelebration}
      onClose={closeModal}
    />
  )
}
