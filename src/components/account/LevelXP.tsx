import { Star } from 'lucide-react'
import type { ProgressInfo } from '@/lib/xp'

type ProgressCardProps = {
  info: ProgressInfo
}

export function ProgressCard({ info }: ProgressCardProps) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">
          LEVEL <span className="text-green-600">{info.level}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-green-500 text-green-500" />
          <span className="text-sm font-bold text-green-600">
            {info.totalXp} XP
          </span>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${info.percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs font-medium text-gray-700">
        {info.xpInCurrentLevel} /{' '}
        {info.xpForNextLevel - info.xpForCurrentLevel} XP
      </p>
      <p className="mt-0.5 text-xs text-gray-500">
        {info.xpToNextLevel} XP to Level {info.level + 1}
      </p>
    </div>
  )
}
