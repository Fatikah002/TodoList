import { createFileRoute } from '@tanstack/react-router'
import { todosSearchSchema } from '@/lib/schemas'
import type { Todo } from '@/lib/types'
import type { TodoFormData } from '@/lib/schemas'
import { TodoItem } from '@/components/todo/TodoItem'
import { TodosHeader } from '@/components/todo/TodosHeader'
import { TodosSearchBar } from '@/components/todo/TodosSearchBar'
import { BulkDeleteDialog } from '@/components/todo/BulkDeleteDialog'
import { HorizontalCalendar } from '@/components/dashboard/HorizontalCalendar'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { calculateTodoStats } from '@/lib/todoStats'
import { useFilteredTodos } from '@/hooks/useFilteredTodos'
import { toast } from 'sonner'
import { TodoDialog } from '@/components/todo/TodoDialog'

export const Route = createFileRoute('/todos')({
  component: TodosPage,
  validateSearch: (search) => todosSearchSchema.parse(search),
})

function TodosPage() {
  const { view } = Route.useSearch()
  const showAllTasks = view === 'all'

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
  } = useFilteredTodos(showAllTasks)

  function handleAddTodo(data: TodoFormData) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title,
      detail: data.detail,
      category: data.category,
      priority: data.priority,
      deadline: data.deadline,
      dueTime: data.dueTime ?? '',
      completed: false,
      repeat: data.repeat,
      archived: false,
    }

    addTodo(newTodo)
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

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
          <div className="order-2 w-full space-y-4 lg:space-y-6 xl:order-1">
            <TodosHeader
              showAllTasks={showAllTasks}
              showForm={showForm}
              onToggleForm={() => setShowForm(!showForm)}
            />

            <HorizontalCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              todos={todos}
              showAllTasks={showAllTasks}
            />

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

            <div className="space-y-3">
              {filteredTodos.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No todos found
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

          <div className="order-1 w-full space-y-4 xl:order-2 xl:sticky xl:top-24 xl:h-fit">
            <StatsGrid stats={stats} showTotal={false} />
          </div>
        </div>
      </main>
    </div>
  )
}
