import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Todo } from '@/lib/types'
import { getNextDeadline } from '@/lib/repeat'

type TodosContextType = {
  todos: Todo[]
  addTodo: (todo: Todo) => void
  deleteTodo: (id: number) => void
  deleteMany: (ids: number[]) => void
  toggleTodo: (id: number) => void
  updateTodo: (updatedTodo: Todo) => void
  archiveTodo: (id: number) => void
  archiveMany: (ids: number[]) => void
  restoreTodo: (id: number) => void
  deletePermanently: (id: number) => void
  deleteManyArchived: (ids: number[]) => void
}

const TodosContext = createContext<TodosContextType | null>(null)

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') return []
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo(todo: Todo) {
    setTodos((prev) => [...prev, todo])
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  function deleteMany(ids: number[]) {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)))
  }

  function toggleTodo(id: number) {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const wasCompleted = todo.completed
    const newCompleted = !wasCompleted

    setTodos((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: newCompleted } : t,
      )

      if (!wasCompleted && newCompleted && todo.repeat !== 'none') {
        const nextDeadline = getNextDeadline(todo.deadline, todo.repeat)
        const exists = prev.some(
          (t) =>
            t.title === todo.title &&
            t.category === todo.category &&
            t.deadline === nextDeadline &&
            !t.completed,
        )
        if (!exists) {
          const newTodo: Todo = {
            ...todo,
            id: Date.now(),
            deadline: nextDeadline,
            completed: false,
          }
          return [...updated, newTodo]
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

  function archiveTodo(id: number) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, archived: true } : todo)),
    )
  }

  function archiveMany(ids: number[]) {
    setTodos((prev) =>
      prev.map((todo) =>
        ids.includes(todo.id) ? { ...todo, archived: true } : todo,
      ),
    )
  }

  function restoreTodo(id: number) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, archived: false, completed: false } : todo,
      ),
    )
  }

  function deletePermanently(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  function deleteManyArchived(ids: number[]) {
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
        archiveMany,
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
