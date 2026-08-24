import { Link } from '@tanstack/react-router'
import { ChevronRight, Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import type { Todo } from '@/lib/types'
import { format } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

type TodayTasksSectionProps = {
  todos: Todo[]
  onToggleTodo: (id: string) => void
  onAddTodo: (title: string) => void
}

export function TodayTasksSection({
  todos,
  onToggleTodo,
  onAddTodo,
}: TodayTasksSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  function handleSubmit() {
    const trimmed = newTitle.trim()
    if (trimmed) {
      onAddTodo(trimmed)
      setNewTitle('')
      setIsAdding(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setNewTitle('')
      setIsAdding(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex h-[200px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Today's Tasks
        </h2>

        <Link
          to="/todos"
          search={
            {
              view: 'today',
              status: 'all',
              priority: 'all',
              category: 'All',
              sort: 'none',
            } as const
          }
          className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-600"
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {todos
          .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))
          .slice(0, 5)
          .map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => onToggleTodo(todo.id)}
                  className="h-4 w-4"
                />
                <p
                  className={`flex-1 truncate text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                >
                  {todo.title}
                </p>
              </div>

              <p className="shrink-0 whitespace-nowrap text-xs text-gray-500">
                {format(new Date(todo.deadline), 'dd MMM yyyy')}
                {todo.dueTime && ` ${todo.dueTime}`}
              </p>
            </div>
          ))}

        {isAdding ? (
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 shrink-0 text-green-500" />
            <Input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSubmit}
              placeholder="Type a task title..."
              className="h-8 border-0 bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-sm font-medium text-green-500 transition-colors hover:text-green-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add a Task</span>
          </button>
        )}
      </div>
    </section>
  )
}
