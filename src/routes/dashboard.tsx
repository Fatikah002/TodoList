import { createFileRoute } from '@tanstack/react-router'
import { useTodos } from '@/hooks/useTodos'
import { useProfile } from '@/hooks/useProfile'
import { isSameDay, formatLocalDate } from '@/lib/date'
import { getUpcomingTodos } from '@/lib/upcomingTasks'
import { CalendarDays } from 'lucide-react'
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns'
import { TodayTasksSection } from '@/components/dashboard/TodayTasksSection'
import { DailyGoalCard } from '@/components/dashboard/DailyGoalCard'
import { WeeklyProgressSection } from '@/components/dashboard/WeeklyProgressSection'
import { UpcomingTasksSection } from '@/components/dashboard/UpcomingTasksSection'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { createTodoFromForm } from '@/lib/todos'
import { toast } from 'sonner'
import { calculateStreak } from '@/lib/streak'
import { calculateTodoStats } from '@/lib/todoStats'

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
  const { todos, toggleTodo, addTodo } = useTodos()
  const { profile } = useProfile()
  const activeTodos = todos.filter((todo) => !todo.archived)
  const today = formatLocalDate(new Date())
  const streak = calculateStreak(todos)
  const stats = calculateTodoStats(todos, { showAllTasks: true })

  const todayTodos = activeTodos.filter(
    (todo) => isSameDay(todo.deadline, today) && !todo.completed,
  )

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

  const upcomingTodos = getUpcomingTodos(todos)

  function handleAddTodo(title: string) {
    addTodo(
      createTodoFromForm({
        title,
        detail: '',
        category: 'Other',
        priority: 'None',
        deadline: formatLocalDate(new Date()),
        dueTime: '',
        repeat: 'none',
      }),
    )
    toast.success('Todo added successfully!')
  }

  return (
    <div className="rise-in mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8 motion-reduce:animate-none">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
            {getGreeting()}, {profile.name}! {getGreetingEmoji()}
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Let's get your tasks done.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-orange-100 bg-orange-50 px-3 py-1 ">
          <span className="text-lg leading-none">🔥</span>
          <span className="text-lg font-bold text-orange-500">{streak}</span>
        </div>
      </div>

      {/* Date */}
      {/* <div className="mt-3 flex items-center gap-2.5">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {format(now, 'dd MMMM yyyy')}
          </p>
        </div>
      </div> */}

      {/* Stats Overview */}
      <StatsGrid stats={stats} showTotal={true} />

      {/* Today's Tasks */}
      <div className="mt-4">
        <TodayTasksSection
          todos={todayTodos}
          onToggleTodo={toggleTodo}
          onAddTodo={handleAddTodo}
        />
      </div>

      {/* Stats Row: Daily Goal + This Week */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <DailyGoalCard />
        <WeeklyProgressSection
          completed={weeklyCompleted}
          total={weeklyTotal}
          percentage={weeklyPct}
        />
      </div>

      {/* Upcoming Tasks */}
      <div className="mt-4 pb-24 sm:pb-0">
        <UpcomingTasksSection todos={upcomingTodos} />
      </div>
    </div>
  )
}
