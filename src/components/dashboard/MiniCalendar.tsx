import { useMemo } from 'react'
import type{ ComponentProps } from 'react'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { formatLocalDate } from '@/lib/date'
import type { Todo } from '@/lib/types'

type MiniCalendarProps = {
  selectedDate: string
  onDateChange: (date: string) => void
  todos: Todo[]
  showAllTasks: boolean
  month: Date
  onMonthChange: (month: Date) => void
}

export function MiniCalendar({
  selectedDate,
  onDateChange,
  todos,
  showAllTasks,
  month,
  onMonthChange,
}: MiniCalendarProps) {
  const todayStr = formatLocalDate(new Date())

  const taskStatusMap = useMemo(() => {
    const map = new Map<string, { hasTasks: boolean; hasPending: boolean }>()
    for (const todo of todos) {
      if (todo.archived) continue
      if (!showAllTasks && todo.completed) continue

      const dateStr = todo.deadline
      const existing = map.get(dateStr)
      if (existing) {
        existing.hasTasks = true
        if (!todo.completed) {
          existing.hasPending = true
        }
      } else {
        map.set(dateStr, {
          hasTasks: true,
          hasPending: !todo.completed,
        })
      }
    }
    return map
  }, [todos, showAllTasks])

  const getTaskStatusOnDate = (date: Date) => {
    const dateStr = formatLocalDate(date)
    return taskStatusMap.get(dateStr) ?? { hasTasks: false, hasPending: false }
  }

  return (
    <section className="w-full py-1">
      {/* Calendar Grid */}
      <div className="flex justify-center overflow-x-auto py-1">
        <Calendar
          mode="single"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          month={month}
          onMonthChange={onMonthChange}
          onSelect={(date) => {
            if (date) onDateChange(formatLocalDate(date))
          }}
          showOutsideDays
          weekStartsOn={0}
          formatters={{
            formatWeekdayName: (date) =>
              date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          }}
          className="w-full max-w-full text-sm [--cell-size:36px] sm:[--cell-size:40px]"
          classNames={{
            root: 'w-full flex flex-col items-center',
            months: 'w-full flex flex-col items-center',
            month: 'w-full flex flex-col items-center',
            month_caption: 'hidden',
            nav: 'hidden',
            month_grid: 'w-full border-collapse',
            weekdays: 'flex w-full justify-between',
            weekday:
              'w-(--cell-size) text-center text-xs font-semibold text-gray-400',
            week: 'flex w-full justify-between mt-1',
            day: 'w-(--cell-size) h-(--cell-size) text-center p-0 relative',
            outside: 'text-gray-300 opacity-50',
            today: 'font-bold text-green-700',
          }}
          components={{
            DayButton: ({
              day,
              modifiers,
              children,
              ...props
            }: ComponentProps<typeof CalendarDayButton>) => {
              const dateStr = formatLocalDate(day.date)
              const isSelected = dateStr === selectedDate
              const isToday = dateStr === todayStr
              const status = getTaskStatusOnDate(day.date)

              let customStyle = ''
              if (isSelected) {
                customStyle =
                  'bg-green-600 text-white font-bold shadow-sm shadow-green-600/30 hover:bg-green-700 hover:text-white scale-105'
              } else if (status.hasPending) {
                customStyle =
                  'bg-green-100 text-green-800 font-semibold'
              } else if (status.hasTasks) {
                customStyle =
                  'bg-gray-100 text-gray-700 font-medium'
              }

              if (isToday && !isSelected) {
                customStyle += ' ring-2 ring-green-600 ring-offset-1'
              }

              return (
                <div className="relative flex items-center justify-center w-full h-full">
                  <CalendarDayButton
                    day={day}
                    modifiers={modifiers}
                    className={`transition-all duration-150 ${customStyle}`}
                    {...props}
                  >
                    {children}
                  </CalendarDayButton>

                  {/* Task Indicator Dot */}
                  {status.hasPending && !isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-green-600 pointer-events-none" />
                  )}
                </div>
              )
            },
          }}
        />
      </div>
    </section>
  )
}