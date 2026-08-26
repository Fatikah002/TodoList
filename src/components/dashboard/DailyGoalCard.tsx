import { useEffect } from 'react'
import {  MoreVertical } from 'lucide-react'
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

    if (saved.date === today && saved.progress >= goal.progress) {
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

  const target = goal.target || 3
  const progress = goal.progress
  const percentage = goal.percentage

  return (
    <div className="rounded-2xl border border-gray-200 p-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            Daily Goal
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Complete {target} tasks today
      </p>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-xl font-bold text-green-600">
          {progress} / {target}
        </p>
        <span className="text-xs font-semibold text-green-600">
          {percentage}%
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
