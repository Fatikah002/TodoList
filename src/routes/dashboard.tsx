import { createFileRoute } from '@tanstack/react-router'
import { useTodos } from '@/hooks/useTodos'
import { useProfile } from '@/hooks/useProfile'
import { isSameDay, formatLocalDate } from '@/lib/date'
import { calculateTodoStats } from '@/lib/todoStats'
import { CalendarDays } from 'lucide-react'
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { TodayTasksSection } from '@/components/dashboard/TodayTasksSection'
import { WeeklyProgressSection } from '@/components/dashboard/WeeklyProgressSection'
import { UpcomingTasksSection } from '@/components/dashboard/UpcomingTasksSection'

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
  const { profile } = useProfile()
  const activeTodos = todos.filter((todo) => !todo.archived)
  const today = formatLocalDate(new Date())

  const todayTodos = activeTodos.filter(
    (todo) => isSameDay(todo.deadline, today) && !todo.completed,
  )

  const stats = calculateTodoStats(todos, { showAllTasks: true })

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

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight text-gray-900 sm:text-2xl">
            {getGreeting()}, {profile.name}! {getGreetingEmoji()}
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Let's get your tasks done.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span className="whitespace-nowrap">
            {format(now, 'dd MMMM yyyy')}
          </span>
        </div>
      </div>

      {/* Overview */}
      <StatsGrid stats={stats} showTotal={true} />

      {/* Sections */}
      <div className="mt-6 grid grid-cols-1 gap-3 pb-24 sm:grid-cols-3 sm:pb-0">
        <TodayTasksSection todos={todayTodos} onToggleTodo={toggleTodo} />

        <WeeklyProgressSection
          completed={weeklyCompleted}
          total={weeklyTotal}
          percentage={weeklyPct}
        />

        <UpcomingTasksSection todos={upcomingTodos} />
      </div>
    </div>
  )
}
