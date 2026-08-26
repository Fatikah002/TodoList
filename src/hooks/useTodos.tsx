import { createContext, useContext, useState, useEffect, useRef } from 'react'
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

function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return []
  try {
    const key = getTodosKey()
    const raw = localStorage.getItem(key)
    if (raw) {
      return JSON.parse(raw)
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
    const key = getTodosKey()
    localStorage.setItem(key, JSON.stringify(todos))
  }, [todos])

  // Re-load todos when email changes (login/logout)
  useEffect(() => {
    const checkEmail = () => {
      const currentEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      if (currentEmail !== emailRef.current) {
        emailRef.current = currentEmail
        setTodos(loadTodos())
      }
    }

    const interval = setInterval(checkEmail, 500)
    return () => clearInterval(interval)
  }, [])

  function addTodo(todo: Todo) {
    setTodos((prev) => [...prev, todo])
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  function deleteMany(ids: string[]) {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)))
  }

  function toggleTodo(id: string) {
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
  }

  function updateTodo(updatedTodo: Todo) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    )
  }

  function archiveTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, archived: true } : todo)),
    )
  }

  function restoreTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, archived: false, completed: false } : todo,
      ),
    )
  }

  function deletePermanently(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  function deleteManyArchived(ids: string[]) {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)))
  }

  return (
    <TodosContext.Provider
      value={{
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
      }}
    >
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
