import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import type { Todo } from '@/lib/types'
import { TodoItem } from '@/components/TodoItem'
import { TodoForm } from '@/components/TodoForm'
import { TodoFilter } from '@/components/TodoFilter'
import { DeadlineReminder } from '@/components/DeadlineReminder'
import { HorizontalCalendar } from '@/components/HorizontalCalendar'
import { Button } from '@/components/ui/button'
import { useTodos } from '@/hooks/useTodos'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { formatLocalDate } from '@/lib/date'
import { TodoDialog } from '@/components/TodoDialog'

export const Route = createFileRoute('/todos')({
  component: TodosPage,
})

function TodosPage() {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos()
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()))

  const categories = Array.from(new Set(todos.map((todo) => todo.category)))

  const filteredTodos = todos.filter((todo) => {
    const matchesCategory =
      selectedCategory === 'All' || todo.category === selectedCategory
    const matchesDate = todo.deadline === selectedDate
    return matchesCategory && matchesDate
  })

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
    <main className="flex justify-center px-6 py-10">
      <Card className="w-full max-w-xl">
        <CardContent className="space-y-3 p-6">
          <div className="flex items-center justify-between ">
            <TodoFilter
              value={selectedCategory}
              onChange={setSelectedCategory}
              categories={categories}
            />

            <h1 className="text-lg font-semibold">Today</h1>

            <Button
              onClick={() => setShowForm(!showForm)}
              className="h-8 w-14 rounded-full text-white bg-green-500 hover:bg-green-600"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
            </Button>
          </div>

          <HorizontalCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <DeadlineReminder todos={todos} />
          {showForm && (
            <TodoDialog
              isOpen={showForm}
              onClose={() => setShowForm(false)}
              title="Add Todo"
              submitLabel="Add Todo"
              onSubmit={handleAddTodo}
            />
          )}

          <div className="space-y-2">
            {filteredTodos.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
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
