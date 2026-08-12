import type { ComponentProps } from 'react'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { formatLocalDate } from '@/lib/date'
import type { Todo } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

type MiniCalendarProps = {
  selectedDate: string
  onDateChange: (date: string) => void
  todos: Todo[]
  showAllTasks: boolean
  month?: Date
  onMonthChange?: (month: Date) => void
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

  const getTaskStatusOnDate = (date: Date) => {
    const dateStr = formatLocalDate(date)
    const dateTodos = todos.filter(
      (todo) =>
        todo.deadline === dateStr &&
        !todo.archived &&
        (showAllTasks || !todo.completed),
    )
    const hasPending = dateTodos.some((t) => !t.completed)

    return {
      hasTasks: dateTodos.length > 0,
      hasPending,
    }
  }

  return (
    <section className="w-full py-1">
      {/* Action header */}
      {selectedDate !== todayStr && (
        <div className="mb-2 flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(todayStr)}
            className="h-7 gap-1 rounded-full border-green-200 px-2.5 text-xs text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Today</span>
          </Button>
        </div>
      )}

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
          weekStartsOn={1}
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
                  'bg-green-100 text-green-800 font-semibold hover:bg-green-200'
              } else if (status.hasTasks) {
                customStyle =
                  'bg-gray-100 text-gray-700 font-medium hover:bg-gray-200'
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