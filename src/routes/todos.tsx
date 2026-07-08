import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'

import type { Todo } from '@/lib/types'
import { TodoItem } from '@/components/TodoItem'
import { TodoForm } from '@/components/TodoForm'
import { TodoFilter } from '../components/TodoFilter'
import { useTodos } from '@/hooks/useTodos'
import { useState } from 'react'
import { DeadlineReminder } from '@/components/DeadlineReminder'

export const Route = createFileRoute('/todos')({
  component: TodosPage,
})

function TodosPage() {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos()
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTodos =
    selectedCategory === 'All'
      ? todos
      : todos.filter((todo) => todo.category === selectedCategory)

  function handleAddTodo(data: {
    title: string
    category: string
    deadline: string
  }) {
    const newTodo: Todo = {
      id: Date.now(),
      title: data.title,
      category: data.category,
      deadline: data.deadline,
      completed: false,
    }

    addTodo(newTodo)
  }

  

  return (
    <main className="mx-auto mt-10 max-w-xl">
      <Card>
        <CardContent className="space-y-6 p-6">
          <h1 className="text-3xl font-bold">My Todo List</h1>

          <DeadlineReminder todos={todos} />
          <TodoForm onAddTodo={handleAddTodo} />
          <TodoFilter
            value={selectedCategory}
            onChange={setSelectedCategory}
            categories={Array.from(new Set(todos.map((todo) => todo.category)))}
          />

          <div className="space-y-2">
            {filteredTodos.length === 0 && (
              <p className="text-muted-foreground">
                No todos yet. Add one above!
              </p>
            )}

            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggle={toggleTodo}
                onUpdate={updateTodo}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
