import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { todosSearchSchema } from '@/lib/schemas'
import type { TodoFormData } from '@/lib/schemas'
import { TodoItem } from '@/components/todo/TodoItem'
import { TodosHeader} from '@/components/todo/TodosHeader'
import  type {  CalendarView } from '@/components/todo/TodosHeader'
import { TodosSearchBar } from '@/components/todo/TodosSearchBar'
import { BulkDeleteDialog } from '@/components/todo/BulkDeleteDialog'
import { HorizontalCalendar } from '@/components/dashboard/HorizontalCalendar'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { UpcomingTasksSection } from '@/components/dashboard/UpcomingTasksSection'
import { MiniCalendar } from '@/components/dashboard/MiniCalendar'
import { calculateTodoStats } from '@/lib/todoStats'
import { getUpcomingTodos } from '@/lib/upcomingTasks'
import { useFilteredTodos } from '@/hooks/useFilteredTodos'
import { QuickFilterBar } from '@/components/todo/QuickFilterBar'
import type { QuickFilter } from '@/lib/presets'
import { formatLocalDate } from '@/lib/date'
import type { StatusFilter, PriorityFilter, SortBy } from '@/components/todo/TodoFilter'
import { toast } from 'sonner'
import { TodoDialog } from '@/components/todo/TodoDialog'
import { createTodoFromForm } from '@/lib/todos'

import { CategoryBreakdownSection } from '@/components/dashboard/CategoryBreakdownSection'

export const Route = createFileRoute('/todos')({
  component: TodosPage,
  validateSearch: (search) => todosSearchSchema.parse(search),
})

function TodosPage() {
  const { view, status, priority, category, sort, upcoming } = Route.useSearch()
  const showAllTasks = view === 'all'
  const showUpcomingTasks = upcoming === true

  const [calendarView, setCalendarView] = useState<CalendarView>('day')
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const handlePreviousNav = () => {
    setCurrentWeek((prev) => {
      const d = new Date(prev)
      if (calendarView === 'day') {
        d.setDate(d.getDate() - 7)
      } else {
        d.setMonth(d.getMonth() - 1)
      }
      return d
    })
  }

  const handleNextNav = () => {
    setCurrentWeek((prev) => {
      const d = new Date(prev)
      if (calendarView === 'day') {
        d.setDate(d.getDate() + 7)
      } else {
        d.setMonth(d.getMonth() + 1)
      }
      return d
    })
  }

  const handleToday = () => {
    setCurrentWeek(new Date())
    setSelectedDate(formatLocalDate(new Date()))
  }

  const {
    todos,
    addTodo,
    deleteTodo,
    deleteMany,
    toggleTodo,
    updateTodo,
    archiveTodo,
    showForm,
    setShowForm,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    setDateFilterMode,
    selectMode,
    setSelectMode,
    selectedIds,
    setSelectedIds,
    showBulkDelete,
    setShowBulkDelete,
    categories,
    filteredTodos,
    toggleSelect,
    cancelSelectMode,
  } = useFilteredTodos(showAllTasks, showUpcomingTasks, {
    status: status as StatusFilter,
    priority: priority as PriorityFilter,
    category,
    sort: sort as SortBy,
  })

  function handleAddTodo(data: TodoFormData) {
    addTodo(createTodoFromForm(data))
    toast.success('Todo added successfully!')
  }

  function handleBulkDelete() {
    deleteMany(selectedIds)
    toast.error(`${selectedIds.length} todo(s) deleted`)
    setSelectedIds([])
    setSelectMode(false)
    setShowBulkDelete(false)
  }

  const stats = calculateTodoStats(todos, { selectedDate, showAllTasks })
  const upcomingTodos = getUpcomingTodos(todos)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-7xl px-8 py-8 sm:px-8 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
          <div className="order-2 w-full space-y-4 lg:space-y-6 lg:order-1">
            <TodosHeader
              showAllTasks={showAllTasks}
              showForm={showForm}
              onToggleForm={() => setShowForm(!showForm)}
              calendarView={calendarView}
              onCalendarViewChange={setCalendarView}
              currentWeek={currentWeek}
              onPreviousWeek={handlePreviousNav}
              onNextWeek={handleNextNav}
              onToday={handleToday}
            />

            {calendarView === 'day' ? (
              <HorizontalCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                todos={todos}
                showAllTasks={showAllTasks}
                currentWeek={currentWeek}
              />
            ) : (
              <MiniCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                todos={todos}
                showAllTasks={showAllTasks}
                month={currentWeek}
                onMonthChange={setCurrentWeek}
              />
            )}

            <TodosSearchBar
              search={search}
              onSearchChange={setSearch}
              selectMode={selectMode}
              onCancelSelect={cancelSelectMode}
              onEnterSelectMode={() => setSelectMode(true)}
              selectedCount={selectedIds.length}
              onDeleteSelected={() => setShowBulkDelete(true)}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />

            <QuickFilterBar
              activeStatus={statusFilter}
              activePriority={priorityFilter}
              activeSort={sortBy}
              onSelect={(f: QuickFilter) => {
                const isActive =
                  f.filters.status === statusFilter &&
                  f.filters.priority === priorityFilter &&
                  f.filters.sort === sortBy

                if (isActive) {
                  setStatusFilter('all')
                  setPriorityFilter('all')
                  setSortBy('none')
                  setDateFilterMode('none')
                  return
                }

                setStatusFilter(f.filters.status)
                setPriorityFilter(f.filters.priority)
                setSortBy(f.filters.sort)

                if (f.id === 'due-today') {
                  setDateFilterMode('day')
                  setSelectedDate(formatLocalDate(new Date()))
                } else if (f.id === 'due-this-week') {
                  setDateFilterMode('week')
                  setSelectedDate(formatLocalDate(new Date()))
                } else {
                  setDateFilterMode('none')
                }
              }}
            />

            {showForm && (
              <TodoDialog
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title="Add Todo"
                submitLabel="Add Todo"
                showPriority={true}
                showRepeat={true}
                onSubmit={handleAddTodo}
              />
            )}

            <div className="space-y-3" aria-live="polite">
              {filteredTodos.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  {showUpcomingTasks ? 'No upcoming task' : 'No todos found'}
                </p>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={deleteTodo}
                    onToggle={toggleTodo}
                    onUpdate={updateTodo}
                    onArchive={archiveTodo}
                    onUndoArchive={updateTodo}
                    selectMode={selectMode}
                    isSelected={selectedIds.includes(todo.id)}
                    onToggleSelect={toggleSelect}
                  />
                ))
              )}
            </div>

            <BulkDeleteDialog
              open={showBulkDelete}
              onOpenChange={setShowBulkDelete}
              count={selectedIds.length}
              onConfirm={handleBulkDelete}
            />
          </div>

          <div className="order-1 w-full space-y-4 lg:order-2">
            <StatsGrid stats={stats} showTotal={false} />
            <CategoryBreakdownSection
              todos={todos}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <UpcomingTasksSection todos={upcomingTodos} />
          </div>
        </div>
      </div>
    </div>
  )
}
