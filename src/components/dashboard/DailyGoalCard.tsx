import { useEffect } from 'react'
import { Target } from 'lucide-react'
import { toast } from 'sonner'
import { useTodos } from '@/hooks/useTodos'
import { getDailyGoalInfo } from '@/lib/dailyGoal'

export function DailyGoalCard() {
  const { todos } = useTodos()
  const goal = getDailyGoalInfo(todos)
const DAILY_GOAL_CELEBRATED_KEY = 'daily-goal-celebrated'

useEffect(() => {
  if (!goal.isComplete) return

  const today = new Date().toISOString().split('T')[0]

  const saved = JSON.parse(
    localStorage.getItem(DAILY_GOAL_CELEBRATED_KEY) ?? '{}',
  )

  if (
    saved.date === today &&
    saved.progress >= goal.progress
  ) {
    return
  }

  toast.success('Daily Goal Complete! 🎉', {
    description: 'Amazing! You finished all your tasks for today.',
  })

  localStorage.setItem(
    DAILY_GOAL_CELEBRATED_KEY,
    JSON.stringify({
      date: today,
      progress: goal.progress,
    }),
  )
}, [goal.isComplete, goal.progress])

  if (goal.isEmpty) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-100/50 p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
            Daily Goal
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          No tasks scheduled for today.
        </p>
      </div>
    )
  }

  const remaining = goal.target - goal.progress

  return (
    <div className="rounded-2xl shadow-sm border border-green-200 bg-green-100/50 p-4  sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
            Daily Goal
          </span>
        </div>
        {goal.isComplete}
      </div>

      <p className="mt-2 text-sm text-gray-700">
        <span className="font-bold">{goal.progress}</span> / {goal.target} tasks
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${goal.percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {goal.isComplete
          ? ' Daily Goal Complete!'
          : `${remaining} more task${remaining !== 1 ? 's' : ''} to reach your goal today!`}
      </p>
    </div>
  )
}
