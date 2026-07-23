import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import type { Todo, RepeatType } from '@/lib/types'
import { TodoItem } from '@/components/TodoItem'
import { TodoFilter } from '@/components/TodoFilter'
import type {
  SortBy,
  StatusFilter,
  PriorityFilter,
} from '@/components/TodoFilter'
import { HorizontalCalendar } from '@/components/HorizontalCalendar'
import { Button } from '@/components/ui/button'
import { useTodos } from '@/hooks/useTodos'
import { useState } from 'react'
import {
  Plus,
  X,
  Search,
  Archive,
  ChevronDown,
  Check,
  SquareCheckBig,
} from 'lucide-react'
import { formatLocalDate, isSameDay, isOverdue } from '@/lib/date'
import { TodoDialog } from '@/components/TodoDialog'
import { Input } from '@/components/ui/input'
import { DailyProgress } from '@/components/DailyProgress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const todosSearchSchema = z.object({
  view: z.enum(['today', 'all']).optional().default('today'),
})

export const Route = createFileRoute('/todos')({
  component: TodosPage,
  validateSearch: (search) => todosSearchSchema.parse(search),
})

function TodosPage() {
  const navigate = useNavigate()
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
  } = useTodos()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()))
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('none')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showBulkDelete, setShowBulkDelete] = useState(false)

  const activeTodos = todos.filter((todo) => !todo.archived)
  const archivedTodos = todos.filter((todo) => todo.archived)
  const categories = Array.from(
    new Set(activeTodos.map((todo) => todo.category)),
  )
  let filteredTodos = [...activeTodos]

  const isFilterActive =
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    selectedCategory !== 'All' ||
    sortBy !== 'none'

  filteredTodos = [...activeTodos].filter((todo) => {
    const keyword = search.trim().toLowerCase()

    // =====================
    // SEARCH
    // =====================

    const matchesSearch =
      keyword === '' ||
      todo.title.toLowerCase().includes(keyword) ||
      todo.detail.toLowerCase().includes(keyword) ||
      todo.category.toLowerCase().includes(keyword) ||
      todo.priority.toLowerCase().includes(keyword)

    // =====================
    // CATEGORY
    // =====================

    const matchesCategory =
      selectedCategory === 'All' || todo.category === selectedCategory

    // =====================
    // STATUS
    // =====================

    const todoIsOverdue = isOverdue(todo.completed, todo.deadline, todo.dueTime)

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && todo.completed) ||
      (statusFilter === 'pending' && !todo.completed) ||
      (statusFilter === 'overdue' && todoIsOverdue)

    // =====================
    // PRIORITY
    // =====================

    const matchesPriority =
      priorityFilter === 'all' || todo.priority === priorityFilter

    const matchesDate = showAllTasks || isSameDay(todo.deadline, selectedDate)

    // Filter aktif: tampilkan semua hari yang cocok dengan filter.
    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesPriority &&
      (isFilterActive || matchesDate)
    )
  })

  // =====================
  // SORT
  // =====================
  if (sortBy !== 'none') {
    filteredTodos.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()

        case 'priority': {
          const priorityOrder = {
            High: 3,
            Medium: 2,
            Low: 1,
            None: 0,
          }

          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }

        case 'name':
          return a.title.localeCompare(b.title)
      }
    })
  }

  function handleAddTodo(data: {
    title: string
    detail: string
    category: string
    priority: Todo['priority']
    deadline: string
    dueTime: string
    repeat: RepeatType
  }) {
    const newTodo: Todo = {
      id: Date.now(),
      title: data.title,
      detail: data.detail,
      category: data.category,
      priority: data.priority,
      deadline: data.deadline,
      dueTime: data.dueTime,
      completed: false,
      repeat: data.repeat,
      archived: false,
    }

    addTodo(newTodo)
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
          {/* ================= RIGHT (Mobile: Atas, Desktop: Kanan) ================= */}
          <aside className="order-1 xl:order-2">
            <div className="xl:sticky xl:top-6">
              <DailyProgress
                todos={todos}
                selectedDate={selectedDate}
                showAllTasks={showAllTasks}
              />
            </div>
          </aside>

          {/* ================= LEFT ================= */}
          <Card className="order-2 w-full rounded-3xl border-0 shadow-md xl:order-1">
            <CardContent className="space-y-6 p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex items-center gap-1.5 cursor-pointer text-xl font-bold text-gray-900 transition-colors">
                      <span>{showAllTasks ? 'All Tasks' : 'Today'}</span>
                      <ChevronDown className="h-5 w-5 text-black mt-1 " />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-40 rounded-2xl p-1.5 shadow-md"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({ to: '/todos', search: { view: 'today' } })
                      }
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
                        !showAllTasks
                          ? 'bg-green-50 text-green-700 font-semibold'
                          : ''
                      }`}
                    >
                      <span>Today</span>
                      {!showAllTasks && (
                        <Check className="h-4 w-4 text-green-300" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        navigate({ to: '/todos', search: { view: 'all' } })
                      }
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer ${
                        showAllTasks
                          ? 'bg-green-50 text-green-700 font-semibold'
                          : ''
                      }`}
                    >
                      <span>All Tasks</span>
                      {showAllTasks && (
                        <Check className="h-4 w-4 text-green-300" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    className="h-9 w-18 rounded-full bg-green-500 hover:bg-green-600"
                  >
                    {showForm ? (
                      <X size={18} />
                    ) : (
                      <>
                        <Plus size={18} /> <span>Add</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => navigate({ to: '/archived' })}
                    variant="outline"
                    className="h-9 gap-1.5 rounded-full px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-gray-700 border-gray-200"
                    title="Archived Todos"
                  >
                    <Archive size={15} />
                    <span className="hidden sm:inline">Archived</span>
                    {archivedTodos.length > 0 && (
                      <span className="rounded-full bg-gray-200 px-1.5 py-0.2 text-[11px] sm:text-xs font-bold text-gray-600">
                        {archivedTodos.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Calendar */}
              <HorizontalCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                todos={todos}
                showAllTasks={showAllTasks}
              />

              {/* Search / Select bar */}
              {selectMode ? (
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectMode(false)
                      setSelectedIds([])
                    }}
                  >
                    Cancel
                  </Button>

                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedIds.length} item selected
                  </p>

                  <Button
                    variant="destructive"
                    disabled={selectedIds.length === 0}
                    onClick={() => setShowBulkDelete(true)}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      placeholder="Search todo..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 rounded-xl pl-10 pr-10"
                    />

                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  <TodoFilter
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

                  <Button
                    variant="outline"
                    onClick={() => setSelectMode(true)}
                    className="h-11 gap-1.5 rounded-xl px-3"
                  >
                    <SquareCheckBig size={16} />
                    {/* <span>Select</span> */}
                  </Button>
                </div>
              )}

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
                      selectMode={selectMode}
                      isSelected={selectedIds.includes(todo.id)}
                      onToggleSelect={(id) =>
                        setSelectedIds((prev) =>
                          prev.includes(id)
                            ? prev.filter((x) => x !== id)
                            : [...prev, id],
                        )
                      }
                    />
                  ))
                )}
              </div>

              <AlertDialog
                open={showBulkDelete}
                onOpenChange={setShowBulkDelete}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedIds.length}{' '}
                      selected item(s)?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteMany(selectedIds)
                        setSelectedIds([])
                        setSelectMode(false)
                        setShowBulkDelete(false)
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
