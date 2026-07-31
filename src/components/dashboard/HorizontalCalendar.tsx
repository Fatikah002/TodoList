import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatLocalDate } from '@/lib/date'
import type { Todo } from '@/lib/types'
import { useSettings } from '@/hooks/useSettings'

type HorizontalCalendarProps = {
  selectedDate: string
  onDateChange: (date: string) => void
  todos: Todo[]
  showAllTasks: boolean
}

export function HorizontalCalendar({
  selectedDate,
  onDateChange,
  showAllTasks, 
  todos
}: HorizontalCalendarProps) {
  const { settings } = useSettings()
  const isMondayStart = settings.startOfWeek === 'monday'
  const daysOfWeek = isMondayStart
    ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const [currentWeek, setCurrentWeek] = useState(new Date())

  const previousWeek = () => {
    setCurrentWeek(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7),
    )
  }

  const nextWeek = () => {
    setCurrentWeek(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7),
    )
  }

  const calendarDays = useMemo(() => {
    const currentDay = currentWeek.getDay()
    const weekStartDay = isMondayStart ? 1 : 0
    const dayOffset = (weekStartDay - currentDay + 7) % 7

    const startOfWeekDate = new Date(
      currentWeek.getFullYear(),
      currentWeek.getMonth(),
      currentWeek.getDate() - dayOffset,
    )

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(
        startOfWeekDate.getFullYear(),
        startOfWeekDate.getMonth(),
        startOfWeekDate.getDate() + index,
      )

      return {
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        fullDate: formatLocalDate(date),
      }
    })
  }, [currentWeek, isMondayStart])

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={previousWeek}
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold">
          {currentWeek.toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>

        <button
          onClick={nextWeek}
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar */}
      <div className="overflow-x-hidden">
        <div className="mx-auto grid w-full grid-cols-7 gap-1 py-2 sm:gap-3">
          {calendarDays.map((item) => {
            const isSelected = item.fullDate === selectedDate

            const hasTodo = todos.some((todo) => todo.deadline === item.fullDate && (showAllTasks || !todo.completed))
            return (
              <button
                key={item.fullDate}
                onClick={() => onDateChange(item.fullDate)}
                className={`flex w-fit justify-self-center  flex-col items-center gap-1 rounded-full px-1 py-2 transition-all duration-200 sm:gap-3 sm:px-2 sm:py-3 ${
                  isSelected
                    ? 'outline outline-1 outline-green-600/40'
                    : 'border border-transparent'
                }`}
              >
                <span
                  className={`text-xs sm:text-sm ${
                    isSelected
                      ? 'font-semibold text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {item.day}
                </span>

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold sm:h-10 sm:w-10 sm:text-sm ${
                    isSelected
                      ? 'bg-green-600 text-white'
                      : hasTodo && showAllTasks
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.date}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
