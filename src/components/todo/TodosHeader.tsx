import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type CalendarView = 'day' | 'month'

type TodosHeaderProps = {
  showAllTasks: boolean
  showForm: boolean
  onToggleForm: () => void
  calendarView: CalendarView
  onCalendarViewChange: (view: CalendarView) => void
  currentWeek?: Date
  onPreviousWeek?: () => void
  onNextWeek?: () => void
}

export function TodosHeader({
  showAllTasks,
  showForm,
  onToggleForm,
  calendarView,
  onCalendarViewChange,
  currentWeek,
  onPreviousWeek,
  onNextWeek,
}: TodosHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Today (Left)  |  + Add (Right) */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-1.5 cursor-pointer text-xl font-bold text-gray-900 transition-colors">
              <h2>{showAllTasks ? 'All Tasks' : 'Today'}</h2>
              <ChevronDown className="h-5 w-5 text-gray-900 mt-1" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-40 rounded-2xl p-1.5 shadow-md"
          >
            <DropdownMenuItem
              onClick={() =>
                navigate({ to: '/todos', search: { view: 'today' as const, status: 'all' as const, priority: 'all' as const, category: 'All', sort: 'none' as const } })
              }
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
                !showAllTasks ? 'bg-green-50 text-green-700 font-semibold' : ''
              }`}
            >
              <span>Today</span>
              {!showAllTasks && <Check className="h-4 w-4 text-green-600" />}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate({ to: '/todos', search: { view: 'all' as const, status: 'all' as const, priority: 'all' as const, category: 'All', sort: 'none' as const } })}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
                showAllTasks ? 'bg-green-50 text-green-700 font-semibold' : ''
              }`}
            >
              <span>All Tasks</span>
              {showAllTasks && <Check className="h-4 w-4 text-green-600" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={onToggleForm}
          className="h-9 rounded-full bg-green-600 px-4 hover:bg-green-700 font-medium"
        >
          {showForm ? (
            <X size={18} />
          ) : (
            <>
              <Plus size={18} /> <span>Add</span>
            </>
          )}
        </Button>
      </div>

      {/* Row 2: Month  (Left)  |  Aug 2026 (Right) */}
      <div className="flex items-center justify-between  pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Button
              variant="outline"
              className="h-9 rounded-full border-gray-200 px-3 text-sm font-medium text-gray-700 gap-1.5"
            >
              <CalendarDays size={16} />
              <span className="capitalize">{calendarView}</span>
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-36 rounded-2xl p-1.5 shadow-md"
          >
            <DropdownMenuItem
              onClick={() => onCalendarViewChange('day')}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
                calendarView === 'day'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : ''
              }`}
            >
              <span>Day</span>
              {calendarView === 'day' && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onCalendarViewChange('month')}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
                calendarView === 'month'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : ''
              }`}
            >
              <span>Month</span>
              {calendarView === 'month' && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ◀ Aug 2026 ▶ (Month & Year navigation) */}
        {currentWeek && (
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
            {onPreviousWeek && (
              <button
                onClick={onPreviousWeek}
                className="rounded-full p-1 hover:bg-gray-100 text-gray-700 transition-colors"
                title={
                  calendarView === 'day'
                    ? 'Minggu Sebelumnya'
                    : 'Bulan Sebelumnya'
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <span className="px-1 font-semibold">
              {currentWeek.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {onNextWeek && (
              <button
                onClick={onNextWeek}
                className="rounded-full p-1 hover:bg-gray-100 text-gray-700 transition-colors"
                title={
                  calendarView === 'day'
                    ? 'Minggu Berikutnya'
                    : 'Bulan Berikutnya'
                }
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
