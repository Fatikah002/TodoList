import { useState, useEffect } from 'react'
import type { Todo } from '@/lib/types'
import { getNextDeadline } from '@/lib/repeat'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo(todo: Todo) {
    setTodos((prevTodos) => [...prevTodos, todo])
  }

  function deleteTodo(id: number) {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  function deleteMany(ids: number[]) {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => !ids.includes(todo.id)),
    )
  }

  function toggleTodo(id: number) {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const wasCompleted = todo.completed
    const newCompleted = !wasCompleted

    setTodos((prevTodos) => {
      const updated = prevTodos.map((t) =>
        t.id === id ? { ...t, completed: newCompleted } : t,
      )

      if (!wasCompleted && newCompleted && todo.repeat !== 'none') {
        const nextDeadline = getNextDeadline(todo.deadline, todo.repeat)
        const exists = prevTodos.some(
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
   setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    )
  }

  function archiveTodo(id: number) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, archived: true } : todo,
      ),
    )
  }

  function archiveMany(ids: number[]) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        ids.includes(todo.id) ? { ...todo, archived: true } : todo,
      ),
    )
  }

  function restoreTodo(id: number) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, archived: false, completed: false } : todo,
      ),
    )
  }

  function deletePermanently(id: number) {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  function deleteManyArchived(ids: number[]) {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => !ids.includes(todo.id)),
    )
  }

  return {
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
  }
}
