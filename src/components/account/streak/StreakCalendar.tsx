import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { formatLocalDate } from '@/lib/date'
import { Button } from '@/components/ui/button'

type StreakCalendarProps = {
  completedSet: Set<string>
}

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

const DAY_HEADERS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function StreakCalendar({ completedSet }: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())

  const { firstDay, totalDays } = getDaysInMonth(currentMonth)
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const todayStr = formatLocalDate(new Date())

  const monthLabel = currentMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const isCurrentMonth =
    currentMonth.getFullYear() === new Date().getFullYear() &&
    currentMonth.getMonth() === new Date().getMonth()

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

  return (
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
        {DAY_HEADERS.map((d) => (
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
  )
}
