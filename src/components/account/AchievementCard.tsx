import type { Achievement } from '@/lib/achievements'
import { BadgeIcon } from './BadgeIcon'
import {  Lock, LockOpen } from 'lucide-react'

type AchievementCardProps = {
  achievement: Achievement & {
    isUnlocked: boolean
    progress: number
  }
  onSelect: (achievement: Achievement) => void
}

export function AchievementCard({
  achievement,
  onSelect,
}: AchievementCardProps) {
  const percentage = Math.min(
    100,
    Math.round((achievement.progress / achievement.target) * 100),
  )

  return (
    <div
      onClick={() => onSelect(achievement)}
      className={`group relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-200 active:scale-[0.99] ${
        achievement.isUnlocked
          ? 'border-green-100 bg-white shadow-xs hover:border-green-300 hover:shadow-md'
          : 'border-gray-200 bg-white/90 shadow-xs hover:border-gray-300'
      }`}
    >
      {/* Badge Illustration */}
      <BadgeIcon
        iconType={achievement.iconType}
        accentColor={achievement.accentColor}
        isUnlocked={achievement.isUnlocked}
        size="md"
      />

      {/* Details & Progress */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-bold text-gray-900">
            {achievement.title}
          </h3>
          <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
            +{achievement.rewardXp} XP
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs text-gray-500">
          {achievement.description}
        </p>

        {/* Progress Fraction & Bar */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span
              className={
                achievement.isUnlocked
                  ? 'text-green-600'
                  : achievement.progress > 0
                    ? 'text-green-600'
                    : 'text-gray-400'
              }
            >
              {achievement.progress} / {achievement.target}
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                achievement.isUnlocked
                  ? 'bg-green-500'
                  : 'bg-green-500/70'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Unlocked / Locked Icon Indicator */}
      <div className="shrink-0">
        {achievement.isUnlocked ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white shadow-xs">
            <LockOpen size={18} className="fill-green-500 text-white" />
          </div>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400">
            <Lock size={14} />
          </div>
        )}
      </div>
    </div>
  )
}
