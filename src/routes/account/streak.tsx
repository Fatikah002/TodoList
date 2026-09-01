import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft} from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import {
  calculateStreak,
  calculateBestStreak,
  getUniqueCompletedDates,
  getWeeklyActivity,
} from '@/lib/streak'
import { Button } from '@/components/ui/button'
import { StreakSummaryCard } from '@/components/account/streak/StreakSummaryCard'
import { WeeklyProgress } from '@/components/account/streak/WeeklyProgress'
import { StreakExplanation } from '@/components/account/streak/StreakExplanation'
import { StreakCalendar } from '@/components/account/streak/StreakCalendar'

export const Route = createFileRoute('/account/streak')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { todos } = useTodos()
  const streak = calculateStreak(todos)
  const bestStreak = calculateBestStreak(todos)
  const uniqueDates = getUniqueCompletedDates(todos)
  const completedSet = new Set(uniqueDates)
  const weeklyActivity = getWeeklyActivity(todos)
  const totalActiveDays = uniqueDates.length

  return (
    <div className="flex flex-1 flex-col">
    <div className="mx-auto w-full max-w-6xl space-y-3 px-8 py-8 sm:px-8 sm:py-8 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/account' })}
          aria-label="Back to profile"
          className="rounded-full text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-xl font-bold tracking-tight text-gray-900">
          Streak
        </h1>
      </div>

      <StreakSummaryCard streak={streak} bestStreak={bestStreak} />
      <WeeklyProgress weeklyActivity={weeklyActivity} totalActiveDays={totalActiveDays} />
      <StreakExplanation />
      <StreakCalendar completedSet={completedSet} />
    </div>
    </div>
  )
}
