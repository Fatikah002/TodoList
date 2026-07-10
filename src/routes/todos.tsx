import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import type { Todo } from '@/lib/types'
import { TodoItem } from '@/components/TodoItem'
import { TodoFilter } from '@/components/TodoFilter'
import { DeadlineReminder } from '@/components/DeadlineReminder'
import { HorizontalCalendar } from '@/components/HorizontalCalendar'
import { Button } from '@/components/ui/button'
import { useTodos } from '@/hooks/useTodos'
import { useState } from 'react'
import { Plus, X, Search } from 'lucide-react'
import { formatLocalDate } from '@/lib/date'
import { TodoDialog } from '@/components/TodoDialog'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/todos')({
  component: TodosPage,
})

function TodosPage() {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()))

  const categories = Array.from(new Set(todos.map((todo) => todo.category)))

  const filteredTodos = todos.filter((todo) => {
    const matchesCategory =
      selectedCategory === 'All' || todo.category === selectedCategory

    const matchesDate =
      search.trim() === '' ? todo.deadline === selectedDate : true

    const keyword = search.toLowerCase()

    const matchesSearch =
      todo.title.toLowerCase().includes(keyword) ||
      todo.detail.toLowerCase().includes(keyword) ||
      todo.category.toLowerCase().includes(keyword)

    return matchesCategory && matchesDate && matchesSearch
  })

  function handleAddTodo(data: {
    title: string
    detail: string
    category: string
    deadline: string
  }) {
    const newTodo: Todo = {
      id: Date.now(),
      title: data.title,
      detail: data.detail,
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

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search todo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

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
