import { useCallback, useMemo, useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { formatLocalDate, isOverdue, isSameDay } from '@/lib/date'
import type { Todo } from '@/lib/types'
import type {
  PriorityFilter,
  SortBy,
  StatusFilter,
} from '@/components/todo/TodoFilter'

const PRIORITY_ORDER = {
  High: 3,
  Medium: 2,
  Low: 1,
  None: 0,
} as const

type FilterInitialValues = {
  status?: StatusFilter
  priority?: PriorityFilter
  category?: string
  sort?: SortBy
}

export function useFilteredTodos(
  showAllTasks: boolean,
  showUpcoming: boolean = false,
  initialValues?: FilterInitialValues,
) {
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
  const [selectedCategory, setSelectedCategory] = useState(
    initialValues?.category ?? 'All',
  )
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()))
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    initialValues?.status ?? 'all',
  )
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>(
    initialValues?.priority ?? 'all',
  )
  const [sortBy, setSortBy] = useState<SortBy>(initialValues?.sort ?? 'none')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const [dateFilterMode, setDateFilterMode] = useState<'none' | 'day' | 'week'>('none')

  const activeTodos = useMemo(
    () => todos.filter((todo: Todo) => !todo.archived),
    [todos],
  )

  const categories = useMemo(
    () => Array.from(new Set(activeTodos.map((todo) => todo.category))),
    [activeTodos],
  )

  const isFilterActive = useMemo(
    () =>
      statusFilter !== 'all' ||
      priorityFilter !== 'all' ||
      selectedCategory !== 'All' ||
      sortBy !== 'none',
    [statusFilter, priorityFilter, selectedCategory, sortBy],
  )

  const filteredTodos = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 8)
    nextWeek.setHours(0, 0, 0, 0)

    const result = activeTodos.filter((todo) => {
      const matchesSearch =
        keyword === '' ||
        todo.title.toLowerCase().includes(keyword) ||
        todo.detail.toLowerCase().includes(keyword) ||
        todo.category.toLowerCase().includes(keyword) ||
        todo.priority.toLowerCase().includes(keyword)

      const matchesCategory =
        selectedCategory === 'All' || todo.category === selectedCategory

      const todoIsOverdue = isOverdue(
        todo.completed,
        todo.deadline,
        todo.dueTime,
      )

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && todo.completed) ||
        (statusFilter === 'pending' && !todo.completed) ||
        (statusFilter === 'overdue' && todoIsOverdue)

      const matchesPriority =
        priorityFilter === 'all' || todo.priority === priorityFilter

      const matchesDateDay = isSameDay(todo.deadline, selectedDate)
      const defaultMatchesDate = showAllTasks || matchesDateDay

      // compute week match based on selectedDate (start of week)
      let matchesDateWeek = false
      try {
        const ref = new Date(selectedDate)
        const start = new Date(ref)
        // assume week starts on Sunday
        const day = start.getDay()
        start.setDate(start.getDate() - day)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(start.getDate() + 7)
        const td = new Date(todo.deadline)
        matchesDateWeek = td >= start && td < end
      } catch {
        matchesDateWeek = false
      }

      const matchesUpcoming = !showUpcoming || (
        !todo.completed &&
        new Date(todo.deadline) >= tomorrow &&
        new Date(todo.deadline) < nextWeek
      )

      const finalMatchesDate =
        dateFilterMode === 'none'
          ? defaultMatchesDate
          : dateFilterMode === 'day'
          ? matchesDateDay
          : matchesDateWeek

      const passesDate = dateFilterMode === 'none' ? isFilterActive || finalMatchesDate : finalMatchesDate

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority &&
        matchesUpcoming &&
        passesDate
      )
    })

    switch (sortBy) {
      case 'deadline':
        result.sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
        )
        break

      case 'priority':
        result.sort(
          (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
        )
        break

      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break

      case 'none':
      default:
        break
    }

    // Ensure completed tasks appear after pending tasks while preserving
    // the existing sort order within each group.
    const pending = result.filter((t) => !t.completed)
    const completed = result.filter((t) => t.completed)

    return [...pending, ...completed]
  }, [
    activeTodos,
    search,
    selectedCategory,
    selectedDate,
    statusFilter,
    priorityFilter,
    sortBy,
    showAllTasks,
    showUpcoming,
    isFilterActive,
  ])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    )
  }, [])

  const cancelSelectMode = useCallback(() => {
    setSelectMode(false)
    setSelectedIds([])
  }, [])

  return {
    todos,
    activeTodos,
    filteredTodos,
    categories,
    isFilterActive,

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

    dateFilterMode,
    setDateFilterMode,

    toggleSelect,
    cancelSelectMode,
  }
}
