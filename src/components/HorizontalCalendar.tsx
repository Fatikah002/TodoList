import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatLocalDate } from '@/lib/date'

type HorizontalCalendarProps = {
  selectedDate: string
  onDateChange: (date: string) => void
}

export function HorizontalCalendar({
  selectedDate,
  onDateChange,
}: HorizontalCalendarProps) {
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const [currentWeek, setCurrentWeek] = useState(new Date())

  const previousWeek = () => {
    setCurrentWeek(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth(),
          prev.getDate() - 7,
        ),
    )
  }

  const nextWeek = () => {
    setCurrentWeek(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth(),
          prev.getDate() + 7,
        ),
    )
  }

  const calendarDays = useMemo(() => {
    const currentDay = currentWeek.getDay()

    const mondayDiff = currentDay === 0 ? -6 : 1 - currentDay

    const startOfWeek = new Date(
      currentWeek.getFullYear(),
      currentWeek.getMonth(),
      currentWeek.getDate() + mondayDiff,
    )

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate() + index,
      )

      return {
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        fullDate: formatLocalDate(date),
      }
    })
  }, [currentWeek])

  return (
    <div className="rounded-2xl bg-white">

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
      <div className="overflow-x-auto">
        <div className="flex w-max gap-3 px-2 py-2">

          {calendarDays.map((item) => {
            const isSelected = item.fullDate === selectedDate

            return (
              <button
                key={item.fullDate}
                onClick={() => onDateChange(item.fullDate)}
                className={`flex min-w-[58px] flex-shrink-0 flex-col items-center gap-3 rounded-full px-2 py-3 transition-all duration-200 ${
                  isSelected
                    ? 'border border-green-500'
                    : 'border border-transparent'
                }`}
              >
                <span
                  className={`text-sm ${
                    isSelected
                      ? 'font-semibold text-slate-900'
                      : 'text-gray-400'
                  }`}
                >
                  {item.day}
                </span>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    isSelected
                      ? 'bg-green-500 text-white'
                      : 'bg-green-100 text-gray-600'
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