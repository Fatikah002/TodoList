import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Todo } from '@/lib/types'
import { getNextDeadline } from '@/lib/repeat'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'

const LEGACY_TODOS_KEY = 'todos'

function getTodosKey(): string {
  if (typeof window === 'undefined') return LEGACY_TODOS_KEY
  const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
  return email ? `todos_${email}` : LEGACY_TODOS_KEY
}

function isValidTodo(data: unknown): data is Todo {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'deadline' in data &&
    'completed' in data &&
    'archived' in data &&
    typeof (data as Todo).id === 'string' &&
    typeof (data as Todo).title === 'string'
  )
}

function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return []
  try {
    const key = getTodosKey()
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(isValidTodo)
      }
    }
    return []
  } catch {
    return []
  }
}

type TodosContextType = {
  todos: Todo[]
  addTodo: (todo: Todo) => void
  deleteTodo: (id: string) => void
  deleteMany: (ids: string[]) => void
  toggleTodo: (id: string) => void
  updateTodo: (updatedTodo: Todo) => void
  archiveTodo: (id: string) => void
  restoreTodo: (id: string) => void
  deletePermanently: (id: string) => void
  deleteManyArchived: (ids: string[]) => void
}

const TodosContext = createContext<TodosContextType | null>(null)

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const emailRef = useRef<string | null>(
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      : null,
  )

  useEffect(() => {
    try {
      const key = getTodosKey()
      localStorage.setItem(key, JSON.stringify(todos))
    } catch {
      // ignore storage errors (e.g. quota exceeded)
    }
  }, [todos])

  // Re-load todos when email changes (login/logout)
  useEffect(() => {
    function handleEmailChange() {
      const currentEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      if (currentEmail !== emailRef.current) {
        emailRef.current = currentEmail
        setTodos(loadTodos())
      }
    }

    window.addEventListener('storage', handleEmailChange)
    window.addEventListener('email-changed', handleEmailChange)
    return () => {
      window.removeEventListener('storage', handleEmailChange)
      window.removeEventListener('email-changed', handleEmailChange)
    }
  }, [])

  const addTodo = useCallback((todo: Todo) => {
    setTodos((prev) => [...prev, todo])
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const deleteMany = useCallback((ids: string[]) => {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)))
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const todo = prev.find((t) => t.id === id)
      if (!todo) return prev

      const newCompleted = !todo.completed

      const updated = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: newCompleted,
              completedAt: newCompleted ? new Date().toISOString() : undefined,
            }
          : t,
      )

      if (!todo.completed && newCompleted && todo.repeat !== 'none') {
        const nextDeadline = getNextDeadline(todo.deadline, todo.repeat)
        const exists = prev.some(
          (t) =>
            t.title === todo.title &&
            t.category === todo.category &&
            t.deadline === nextDeadline &&
            !t.completed,
        )
        if (!exists) {
          return [
            ...updated,
            {
              ...todo,
              id: generateId(),
              deadline: nextDeadline,
              completed: false,
            },
          ]
        }
      }

      return updated
    })
  }, [])

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    )
  }, [])

  const archiveTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, archived: true } : todo)),
    )
  }, [])

  const restoreTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, archived: false, completed: false } : todo,
      ),
    )
  }, [])

  const deletePermanently = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const deleteManyArchived = useCallback((ids: string[]) => {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)))
  }, [])

  const value = useMemo(() => ({
    todos,
    addTodo,
    deleteTodo,
    deleteMany,
    toggleTodo,
    updateTodo,
    archiveTodo,
    restoreTodo,
    deletePermanently,
    deleteManyArchived,
  }), [todos, addTodo, deleteTodo, deleteMany, toggleTodo, updateTodo, archiveTodo, restoreTodo, deletePermanently, deleteManyArchived])

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  )
}

export function useTodos() {
  const context = useContext(TodosContext)
  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider')
  }
  return context
}
