import type { DayActivity } from '@/lib/streak'

type WeeklyProgressProps = {
  weeklyActivity: DayActivity[]
  totalActiveDays: number
}

export function WeeklyProgress({ weeklyActivity, totalActiveDays }: WeeklyProgressProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">
        Streak Progress
      </h2>

      <div className="flex items-center justify-between">
        {weeklyActivity.map((day) => (
          <div key={day.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                day.completed
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {day.completed ? '✓' : '○'}
            </div>
            <span className="text-[10px] font-medium text-gray-400">
              {day.shortLabel}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs font-medium text-gray-500">
          Total Active Days
        </span>
        <span className="text-sm font-bold tabular-nums text-gray-900">
          {totalActiveDays}
        </span>
      </div>
    </div>
  )
}
