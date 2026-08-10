import { Check } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { calculateStreak, getWeeklyActivity } from '@/lib/streak'

export function StreakCard() {
  const { todos } = useTodos()
  const streak = calculateStreak(todos)
  const weeklyActivity = getWeeklyActivity(todos)

  return (
    <div className="rounded-2xl shadow-sm border border-orange-200 bg-orange-100/50 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔥</span>
          <div>
            <p className="text-3xl font-bold text-orange-500">{streak}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
              Day Streak
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">
            Keep going! 
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {streak > 0
              ? 'Complete a task today to keep your streak alive.'
              : 'Complete a task today to start your streak!'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {weeklyActivity.map((day) => (
          <div key={day.label} className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-medium text-gray-500">
              {day.shortLabel}
            </span>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                day.completed
                  ? 'bg-orange-500 text-white'
                  : 'border-2 border-gray-200 bg-white'
              }`}
            >
              {day.completed && <Check className="h-4 w-4" strokeWidth={3} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
