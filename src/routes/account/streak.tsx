import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  RotateCcw,
  Trophy,
} from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import {
  calculateStreak,
  calculateBestStreak,
  getUniqueCompletedDates,
  getWeeklyActivity,
} from '@/lib/streak'
import { Button } from '@/components/ui/button'

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

  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [showExplanation, setShowExplanation] = useState(false)

  const totalActiveDays = uniqueDates.length

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
    <div className="mx-auto max-w-2xl space-y-3 p-4 sm:space-y-4 sm:p-6">
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
        <h1 className="flex-1 text-xl font-bold tracking-tight text-gray-900">
          Streak
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date())}
          aria-label="Refresh"
          className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Streak Summary Card */}
      <div className="rounded-2xl border border-orange-200/60 bg-orange-50/40 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Current Streak */}
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

          {/* Divider */}
          <div className="h-10 w-px bg-orange-200/60" />

          {/* Best Streak */}
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

      {/* Streak Progress — Weekly */}
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

      {/* How Streaks Work — Collapsible */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <span className="text-sm font-semibold text-gray-900">
            How do streaks work?
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              showExplanation ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showExplanation && (
          <div className="border-t border-gray-100 px-4 pb-4 pt-3">
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-xs text-gray-500">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                Complete at least one activity each day to build your streak.
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-500">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                Each day you do an activity, your streak increases.
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-500">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                Missing a day will reset your streak to 0.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Monthly Calendar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 rounded-full text-orange-600 hover:bg-orange-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">{monthLabel}</h2>
            {!isCurrentMonth && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="h-6 rounded-full bg-orange-100 px-2 text-[10px] font-bold text-orange-700 hover:bg-orange-200"
              >
                <RotateCcw className="h-3 w-3" />
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
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7">
          {dayHeaders.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400"
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
              <div key={day} className="flex justify-center py-0.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                    isCompleted || isToday
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600'
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
