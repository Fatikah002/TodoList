import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trophy,
  RotateCcw,
} from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import {
  calculateStreak,
  calculateBestStreak,
  getUniqueCompletedDates,
} from '@/lib/streak'
import { Button } from '#/components/ui/button'

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

  const [currentMonth, setCurrentMonth] = useState(() => new Date())

  const streakLabel = streak === 1 ? 'day' : 'days'
  const bestLabel = bestStreak === 1 ? 'day' : 'days'

  const description =
    streak === 0
      ? 'Complete a task today to start your streak!'
      : streak === 1
        ? 'Complete a task today to keep your streak!'
        : 'Keep completing tasks to maintain your streak!'

  const monthLabel = currentMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    return { firstDay, totalDays }
  }

  function formatDayDate(year: number, month: number, day: number) {
    const d = new Date(year, month, day)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  function prevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    )
  }

  function nextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    )
  }

  const { firstDay, totalDays } = getDaysInMonth(currentMonth)
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const todayStr = new Date().toISOString().slice(0, 10)

  const isCurrentMonth =
    currentMonth.getFullYear() === new Date().getFullYear() &&
    currentMonth.getMonth() === new Date().getMonth()

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
      {/* Header */}
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Streak
        </h1>
      </div>

      {/* Current Streak Hero Card */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 shadow-sm">
        {/* Streak Summary */}
        <div className="flex items-center gap-4">
          {/* Current Streak */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center">
              <span className="text-6xl">🔥</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-orange-500">
                  {streak}
                </span>

                <span className="text-xs font-bold uppercase tracking-wide text-orange-500">
                  {streakLabel}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-gray-600">
                Current Streak
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-orange-200" />

          {/* Best Streak */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-50">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>

            <div className="min-w-0">
              <p className="text-2xl font-bold text-green-600">
                {bestStreak}{' '}
                <span className="text-xs font-bold uppercase tracking-wide text-green-500">
                  {bestLabel}
                </span> 
                <p className="mt-0.5 text-xs font-medium text-gray-600">Best Streak</p>
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-xs text-gray-500">{description}</p>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 rounded-full text-orange-600 hover:bg-orange-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">{monthLabel}</h2>
            {!isCurrentMonth && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="h-6 rounded-full bg-orange-100 px-2.5 text-[10px] font-bold text-orange-700 hover:bg-orange-200"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 rounded-full text-orange-600 hover:bg-orange-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {dayHeaders.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[11px] font-bold text-gray-400"
            >
              {d}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1
            const dateStr = formatDayDate(year, month, day)
            const isCompleted = completedSet.has(dateStr)
            const isToday = dateStr === todayStr

            return (
              <div key={day} className="flex justify-center py-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    isCompleted
                      ? 'bg-orange-500 text-white'
                      : isToday
                        ? 'border-2 border-orange-300 text-orange-600'
                        : 'text-gray-700'
                  }`}
                >
                  {day}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
