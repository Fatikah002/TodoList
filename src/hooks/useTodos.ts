import { useState, useEffect } from 'react'
import type { Todo } from '@/lib/types'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      return JSON.parse(storedTodos)
    }
    return []

  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo(todo: Todo) {
    setTodos((prevTodos) => [...prevTodos, todo])
  }

  function deleteTodo(id: number) {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  function toggleTodo(id: number) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
            ...todo,
            completed: !todo.completed,
          }
          : todo,
      ),
    )
  }

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
  }
}
