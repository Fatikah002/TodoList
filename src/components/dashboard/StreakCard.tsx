import { Flame } from 'lucide-react'

type StreakCardProps = {
  streak: number
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <div className="flex min-h-[105px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md sm:p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 sm:h-12 sm:w-12">
        <Flame className="h-4 w-4 text-orange-500 sm:h-6 sm:w-6" />
      </div>

      <p className="mt-1.5 text-[10px] text-gray-500 sm:text-xs text-center">
        {streak > 0 ? 'Day Streak' : 'Start your streak today!'}
      </p>

      <p className="text-base font-bold text-orange-600 sm:text-xl">
        {streak}
      </p>
    </div>
  )
}
