import { Flame, Trophy } from 'lucide-react'

type StreakSummaryCardProps = {
  streak: number
  bestStreak: number
}

export function StreakSummaryCard({ streak, bestStreak }: StreakSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-orange-200/60 bg-orange-50/40 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-orange-500">
                {streak}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-400">
                {streak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-gray-500">
              Current Streak
            </p>
          </div>
        </div>

        <div className="h-10 w-px bg-orange-200/60" />

        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
            <Trophy className="h-5 w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-green-600">
                {bestStreak}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-green-400">
                {bestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-gray-500">
              Best Streak
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-medium text-gray-400">
        Keep it going!
      </p>
    </div>
  )
}
