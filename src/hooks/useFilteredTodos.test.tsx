import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { TodosProvider } from './useTodos'
import { useFilteredTodos } from './useFilteredTodos'
import type { Todo } from '@/lib/types'

function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    title: 'Test Todo',
    detail: 'Test detail',
    category: 'Work',
    priority: 'None',
    deadline: '2026-01-15',
    dueTime: '',
    completed: false,
    repeat: 'none',
    archived: false,
    ...overrides,
  }
}

function TestWrapper({ children }: { children: ReactNode }) {
  return <TodosProvider>{children}</TodosProvider>
}

describe('useFilteredTodos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('activeTodos', () => {
    it('excludes archived todos', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', archived: false }))
        result.current.addTodo(createTodo({ id: '2', archived: true }))
        result.current.addTodo(createTodo({ id: '3', archived: false }))
      })

      expect(result.current.activeTodos).toHaveLength(2)
      expect(result.current.activeTodos.map((t) => t.id)).toEqual(['1', '3'])
    })
  })

  describe('categories', () => {
    it('extracts unique categories from active todos', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', category: 'Work' }))
        result.current.addTodo(createTodo({ id: '2', category: 'Personal' }))
        result.current.addTodo(createTodo({ id: '3', category: 'Work' }))
      })

      expect(result.current.categories).toEqual(['Work', 'Personal'])
    })
  })

  describe('search', () => {
    it('filters by title', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', title: 'Buy groceries' }))
        result.current.addTodo(createTodo({ id: '2', title: 'Read book' }))
        result.current.setSearch('buy')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].id).toBe('1')
    })

    it('filters by detail', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', detail: 'urgent task' }))
        result.current.addTodo(createTodo({ id: '2', detail: 'normal task' }))
        result.current.setSearch('urgent')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].id).toBe('1')
    })

    it('filters by category', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', category: 'Work' }))
        result.current.addTodo(createTodo({ id: '2', category: 'Personal' }))
        result.current.setSearch('work')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].id).toBe('1')
    })

    it('is case-insensitive', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', title: 'Buy groceries' }))
        result.current.setSearch('BUY')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
    })
  })

  describe('category filter', () => {
    it('filters by selected category', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', category: 'Work' }))
        result.current.addTodo(createTodo({ id: '2', category: 'Personal' }))
        result.current.setSelectedCategory('Work')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].category).toBe('Work')
    })
  })

  describe('status filter', () => {
    it('filters completed todos', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', completed: true }))
        result.current.addTodo(createTodo({ id: '2', completed: false }))
        result.current.setStatusFilter('completed')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].completed).toBe(true)
    })

    it('filters pending todos', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', completed: true }))
        result.current.addTodo(createTodo({ id: '2', completed: false }))
        result.current.setStatusFilter('pending')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].completed).toBe(false)
    })

    it('filters overdue todos', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-06-15T10:00:00'))

      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(
          createTodo({ id: '1', deadline: '2026-01-01', completed: false }),
        )
        result.current.addTodo(
          createTodo({ id: '2', deadline: '2099-12-31', completed: false }),
        )
        result.current.setStatusFilter('overdue')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].id).toBe('1')

      vi.useRealTimers()
    })
  })

  describe('priority filter', () => {
    it('filters by priority', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', priority: 'High' }))
        result.current.addTodo(createTodo({ id: '2', priority: 'Low' }))
        result.current.setPriorityFilter('High')
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].priority).toBe('High')
    })
  })

  describe('sort', () => {
    it('sorts by deadline ascending', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', deadline: '2026-03-01' }))
        result.current.addTodo(createTodo({ id: '2', deadline: '2026-01-01' }))
        result.current.addTodo(createTodo({ id: '3', deadline: '2026-02-01' }))
        result.current.setSortBy('deadline')
      })

      expect(result.current.filteredTodos.map((t) => t.deadline)).toEqual([
        '2026-01-01',
        '2026-02-01',
        '2026-03-01',
      ])
    })

    it('sorts by priority (High to Low)', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', priority: 'Low' }))
        result.current.addTodo(createTodo({ id: '2', priority: 'High' }))
        result.current.addTodo(createTodo({ id: '3', priority: 'Medium' }))
        result.current.setSortBy('priority')
      })

      expect(result.current.filteredTodos.map((t) => t.priority)).toEqual([
        'High',
        'Medium',
        'Low',
      ])
    })

    it('sorts by name alphabetically', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', title: 'Banana' }))
        result.current.addTodo(createTodo({ id: '2', title: 'Apple' }))
        result.current.addTodo(createTodo({ id: '3', title: 'Cherry' }))
        result.current.setSortBy('name')
      })

      expect(result.current.filteredTodos.map((t) => t.title)).toEqual([
        'Apple',
        'Banana',
        'Cherry',
      ])
    })
  })

  describe('date filter', () => {
    it('filters by today when showAllTasks is false', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-01-15T10:00:00'))

      const { result } = renderHook(() => useFilteredTodos(false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', deadline: '2026-01-15' }))
        result.current.addTodo(createTodo({ id: '2', deadline: '2026-01-16' }))
      })

      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].id).toBe('1')

      vi.useRealTimers()
    })

    it('shows all todos when showAllTasks is true', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addTodo(createTodo({ id: '1', deadline: '2026-01-15' }))
        result.current.addTodo(createTodo({ id: '2', deadline: '2099-12-31' }))
      })

      expect(result.current.filteredTodos).toHaveLength(2)
    })
  })

  describe('isFilterActive', () => {
    it('returns true when a filter is active', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setStatusFilter('completed')
      })

      expect(result.current.isFilterActive).toBe(true)
    })

    it('returns false when all filters are default', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      expect(result.current.isFilterActive).toBe(false)
    })
  })

  describe('selection', () => {
    it('toggleSelect adds and removes id', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.toggleSelect('1')
      })
      expect(result.current.selectedIds).toEqual(['1'])

      act(() => {
        result.current.toggleSelect('2')
      })
      expect(result.current.selectedIds).toEqual(['1', '2'])

      act(() => {
        result.current.toggleSelect('1')
      })
      expect(result.current.selectedIds).toEqual(['2'])
    })

    it('cancelSelectMode resets selection and mode', () => {
      const { result } = renderHook(() => useFilteredTodos(true, false), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setSelectMode(true)
        result.current.toggleSelect('1')
        result.current.toggleSelect('2')
      })

      expect(result.current.selectMode).toBe(true)
      expect(result.current.selectedIds).toHaveLength(2)

      act(() => {
        result.current.cancelSelectMode()
      })

      expect(result.current.selectMode).toBe(false)
      expect(result.current.selectedIds).toEqual([])
    })
  })
})
