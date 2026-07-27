import { createFileRoute, Link } from '@tanstack/react-router'
import { useTodos } from '@/hooks/useTodos'
import { isSameDay, isOverdue, formatLocalDate } from '@/lib/date'
import { ListChecks, CheckCircle2, Clock, AlertTriangle, CalendarDays, ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { CircularProgress } from '@/components/CircularProgress'
import { Badge } from '@/components/ui/badge'
import { HorizontalCalendar } from '@/components/HorizontalCalendar'
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function getGreetingEmoji() {
  const hour = new Date().getHours()
  if (hour < 12) return '🌅'
  if (hour < 17) return '☀️'
  return '🌙'
}

function priorityColor(priority: string) {
  switch (priority) {
    case 'High': return 'bg-red-500'
    case 'Medium': return 'bg-yellow-500'
    case 'Low': return 'bg-green-500'
    default: return 'bg-gray-400'
  }
}

function priorityBadgeColor(priority: string) {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700'
    case 'Medium': return 'bg-yellow-100 text-yellow-700'
    case 'Low': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function DashboardPage() {
  const { todos } = useTodos()
  const activeTodos = todos.filter((todo) => !todo.archived)
  const today = formatLocalDate(new Date())
  const [selectedDate, setSelectedDate] = useState(today)

  const todayTodos = activeTodos.filter((todo) =>
    isSameDay(todo.deadline, today) && !todo.completed,
  )

  const completed = activeTodos.filter((todo) => todo.completed).length
  const pending = activeTodos.filter(
    (todo) =>
      !todo.completed && !isOverdue(todo.completed, todo.deadline, todo.dueTime),
  ).length
  const overdue = activeTodos.filter((todo) =>
    isOverdue(todo.completed, todo.deadline, todo.dueTime),
  ).length
  const total = activeTodos.length

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  const weeklyTodos = activeTodos.filter((todo) => {
    const d = new Date(todo.deadline)
    return isWithinInterval(d, { start: weekStart, end: weekEnd })
  })
  const weeklyTotal = weeklyTodos.length
  const weeklyCompleted = weeklyTodos.filter((t) => t.completed).length
  const weeklyPct = weeklyTotal === 0 ? 0 : Math.round((weeklyCompleted / weeklyTotal) * 100)

  const upcomingTodos = activeTodos
    .filter((todo) => {
      if (todo.completed) return false
      const d = new Date(todo.deadline)
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 8)
      nextWeek.setHours(0, 0, 0, 0)
      return d >= tomorrow && d < nextWeek
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: ListChecks,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">
            {getGreeting()}, Fatikah! {getGreetingEmoji()}
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Let's get your tasks done.
          </p>
        </div>

        
      </div>

      {/* Date Display */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
        <CalendarDays className="h-4 w-4 text-gray-400" />
        <span>{format(now, 'dd MMMM yyyy')}</span>
        <ChevronDown className="h-3 w-3" />
      </div>

      {/* Horizontal Calendar */}
      <div className="mt-4">
        <HorizontalCalendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          todos={activeTodos}
          showAllTasks={true}
        />
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl bg-white p-3 shadow-sm sm:p-4"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${stat.iconBg}`}
              >
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </div>
              <p className="mt-2 text-[10px] text-gray-500 sm:text-xs">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 sm:text-xl">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Today's Tasks */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 sm:text-base">Today's Tasks</h2>
          <Link
            to="/todos"
            search={{ view: 'today' }}
            className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
          >
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {todayTodos.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-400">
              No tasks scheduled for today
            </p>
          )}
          {todayTodos
            .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))
            .slice(0, 5)
            .map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${priorityColor(todo.priority)}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{todo.title}</p>
                    <p className="text-xs text-gray-400">⏰ {todo.dueTime || 'No time'}</p>
                  </div>
                </div>
                <Badge className={`text-[10px] px-1.5 py-0.5 ${priorityBadgeColor(todo.priority)}`}>
                  {todo.priority}
                </Badge>
              </div>
            ))}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 sm:text-base">Weekly Progress</h2>
          <Link
            to="/todos"
            search={{ view: 'all' }}
            className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
          >
            View Weekly <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <CircularProgress percentage={weeklyPct} className="h-20 w-20 sm:h-24 sm:w-24" />
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900 sm:text-xl">
              {weeklyCompleted} / {weeklyTotal}
            </p>
            <p className="text-xs text-gray-500">Tasks Completed</p>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${weeklyPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:mt-6 sm:mb-24">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 sm:text-base">Upcoming Tasks</h2>
          <Link
            to="/todos"
            search={{ view: 'all' }}
            className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
          >
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {upcomingTodos.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-400">
              No upcoming tasks
            </p>
          )}
          {upcomingTodos.map((todo) => {
            const d = new Date(todo.deadline)
            return (
              <div
                key={todo.id}
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-green-50">
                  <span className="text-sm font-bold text-green-700">{format(d, 'd')}</span>
                  <span className="text-[10px] text-green-600">{format(d, 'MMM')}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${priorityColor(todo.priority)}`} />
                    <p className="text-sm font-medium text-gray-900">{todo.title}</p>
                  </div>
                  <p className="text-xs text-gray-400">⏰ {todo.dueTime || 'No time'}</p>
                </div>
                <Badge className={`text-[10px] px-1.5 py-0.5 ${priorityBadgeColor(todo.priority)}`}>
                  {todo.priority}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
