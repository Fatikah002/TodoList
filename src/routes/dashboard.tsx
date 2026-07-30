import { createFileRoute, Link } from '@tanstack/react-router'
import { useTodos } from '@/hooks/useTodos'
import { isSameDay, isOverdue, formatLocalDate } from '@/lib/date'
import {
  ListChecks,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarDays,
  ChevronRight,
} from 'lucide-react'
import { CircularProgress } from '#/components/dashboard/CircularProgress'
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'

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

function DashboardPage() {
  const { todos, toggleTodo } = useTodos()
  const activeTodos = todos.filter((todo) => !todo.archived)
  const today = formatLocalDate(new Date())

  const todayTodos = activeTodos.filter(
    (todo) => isSameDay(todo.deadline, today) && !todo.completed,
  )

  const completed = activeTodos.filter((todo) => todo.completed).length
  const pending = activeTodos.filter(
    (todo) =>
      !todo.completed &&
      !isOverdue(todo.completed, todo.deadline, todo.dueTime),
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
  const weeklyPct =
    weeklyTotal === 0 ? 0 : Math.round((weeklyCompleted / weeklyTotal) * 100)

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
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight text-gray-900 sm:text-2xl">
            {getGreeting()}, Fatikah! {getGreetingEmoji()}
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Let's get your tasks done.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          <span className="whitespace-nowrap">
            {format(now, 'dd MMMM yyyy')}
          </span>
        </div>
      </div>

      {/* Overview */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Overview
        </h2>

        <div className="mt-3 grid grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="flex min-h-[115px] flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 `}
                >
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </div>

                <p className="mt-2 text-[10px] text-gray-500 sm:text-xs">
                  {stat.label}
                </p>

                <p className="text-lg font-bold text-gray-900 sm:text-xl">
                  {stat.value}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Sections */}
      <div className="mt-6 grid grid-cols-1 gap-3 pb-24 sm:grid-cols-3 sm:pb-0">
        {/* Today's Tasks */}
        <section className=" overflow-hidden rounded-2xl bg-white p-4 shadow-sm flex h-[200px] flex-col">
          {' '}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
              Today's Tasks
            </h2>

            <Link
              to="/todos"
              search={{ view: 'today' }}
              className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-700"
            >
              View All
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {todayTodos.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-400">
                No tasks scheduled for today
              </p>
            ) : (
              todayTodos
                .sort((a, b) =>
                  (a.dueTime || '').localeCompare(b.dueTime || ''),
                )
                .slice(0, 5)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="h-4 w-4"
                      />
                      <p
                        className={`flex-1 truncate text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                      >
                        {todo.title}
                      </p>
                    </div>

                    <p className="shrink-0 whitespace-nowrap text-xs text-gray-400">
                      {todo.dueTime || 'No due time'}
                    </p>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* Weekly Progress */}
        <section className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md ">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
              Weekly Progress
            </h2>

            {/* <Link
              to="/todos"
              search={{ view: 'all' }}
              className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-700"
            >
              View Weekly
              <ChevronRight className="h-3 w-3" />
            </Link> */}
          </div>

          <div className="flex items-center gap-5">
            <CircularProgress
              percentage={weeklyPct}
              className="h-20 w-20 sm:h-24 sm:w-24"
            />

            <div className="flex-1">
              <p className="text-xl font-bold text-gray-900">
                {weeklyCompleted} / {weeklyTotal}
              </p>

              <p className="mt-1 text-xs text-gray-500">Tasks Completed</p>

              <div className="mt-4 h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${weeklyPct}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md flex h-[200px] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
              Upcoming Tasks
            </h2>

            <Link
              to="/todos"
              search={{ view: 'all' }}
              className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-700"
            >
              View All
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingTodos.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-400">
                No upcoming tasks
              </p>
            ) : (
              upcomingTodos.map((todo) => {
                const d = new Date(todo.deadline)

                return (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {/* <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-green-50"> */}
                      <span className="text-sm font-bold ">
                        {format(d, 'd MMM')}
                      </span>

                      <p className="flex-1 truncate text-sm font-medium text-gray-900">
                        {todo.title}
                      </p>
                    </div>

                    <p className="shrink-0 whitespace-nowrap text-xs text-gray-400">
                      {todo.dueTime || 'No due time'}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
