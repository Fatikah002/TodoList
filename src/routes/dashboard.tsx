import { createFileRoute, Link } from '@tanstack/react-router'
import { useTodos } from '@/hooks/useTodos'
import { Card, CardContent } from '@/components/ui/card'
import { isSameDay, isOverdue, formatLocalDate } from '@/lib/date'
import { ListChecks, CheckCircle2, Clock, AlertTriangle, CalendarDays } from 'lucide-react'
import { CircularProgress } from '@/components/CircularProgress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns'

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

  const completedPct = total === 0 ? 0 : Math.round((completed / total) * 100)
  const pendingPct = total === 0 ? 0 : Math.round((pending / total) * 100)
  const overduePct = total === 0 ? 0 : Math.round((overdue / total) * 100)

  const todayPending = todayTodos.filter((t) => !t.completed).length
  const todayUrgent = todayTodos.filter(
    (t) => !t.completed && isOverdue(t.completed, t.deadline, t.dueTime),
  ).length

  // Weekly progress
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

  // Upcoming tasks (next 7 days, excluding today, not completed)
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
      pctColor: 'text-gray-400',
    },
    {
      label: 'Completed',
      value: completed,
      pct: completedPct,
      icon: CheckCircle2,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      pctColor: 'text-green-600',
    },
    {
      label: 'Pending',
      value: pending,
      pct: pendingPct,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      pctColor: 'text-yellow-600',
    },
    {
      label: 'Overdue',
      value: overdue,
      pct: overduePct,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      pctColor: 'text-red-600',
    },
  ]

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'Work':
        return 'bg-blue-100 text-blue-700'
      case 'Personal':
        return 'bg-purple-100 text-purple-700'
      case 'Shopping':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, Fatikah! {getGreetingEmoji()}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            You have {todayPending} tasks today.{' '}
            {todayUrgent > 0 && (
              <span className="text-red-500">
                {todayUrgent} need immediate attention.
              </span>
            )}
            {todayUrgent === 0 && todayPending > 0 && (
              <span>All on track.</span>
            )}
            {todayPending === 0 && <span>No tasks for today.</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="text-gray-400" />
          <span>{format(today, 'dd MMMM yyyy')}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="rounded-2xl border-0 shadow-sm"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Weekly Progress */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Weekly Progress</h2>
            </div>

            <div className="flex items-center gap-4">
              <CircularProgress percentage={weeklyPct} />

              <div>
                <p className="text-xl font-bold text-gray-900">
                  {weeklyCompleted} / {weeklyTotal}
                </p>
                <p className="text-xs text-gray-500">Tasks Finished</p>
                <p className="mt-0.5 text-[10px] text-green-600 font-medium">
                  Keep it up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Today's Tasks</h2>
              <Link
                to="/todos"
                search={{ view: 'today' }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                View All Tasks
              </Link>
            </div>

            <div className="space-y-2">
              {todayTodos.length === 0 && (
                <p className="py-3 text-center text-xs text-gray-400">
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
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span
                      className={`text-xs font-medium ${
                        todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {todo.dueTime || '--:--'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Tasks</h2>
              <Link
                to="/todos"
                search={{ view: 'all' }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {upcomingTodos.length === 0 && (
                <p className="py-3 text-center text-xs text-gray-400">
                  No upcoming tasks
                </p>
              )}
              {upcomingTodos.map((todo) => {
                const d = new Date(todo.deadline)
                return (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-[10px] font-semibold uppercase text-gray-400">
                          {format(d, 'd-M')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-700">{todo.title}</span>
                    </div>
                    <Badge className={`text-[9px] px-1.5 py-0 ${getBadgeColor(todo.category)}`}>
                      {todo.category}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
