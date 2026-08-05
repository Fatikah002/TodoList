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

export function useFilteredTodos(showAllTasks: boolean) {
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
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('none')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showBulkDelete, setShowBulkDelete] = useState(false)

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

      const matchesDate =
        showAllTasks || isSameDay(todo.deadline, selectedDate)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority &&
        (isFilterActive || matchesDate)
      )
    })

    switch (sortBy) {
      case 'deadline':
        result.sort(
          (a, b) =>
            new Date(a.deadline).getTime() -
            new Date(b.deadline).getTime(),
        )
        break

      case 'priority':
        result.sort(
          (a, b) =>
            PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
        )
        break

      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break

      case 'none':
      default:
        break
    }

    return result
  }, [
    activeTodos,
    search,
    selectedCategory,
    selectedDate,
    statusFilter,
    priorityFilter,
    sortBy,
    showAllTasks,
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

    toggleSelect,
    cancelSelectMode,
  }
}